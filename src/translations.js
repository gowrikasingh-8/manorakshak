import landing from "./pages/Landing.jsx";
import login from "./pages/Login.jsx";
import Allnsightcenter from "./pages/AIInsightCenter.jsx";
import Alerts from "./pages/Alerts.jsx";
import ConsentPage from "./pages/ConsentPage.jsx";
import CheckIn from "./pages/CheckIn.jsx";

const parts = [landing, login, Allnsightcenter, Alerts, ConsentPage, CheckIn];

export const LANGUAGES = [
  "English", "हिंदी", "தமிழ்", "বাংলা", "తెలుగు",
  "मराठी", "ગુજરાતી", "ಕನ್ನಡ", "മലയാളം", "ਪੰਜਾਬੀ",
];

export const translations = {};
LANGUAGES.forEach((lang) => {
  translations[lang] = Object.assign({}, ...parts.map((p) => p[lang] || {}));
});