// src/utils/scoreTranslator.js

export function getQualitativeScore(scoreOrLevel) {
    const level = typeof scoreOrLevel === "string" 
        ? scoreOrLevel.toLowerCase() 
        : scoreOrLevel;

    if (level === "low" || level <= 3) {
        return { label: "Stable & Balanced", color: "text-teal-300" };
    }
    if (level === "moderate" || (level > 3 && level <= 7)) {
        return { label: "Mildly Overwhelmed", color: "text-amber-300" };
    }
    return { label: "Needs Gentle Support", color: "text-rose-300" };
}