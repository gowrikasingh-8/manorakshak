import { landing } from "./locales/landing";
import { login } from "./locales/login";
import { Allnsightcenter } from "./locales/Allnsightcenter";
import { Alerts } from "./locales/Alerts";
import { Consentpage } from "./locales/Consentpage";
import {CheckIn} from "./locales/CheckIn";


const parts = [landing, login, Allnsightcenter, Alerts, Consentpage, CheckIn];

export const LANGUAGES = [
  "English", "हिंदी", "தமிழ்", "বাংলা", "తెలుగు",
  "मराठी", "ગુજરાતી", "ಕನ್ನಡ", "മലയാളം", "ਪੰਜਾਬੀ",
];

export const translations = {};
LANGUAGES.forEach((lang) => {
  translations[lang] = Object.assign({}, ...parts.map((p) => p[lang] || {}));
});