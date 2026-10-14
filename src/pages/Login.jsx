import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import { useLanguage } from "../LanguageContext";

const demoCredentials = {
  victim: { email: "user@demo.com", password: "demo1234" },
  family: { email: "family@demo.com", password: "demo1234" },
  counsellor: { email: "counsellor@demo.com", password: "demo1234" },
  admin: { email: "admin@demo.com", password: "demo1234" },
};

export default function Login({ onLogin }) {
  const { t } = useLanguage();
  const [role, setRole] = useState("victim");
  const [email, setEmail] = useState(demoCredentials.victim.email);
  const [password, setPassword] = useState(demoCredentials.victim.password);
  const [error, setError] = useState(""); // stores the KEY, not the text

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setEmail(demoCredentials[newRole].email);
    setPassword(demoCredentials[newRole].password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("login_error");
      return;
    }
    setError("");
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-teal-400 mb-1">Manorakshak</h1>
        <p className="text-slate-400 text-xs mb-1">{t("login_welcome")}</p>
        <p className="text-slate-400 text-sm mb-6">{t("login_subtitle")}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-300 block mb-1">{t("login_selectPortal")}</label>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
            >
              <option value="victim">{`🌱 ${t("login_roleVictim")}`}</option>
              <option value="family">{`🫂 ${t("login_roleFamily")}`}</option>
              <option value="counsellor">{`🧑‍⚕️ ${t("login_roleCounsellor")}`}</option>
              <option value="admin">{`🏛️ ${t("login_roleAdmin")}`}</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300 block mb-1">{t("login_email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300 block mb-1">{t("login_password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{t(error)}</p>}

          <Button type="submit" className="w-full">
            {t("login_button")}
          </Button>
        </form>

        <p className="text-slate-500 text-xs mt-4 text-center">
          {t("login_demoNote")}
        </p>
      </Card>
    </div>
  );
}