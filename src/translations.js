import {landing} from "./locales/Landing.js";
import{ login} from "./locales/Login.js";
import{ Allnsightcenter} from "./locales/AllnsightCenter.js";
import{ Alerts} from "./locales/Alerts.js";
import {Consentpage} from "./locales/ConsentPage.js";
import{CheckIn}from "./locales/Checkin.js";
import {Dashboard} from "./locales/Dashboard.js";

const parts = [landing, login, Allnsightcenter, Alerts, Consentpage, CheckIn, Dashboard];

export const LANGUAGES = [
  "English", "हिंदी", "தமிழ்", "বাংলা", "తెలుగు",
  "मराठी", "ગુજરાતી", "ಕನ್ನಡ", "മലയാളം", "ਪੰਜਾਬੀ",
];

export const translations = {};
LANGUAGES.forEach((lang) => {
  translations[lang] = Object.assign({}, ...parts.map((p) => p[lang] || {}));
});