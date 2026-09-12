import { useNavigate } from "react-router-dom";

export default function QuickExit({ onLogout }) {
  const navigate = useNavigate();

  const handleExit = () => {
    try { sessionStorage.clear(); } catch (_) {}
    try { localStorage.clear(); } catch (_) {}
    if (onLogout) onLogout();
    navigate("/quick-exit");
  };

  return (
    <button
      type="button"
      onClick={handleExit}
      aria-label="Quick exit"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: "#dc2626",
        color: "#ffffff",
        fontSize: "11px",
        fontWeight: "700",
        padding: "5px 10px",
        borderRadius: "9999px",
        border: "2px solid #f87171",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      ✕ Quick Exit
    </button>
  );
}
