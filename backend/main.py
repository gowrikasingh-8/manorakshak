"""Manorakshak demo API.

The demo stores data locally in SQLite and performs all distress scoring offline.
Risk bands are triage signals only; they are not a diagnosis or emergency service.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import secrets
import tempfile
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from typing import Any, Literal

import jwt
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker
from starlette.types import ASGIApp, Receive, Scope, Send


APP_DIR = os.path.dirname(os.path.abspath(__file__))
IS_VERCEL = os.getenv("VERCEL") == "1" or bool(os.getenv("VERCEL_ENV"))
DEFAULT_DATABASE_PATH = os.path.join(
    tempfile.gettempdir() if IS_VERCEL else APP_DIR,
    "manorakshak.db",
)
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DATABASE_PATH}")
JWT_SECRET = os.getenv("MANORAKSHAK_JWT_SECRET", "local-demo-only-change-before-deployment")
JWT_ALGORITHM = "HS256"
TOKEN_HOURS = 24
DEMO_MODE = os.getenv("MANORAKSHAK_DEMO_MODE", "true").strip().lower() in {"1", "true", "yes"}
DEMO_ACCOUNTS = {
    "victim": ("user@demo.com", "demo1234", "Asha", "V-1042"),
    "family": ("family@demo.com", "demo1234", "Riya", "F-2101"),
    "counsellor": ("counsellor@demo.com", "demo1234", "Meera", "C-3001"),
    "admin": ("admin@demo.com", "demo1234", "Admin", "A-0001"),
}
LOCALHOST_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:4173",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:5173",
]


def cors_origins() -> list[str]:
    configured = [
        origin.strip().rstrip("/")
        for origin in os.getenv("CORS_ORIGINS", "").split(",")
        if origin.strip()
    ]
    for variable in ("FRONTEND_URL", "VERCEL_URL"):
        host = os.getenv(variable, "").strip()
        if host:
            configured.append(host if "://" in host else f"https://{host}")
    return list(dict.fromkeys(["*", *LOCALHOST_ORIGINS, *configured]))

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    display_name: Mapped[str] = mapped_column(String(120))
    role: Mapped[str] = mapped_column(String(24), index=True)
    masked_id: Mapped[str] = mapped_column(String(24), unique=True)
    consented: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class CheckIn(Base):
    __tablename__ = "checkins"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    answers_json: Mapped[str] = mapped_column(Text)
    note: Mapped[str] = mapped_column(Text, default="")
    score: Mapped[int] = mapped_column(Integer)
    risk_band: Mapped[str] = mapped_column(String(16), index=True)
    reasons_json: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    sender: Mapped[str] = mapped_column(String(16))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Case(Base):
    __tablename__ = "cases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    assigned_to: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(160))
    status: Mapped[str] = mapped_column(String(24), default="open", index=True)
    priority: Mapped[str] = mapped_column(String(16), default="moderate")
    summary: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class CaseNote(Base):
    __tablename__ = "case_notes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(ForeignKey("cases.id"), index=True)
    author_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    actor_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    action: Mapped[str] = mapped_column(String(80))
    resource_type: Mapped[str] = mapped_column(String(40))
    resource_id: Mapped[str] = mapped_column(String(80))
    details_json: Mapped[str] = mapped_column(Text, default="{}")
    previous_hash: Mapped[str] = mapped_column(String(64))
    event_hash: Mapped[str] = mapped_column(String(64), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 310_000)
    return f"{salt.hex()}${digest.hex()}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        salt_hex, digest_hex = encoded.split("$", 1)
        digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), bytes.fromhex(salt_hex), 310_000)
        return hmac.compare_digest(digest.hex(), digest_hex)
    except (ValueError, TypeError):
        return False


def masked_identifier(user: User) -> str:
    return user.masked_id


def audit(
    db: Session,
    actor_id: str | None,
    action: str,
    resource_type: str,
    resource_id: str,
    details: dict[str, Any] | None = None,
) -> None:
    previous = db.scalar(select(AuditEvent).order_by(AuditEvent.id.desc()).limit(1))
    previous_hash = previous.event_hash if previous else "0" * 64
    created_at = datetime.now(timezone.utc)
    payload = {
        "actorId": actor_id,
        "action": action,
        "resourceType": resource_type,
        "resourceId": resource_id,
        "details": details or {},
        "previousHash": previous_hash,
        "createdAt": utc_iso(created_at),
    }
    event_hash = hashlib.sha256(json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
    db.add(
        AuditEvent(
            actor_id=actor_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details_json=json.dumps(details or {}, separators=(",", ":")),
            previous_hash=previous_hash,
            event_hash=event_hash,
            created_at=created_at,
        )
    )
    db.flush()


def issue_token(user: User) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {"sub": user.id, "role": user.role, "iat": now, "exp": now + timedelta(hours=TOKEN_HOURS)},
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )


def utc_iso(value: datetime) -> str:
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc).isoformat()


bearer = HTTPBearer(auto_error=False)


def current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Bearer token required")
    try:
        claims = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if not isinstance(claims.get("sub"), str):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")
        user = db.get(User, claims.get("sub"))
    except HTTPException:
        raise
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from exc
    if not user or claims.get("role") != user.role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token user is unavailable")
    return user


def require_roles(*roles: str):
    def dependency(user: User = Depends(current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role clearance")
        return user

    return dependency


def camel_case(name: str) -> str:
    first, *rest = name.split("_")
    return first + "".join(part.capitalize() for part in rest)


def request_model_config():
    return ConfigDict(alias_generator=camel_case, populate_by_name=True, extra="forbid", strict=True)


class LoginRequest(BaseModel):
    model_config = request_model_config()
    email: EmailStr
    password: str = Field(min_length=1, max_length=256)


class RegisterRequest(BaseModel):
    model_config = request_model_config()
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    display_name: str = Field(min_length=1, max_length=120)
    role: Literal["victim", "family"]

    @field_validator("display_name")
    @classmethod
    def clean_display_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("displayName must not be blank")
        return value


class AdminCreateUserRequest(BaseModel):
    model_config = request_model_config()
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    display_name: str = Field(min_length=1, max_length=120)
    role: Literal["victim", "family", "counsellor", "admin"]

    @field_validator("display_name")
    @classmethod
    def clean_display_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("displayName must not be blank")
        return value


class ConsentRequest(BaseModel):
    model_config = request_model_config()
    consented: bool
    version: str = Field(default="demo-v1", max_length=40)


class CheckInRequest(BaseModel):
    model_config = request_model_config()
    answers: dict[str, Any] = Field(default_factory=dict)
    note: str = Field(default="", max_length=4000)


class JournalRequest(BaseModel):
    model_config = request_model_config()
    content: str = Field(min_length=1, max_length=10000)

    @field_validator("content")
    @classmethod
    def trim_content(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("content must not be blank")
        return value


class ChatRequest(BaseModel):
    model_config = request_model_config()
    content: str = Field(min_length=1, max_length=4000)
    language: Literal["en", "hi"] = "en"

    @field_validator("content")
    @classmethod
    def trim_content(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("content must not be blank")
        return value


class CaseUpdateRequest(BaseModel):
    model_config = request_model_config()
    status: Literal["open", "in_progress", "referred", "resolved"]
    priority: Literal["low", "moderate", "high", "critical"] | None = None
    assigned_to: str | None = None
    summary: str | None = Field(default=None, max_length=4000)


class CaseNoteRequest(BaseModel):
    model_config = request_model_config()
    content: str = Field(min_length=1, max_length=4000)

    @field_validator("content")
    @classmethod
    def trim_content(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("content must not be blank")
        return value


class DemoTokenRequest(BaseModel):
    model_config = request_model_config()
    role: Literal["victim", "family", "counsellor", "admin"]


RISK_TERMS: dict[str, dict[str, list[str]]] = {
    "critical": {
        "en": ["kill myself", "end my life", "suicide", "self harm", "hurt myself", "not safe"],
        "hi": ["आत्महत्या", "खुदकुशी", "खुद को मार", "जीना नहीं", "मर जाना", "सुरक्षित नहीं"],
    },
    "high": {
        "en": ["hopeless", "helpless", "panic", "terrified", "abuse", "threatened", "trapped", " डर"],
        "hi": ["निराश", "बेबस", "घबराहट", "डर लग", "धमकी", "फंसा", "परेशान"],
    },
    "moderate": {
        "en": ["anxious", "overwhelmed", "stressed", "lonely", "sad", "worried", "can't cope", "cannot cope"],
        "hi": ["चिंता", "तनाव", "अकेला", "उदास", "परेशान", "बेचैन", "डर"],
    },
}
BAND_WEIGHT = {"low": 0, "moderate": 25, "high": 55, "critical": 85}
SENTIMENT_TERMS = {
    "positive": ["hopeful", "good", "calm", "safe", "grateful", "happy", "ठीक", "अच्छा", "खुश", "सुरक्षित", "आशा"],
    "negative": ["sad", "anxious", "overwhelmed", "lonely", "hopeless", "afraid", "उदास", "चिंता", "अकेला", "डर", "निराश", "तनाव"],
}


def analyze_text(text: str) -> dict[str, Any]:
    normalized = text.casefold()
    matches: list[tuple[str, str]] = []
    for band, languages in RISK_TERMS.items():
        for terms in languages.values():
            for term in terms:
                if term.casefold() in normalized:
                    matches.append((band, term))
    strongest = max((band for band, _ in matches), key=lambda band: BAND_WEIGHT[band], default="low")
    unique_terms = list(dict.fromkeys(term for _, term in matches))
    score = min(100, BAND_WEIGHT[strongest] + max(0, len(unique_terms) - 1) * 5)
    band = "critical" if score >= 85 else "high" if score >= 55 else "moderate" if score >= 25 else "low"
    reasons = [f"Matched distress marker: “{term}”" for term in unique_terms]
    if not reasons:
        reasons.append("No configured distress markers detected in this text.")
    sentiments = {
        label: any(term.casefold() in normalized for term in terms)
        for label, terms in SENTIMENT_TERMS.items()
    }
    sentiment = (
        "mixed"
        if sentiments["positive"] and sentiments["negative"]
        else "positive"
        if sentiments["positive"]
        else "negative"
        if sentiments["negative"]
        else "neutral"
    )
    return {
        "score": score,
        "riskBand": band,
        "reasons": reasons,
        "sentiment": sentiment,
        "isDiagnostic": False,
    }


def analyze_checkin(answers: dict[str, Any], note: str = "") -> dict[str, Any]:
    result = analyze_text(note + " " + " ".join(str(value) for value in answers.values()))
    score = result["score"]
    reasons = list(result["reasons"])

    answer_values = [str(value).casefold() for value in answers.values()]
    answer_text = " ".join(answer_values)
    metric_markers = {
        "overwhelmed": (20, "Check-in marked the emotional state as overwhelmed."),
        "severe": (25, "Check-in reported intense or prolonged distress spikes."),
        "no-couldnt": (15, "Check-in reported difficulty using grounding strategies."),
        "heavy-fog": (15, "Check-in reported heavy mental fog or dissociation."),
        "insufficient": (10, "Check-in reported very little or no sleep."),
        "nightmares": (10, "Check-in reported sleep disturbed by nightmares or anxiety."),
        "struggled": (15, "Check-in reported difficulty meeting basic daily needs."),
        "isolated": (10, "Check-in reported feeling isolated or unsupported."),
    }
    for marker, (weight, reason) in metric_markers.items():
        if marker in answer_text:
            score += weight
            reasons.append(reason)
    score = min(score, 100)
    band = "critical" if score >= 85 else "high" if score >= 55 else "moderate" if score >= 25 else "low"
    sentiment = analyze_text(" ".join(answer_values) + " " + note)["sentiment"]
    return {
        "score": score,
        "riskBand": band,
        "reasons": reasons,
        "sentiment": sentiment,
        "isDiagnostic": False,
    }


def user_payload(user: User) -> dict[str, Any]:
    return {
        "id": user.id,
        "maskedId": masked_identifier(user),
        "displayName": user.display_name,
        "role": user.role,
        "email": user.email,
        "consented": user.consented,
    }


def case_payload(db: Session, case: Case, include_identity: bool = False) -> dict[str, Any]:
    subject = db.get(User, case.user_id)
    assignee = db.get(User, case.assigned_to) if case.assigned_to else None
    payload = {
        "id": case.id,
        "maskedId": masked_identifier(subject) if subject else "V-****",
        "title": case.title,
        "status": case.status,
        "priority": case.priority,
        "summary": case.summary,
        "assignedTo": assignee.display_name if assignee else None,
        "createdAt": utc_iso(case.created_at),
        "updatedAt": utc_iso(case.updated_at),
    }
    if include_identity and subject:
        payload["subject"] = user_payload(subject)
    return payload


def require_consent(user: User) -> None:
    if user.role == "victim" and not user.consented:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Consent is required before submitting personal data")


def create_case_for_risk(db: Session, user: User, risk: dict[str, Any], note: str) -> Case | None:
    if risk["riskBand"] not in {"high", "critical"}:
        return None
    case = Case(
        user_id=user.id,
        title="Elevated distress check-in",
        priority=risk["riskBand"],
        summary=("Automated, non-diagnostic check-in triage. " + note[:300]).strip(),
    )
    db.add(case)
    db.flush()
    audit(db, user.id, "case.auto_escalated", "case", case.id, {"riskBand": risk["riskBand"]})
    return case


def seed_demo_data() -> None:
    Base.metadata.create_all(engine)
    if not DEMO_MODE:
        return
    with SessionLocal() as db:
        for role, (email, password, name, masked_id) in DEMO_ACCOUNTS.items():
            if not db.scalar(select(User).where(User.email == email)):
                db.add(
                    User(
                        email=email,
                        password_hash=hash_password(password),
                        display_name=name,
                        role=role,
                        masked_id=masked_id,
                        consented=role != "victim",
                    )
                )
        db.flush()
        victim = db.scalar(select(User).where(User.email == DEMO_ACCOUNTS["victim"][0]))
        counsellor = db.scalar(select(User).where(User.email == DEMO_ACCOUNTS["counsellor"][0]))
        if victim and counsellor:
            if not db.scalar(select(CheckIn).where(CheckIn.user_id == victim.id)):
                for answers, note in [
                    ({"overall_emotional_state": "okay", "sleep_quality": "restful"}, ""),
                    ({"overall_emotional_state": "uneasy", "social_connection": "isolated"}, "Feeling anxious about the week."),
                ]:
                    result = analyze_checkin(answers, note)
                    db.add(
                        CheckIn(
                            user_id=victim.id,
                            answers_json=json.dumps(answers),
                            note=note,
                            score=result["score"],
                            risk_band=result["riskBand"],
                            reasons_json=json.dumps(result["reasons"], ensure_ascii=False),
                        )
                    )
            if not db.scalar(select(Case).where(Case.user_id == victim.id)):
                case = Case(
                    user_id=victim.id,
                    assigned_to=counsellor.id,
                    title="Wellbeing follow-up",
                    status="in_progress",
                    priority="moderate",
                    summary="Demo case seeded for dashboard walkthrough.",
                )
                db.add(case)
                db.flush()
                audit(db, counsellor.id, "case.seeded", "case", case.id, {"demo": True})
        db.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    seed_demo_data()
    yield


app = FastAPI(
    title="Manorakshak API",
    version="1.0.0",
    description="Offline, consent-first demo API. Risk bands are non-diagnostic and are not emergency care.",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ApiPrefixMiddleware:
    def __init__(self, asgi_app: ASGIApp) -> None:
        self.asgi_app = asgi_app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] in {"http", "websocket"}:
            path = scope.get("path", "")
            if path == "/api" or path.startswith("/api/"):
                scope = dict(scope)
                scope["path"] = path[4:] or "/"
                raw_path = scope.get("raw_path", b"")
                if raw_path == b"/api" or raw_path.startswith(b"/api/"):
                    scope["raw_path"] = raw_path[4:] or b"/"
                root_path = scope.get("root_path", "").rstrip("/")
                if not root_path.endswith("/api"):
                    scope["root_path"] = f"{root_path}/api"
        await self.asgi_app(scope, receive, send)


app.add_middleware(ApiPrefixMiddleware)


@app.get("/")
def home():
    return {"message": "Manorakshak backend is running", "docs": "/docs", "apiVersion": "1.0.0"}


@app.get("/health")
def health(db: Session = Depends(get_db)):
    db.execute(select(1))
    return {"status": "ok", "database": "connected", "nlp": "offline-rule-based"}


auth = APIRouter(prefix="/auth", tags=["Authentication"])
victim = APIRouter(prefix="/victim", tags=["Victim"])
chat = APIRouter(prefix="/chat", tags=["Support chat"])
cases = APIRouter(prefix="/cases", tags=["Cases"])
alerts = APIRouter(prefix="/alerts", tags=["Alerts"])
dashboards = APIRouter(prefix="/dashboards", tags=["Dashboards"])
audit_router = APIRouter(prefix="/audit", tags=["Audit"])


@auth.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    email = str(payload.email).lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")
    user = User(
        email=email,
        password_hash=hash_password(payload.password),
        display_name=payload.display_name,
        role=payload.role,
        masked_id=f"{payload.role[:1].upper()}-{secrets.token_hex(3).upper()}",
        consented=payload.role != "victim",
    )
    db.add(user)
    db.flush()
    audit(db, user.id, "auth.registered", "user", user.masked_id, {"role": user.role})
    db.commit()
    return {"accessToken": issue_token(user), "tokenType": "bearer", "expiresIn": TOKEN_HOURS * 3600, "user": user_payload(user)}


@auth.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(
    payload: AdminCreateUserRequest,
    actor: User = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    email = str(payload.email).lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")
    new_user = User(
        email=email,
        password_hash=hash_password(payload.password),
        display_name=payload.display_name,
        role=payload.role,
        masked_id=f"{payload.role[:1].upper()}-{secrets.token_hex(3).upper()}",
        consented=payload.role != "victim",
    )
    db.add(new_user)
    db.flush()
    audit(db, actor.id, "auth.user_created", "user", new_user.masked_id, {"role": new_user.role})
    db.commit()
    return user_payload(new_user)


@auth.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email = str(payload.email).lower()
    if not DEMO_MODE and email in {account[0] for account in DEMO_ACCOUNTS.values()}:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    user = db.scalar(select(User).where(User.email == email))
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    audit(db, user.id, "auth.login", "user", user.masked_id)
    db.commit()
    return {"accessToken": issue_token(user), "tokenType": "bearer", "expiresIn": TOKEN_HOURS * 3600, "user": user_payload(user)}


@auth.post("/demo-token")
def demo_token(payload: DemoTokenRequest, db: Session = Depends(get_db)):
    if not DEMO_MODE:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Demo mode is disabled")
    account = DEMO_ACCOUNTS[payload.role]
    user = db.scalar(select(User).where(User.email == account[0]))
    if not user:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Demo account seeding did not complete")
    audit(db, user.id, "auth.demo_token_issued", "user", user.masked_id, {"role": user.role})
    db.commit()
    return {"accessToken": issue_token(user), "tokenType": "bearer", "expiresIn": TOKEN_HOURS * 3600, "user": user_payload(user)}


@auth.get("/me")
def me(user: User = Depends(current_user)):
    return user_payload(user)


@victim.get("/consent")
def get_consent(user: User = Depends(current_user)):
    return {"consented": user.consented, "consentVersion": "demo-v1", "requiredBeforeSubmission": user.role == "victim"}


@victim.post("/consent")
def set_consent(
    payload: ConsentRequest,
    user: User = Depends(require_roles("victim")),
    db: Session = Depends(get_db),
):
    user.consented = payload.consented
    audit(db, user.id, "consent.updated", "user", user.masked_id, {"consented": payload.consented, "version": payload.version})
    db.commit()
    return {"consented": user.consented, "consentVersion": payload.version}


@victim.post("/checkins", status_code=status.HTTP_201_CREATED)
def create_checkin(
    payload: CheckInRequest,
    user: User = Depends(require_roles("victim")),
    db: Session = Depends(get_db),
):
    require_consent(user)
    result = analyze_checkin(payload.answers, payload.note)
    checkin = CheckIn(
        user_id=user.id,
        answers_json=json.dumps(payload.answers, ensure_ascii=False),
        note=payload.note,
        score=result["score"],
        risk_band=result["riskBand"],
        reasons_json=json.dumps(result["reasons"], ensure_ascii=False),
    )
    db.add(checkin)
    db.flush()
    created_case = create_case_for_risk(db, user, result, payload.note)
    audit(db, user.id, "checkin.created", "checkin", checkin.id, {"riskBand": result["riskBand"]})
    db.commit()
    return {
        "id": checkin.id,
        "score": checkin.score,
        "riskBand": checkin.risk_band,
        "reasons": result["reasons"],
        "sentiment": result["sentiment"],
        "isDiagnostic": False,
        "createdAt": utc_iso(checkin.created_at),
        "caseCreated": created_case is not None,
    }


@victim.get("/checkins")
def list_checkins(
    limit: int = Query(default=30, ge=1, le=100),
    user: User = Depends(require_roles("victim")),
    db: Session = Depends(get_db),
):
    require_consent(user)
    records = db.scalars(
        select(CheckIn).where(CheckIn.user_id == user.id).order_by(CheckIn.created_at.desc()).limit(limit)
    ).all()
    audit(db, user.id, "checkins.viewed", "user", user.masked_id, {"count": len(records)})
    db.commit()
    return [
        {
            "id": row.id,
            "answers": json.loads(row.answers_json),
            "note": row.note,
            "score": row.score,
            "riskBand": row.risk_band,
            "reasons": json.loads(row.reasons_json),
            "sentiment": analyze_checkin(json.loads(row.answers_json), row.note)["sentiment"],
            "isDiagnostic": False,
            "createdAt": utc_iso(row.created_at),
        }
        for row in records
    ]


@victim.post("/journal", status_code=status.HTTP_201_CREATED)
def create_journal_entry(
    payload: JournalRequest,
    user: User = Depends(require_roles("victim")),
    db: Session = Depends(get_db),
):
    require_consent(user)
    entry = JournalEntry(user_id=user.id, content=payload.content.strip())
    db.add(entry)
    db.flush()
    audit(db, user.id, "journal.created", "journal", entry.id)
    db.commit()
    return {"id": entry.id, "createdAt": utc_iso(entry.created_at), "storedPrivately": True}


@victim.get("/journal")
def list_journal_entries(
    user: User = Depends(require_roles("victim")),
    db: Session = Depends(get_db),
):
    require_consent(user)
    entries = db.scalars(
        select(JournalEntry).where(JournalEntry.user_id == user.id).order_by(JournalEntry.created_at.desc())
    ).all()
    audit(db, user.id, "journal.viewed", "user", user.masked_id, {"count": len(entries)})
    db.commit()
    return [{"id": row.id, "content": row.content, "createdAt": utc_iso(row.created_at)} for row in entries]


@chat.get("/messages")
def get_messages(user: User = Depends(require_roles("victim")), db: Session = Depends(get_db)):
    require_consent(user)
    messages = db.scalars(
        select(ChatMessage).where(ChatMessage.user_id == user.id).order_by(ChatMessage.created_at.asc()).limit(200)
    ).all()
    audit(db, user.id, "chat.viewed", "chat", user.id, {"count": len(messages)})
    db.commit()
    return [{"id": m.id, "sender": m.sender, "content": m.content, "createdAt": utc_iso(m.created_at)} for m in messages]


@chat.post("/messages", status_code=status.HTTP_201_CREATED)
def send_message(
    payload: ChatRequest,
    user: User = Depends(require_roles("victim")),
    db: Session = Depends(get_db),
):
    require_consent(user)
    user_message = ChatMessage(user_id=user.id, sender="user", content=payload.content.strip())
    db.add(user_message)
    result = analyze_text(payload.content)
    urgent = result["riskBand"] in {"high", "critical"}
    if payload.language == "hi":
        response_text = (
            "आपने बताया, इसके लिए धन्यवाद। यदि आप तत्काल खतरे में हैं, तो कृपया अभी स्थानीय आपातकालीन सेवा या किसी भरोसेमंद व्यक्ति से संपर्क करें। यह डेमो आपातकालीन सहायता नहीं दे सकता।"
            if urgent
            else "इसे साझा करने के लिए धन्यवाद। मैं सुन रहा/रही हूँ। क्या एक छोटा ग्राउंडिंग अभ्यास या किसी सहायता व्यक्ति से जुड़ना उपयोगी लगेगा?"
        )
    else:
        response_text = (
            "I’m glad you told me. If you may be in immediate danger, please contact local emergency services or a trusted person now. "
            "This demo cannot provide emergency help."
            if urgent
            else "Thank you for sharing that. I’m listening. Would a short grounding exercise or connecting with a support person feel helpful?"
        )
    bot_message = ChatMessage(user_id=user.id, sender="bot", content=response_text)
    db.add(bot_message)
    db.flush()
    created_case = create_case_for_risk(db, user, result, payload.content)
    audit(db, user.id, "chat.message_sent", "chat", user.id, {"riskBand": result["riskBand"]})
    db.commit()
    return {
        "message": {"id": user_message.id, "sender": "user", "content": user_message.content, "createdAt": utc_iso(user_message.created_at)},
        "reply": {"id": bot_message.id, "sender": "bot", "content": bot_message.content, "createdAt": utc_iso(bot_message.created_at)},
        "analysis": result,
        "caseCreated": created_case is not None,
    }


@chat.delete("/messages")
def clear_messages(user: User = Depends(require_roles("victim")), db: Session = Depends(get_db)):
    require_consent(user)
    messages = db.scalars(select(ChatMessage).where(ChatMessage.user_id == user.id)).all()
    count = len(messages)
    for message in messages:
        db.delete(message)
    audit(db, user.id, "chat.cleared", "chat", user.id, {"deletedCount": count})
    db.commit()
    return {"deletedCount": count}


@cases.get("")
def list_cases(
    status_filter: str | None = Query(default=None, alias="status"),
    risk_band: str | None = Query(default=None, alias="riskBand"),
    user: User = Depends(require_roles("counsellor", "admin")),
    db: Session = Depends(get_db),
):
    query = select(Case).order_by(Case.updated_at.desc())
    if user.role == "counsellor":
        query = query.where((Case.assigned_to == user.id) | (Case.assigned_to.is_(None)))
    if status_filter:
        query = query.where(Case.status == status_filter)
    if risk_band:
        query = query.where(Case.priority == risk_band)
    records = db.scalars(query).all()
    audit(db, user.id, "cases.listed", "case_collection", "all", {"count": len(records)})
    db.commit()
    return [case_payload(db, row) for row in records]


@cases.get("/{case_id}")
def get_case(
    case_id: str,
    user: User = Depends(require_roles("counsellor", "admin")),
    db: Session = Depends(get_db),
):
    case = db.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")
    if user.role == "counsellor" and case.assigned_to not in (None, user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Case is assigned to another counsellor")
    audit(db, user.id, "case.viewed", "case", case.id)
    db.commit()
    notes = db.scalars(select(CaseNote).where(CaseNote.case_id == case.id).order_by(CaseNote.created_at.asc())).all()
    return {
        **case_payload(db, case, include_identity=True),
        "notes": [
            {
                "id": note.id,
                "author": db.get(User, note.author_id).display_name,
                "content": note.content,
                "createdAt": utc_iso(note.created_at),
            }
            for note in notes
        ],
        "riskNotice": "Risk bands are non-diagnostic and require human review.",
    }


@cases.patch("/{case_id}")
def update_case(
    case_id: str,
    payload: CaseUpdateRequest,
    user: User = Depends(require_roles("counsellor", "admin")),
    db: Session = Depends(get_db),
):
    case = db.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")
    if user.role == "counsellor" and case.assigned_to not in (None, user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Case is assigned to another counsellor")
    changes = payload.model_dump(exclude_unset=True)
    if "assigned_to" in changes and changes["assigned_to"]:
        assignee = db.get(User, changes["assigned_to"])
        if not assignee or assignee.role != "counsellor":
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="assignedTo must identify a counsellor")
    for field in ("status", "priority", "assigned_to", "summary"):
        if field in changes:
            setattr(case, field, changes[field])
    case.updated_at = datetime.now(timezone.utc)
    audit(db, user.id, "case.updated", "case", case.id, changes)
    db.commit()
    return case_payload(db, case)


@cases.post("/{case_id}/notes", status_code=status.HTTP_201_CREATED)
def add_case_note(
    case_id: str,
    payload: CaseNoteRequest,
    user: User = Depends(require_roles("counsellor", "admin")),
    db: Session = Depends(get_db),
):
    case = db.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")
    if user.role == "counsellor" and case.assigned_to not in (None, user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Case is assigned to another counsellor")
    note = CaseNote(case_id=case.id, author_id=user.id, content=payload.content.strip())
    db.add(note)
    case.updated_at = datetime.now(timezone.utc)
    db.flush()
    audit(db, user.id, "case.note_added", "case", case.id, {"noteId": note.id})
    db.commit()
    return {"id": note.id, "caseId": case.id, "createdAt": utc_iso(note.created_at)}


@cases.get("/analytics/summary")
def case_analytics(user: User = Depends(require_roles("counsellor", "admin")), db: Session = Depends(get_db)):
    query = select(Case)
    if user.role == "counsellor":
        query = query.where((Case.assigned_to == user.id) | (Case.assigned_to.is_(None)))
    records = db.scalars(query).all()
    audit(db, user.id, "cases.analytics_viewed", "case_collection", "all", {"count": len(records)})
    db.commit()
    distribution = {band: sum(1 for case in records if case.priority == band) for band in ("low", "moderate", "high", "critical")}
    return {
        "totalCases": len(records),
        "openCases": sum(1 for case in records if case.status in {"open", "in_progress"}),
        "riskBandDistribution": distribution,
        "isDiagnostic": False,
    }


@alerts.get("")
def list_alerts(
    user: User = Depends(require_roles("counsellor", "admin")),
    db: Session = Depends(get_db),
):
    query = select(Case).where(Case.priority.in_(["high", "critical"]), Case.status != "resolved").order_by(Case.updated_at.desc())
    if user.role == "counsellor":
        query = query.where((Case.assigned_to == user.id) | (Case.assigned_to.is_(None)))
    rows = db.scalars(query).all()
    audit(db, user.id, "alerts.viewed", "case_collection", "elevated", {"count": len(rows)})
    db.commit()
    return [
        {
            **case_payload(db, row),
            "alertType": "elevated_distress",
            "message": "Human review recommended; this automated signal is not diagnostic.",
        }
        for row in rows
    ]


@dashboards.get("/{role}")
def dashboard(
    role: Literal["victim", "family", "counsellor", "admin"],
    user: User = Depends(current_user),
    db: Session = Depends(get_db),
):
    if role != user.role and not (user.role == "admin" and role in {"counsellor", "admin"}):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot access this dashboard")
    if role == "victim":
        require_consent(user)
        entries = db.scalars(select(CheckIn).where(CheckIn.user_id == user.id).order_by(CheckIn.created_at.desc()).limit(10)).all()
        audit(db, user.id, "dashboard.viewed", "dashboard", "victim")
        db.commit()
        return {
            "maskedId": masked_identifier(user),
            "checkInCount": len(entries),
            "latestRiskBand": entries[0].risk_band if entries else None,
            "latestCheckIns": [
                {"id": row.id, "riskBand": row.risk_band, "score": row.score, "createdAt": utc_iso(row.created_at)}
                for row in entries
            ],
            "isDiagnostic": False,
        }
    if role == "family":
        audit(db, user.id, "dashboard.viewed", "dashboard", "family")
        db.commit()
        return {
            "maskedId": masked_identifier(user),
            "message": "Trusted-person demo dashboard. The linked person’s private journal and check-in details are not exposed.",
        }
    query = select(Case)
    if role == "counsellor":
        query = query.where((Case.assigned_to == user.id) | (Case.assigned_to.is_(None)))
    rows = db.scalars(query).all()
    audit(db, user.id, "dashboard.viewed", "dashboard", role, {"caseCount": len(rows)})
    db.commit()
    return {
        "totalCases": len(rows),
        "openCases": sum(1 for row in rows if row.status in {"open", "in_progress"}),
        "riskBandDistribution": {band: sum(1 for row in rows if row.priority == band) for band in ("low", "moderate", "high", "critical")},
        "recentCases": [case_payload(db, row) for row in rows[:10]],
        "isDiagnostic": False,
    }


@audit_router.get("")
def list_audit_events(
    limit: int = Query(default=100, ge=1, le=500),
    user: User = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    rows = db.scalars(select(AuditEvent).order_by(AuditEvent.id.desc()).limit(limit)).all()
    return [
        {
            "id": row.id,
            "actorId": row.actor_id,
            "action": row.action,
            "resourceType": row.resource_type,
            "resourceId": row.resource_id,
            "details": json.loads(row.details_json),
            "previousHash": row.previous_hash,
            "eventHash": row.event_hash,
            "createdAt": utc_iso(row.created_at),
        }
        for row in rows
    ]


@audit_router.get("/verify")
def verify_audit_chain(user: User = Depends(require_roles("admin")), db: Session = Depends(get_db)):
    rows = db.scalars(select(AuditEvent).order_by(AuditEvent.id.asc())).all()
    previous_hash = "0" * 64
    verified_count = 0
    for row in rows:
        payload = {
            "actorId": row.actor_id,
            "action": row.action,
            "resourceType": row.resource_type,
            "resourceId": row.resource_id,
            "details": json.loads(row.details_json),
            "previousHash": row.previous_hash,
            "createdAt": utc_iso(row.created_at),
        }
        expected_hash = hashlib.sha256(json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
        if row.previous_hash != previous_hash or not hmac.compare_digest(row.event_hash, expected_hash):
            return {"valid": False, "verifiedEntries": verified_count, "failedEntry": row.id}
        previous_hash = row.event_hash
        verified_count += 1
    return {"valid": True, "verifiedEntries": verified_count, "chainHead": previous_hash}


app.include_router(auth)
app.include_router(victim)
app.include_router(chat)
app.include_router(cases)
app.include_router(alerts)
app.include_router(dashboards)
app.include_router(audit_router)
