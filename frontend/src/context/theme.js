import { createContext,useContext } from "react";
import {HERO_UI_THEME_PRESETS,DEFAULT_THEME_PRESET_ID } from "../data/herouiThemePresets.js"

//hero ui theme ids for quick lookup ["default", "spotify", "discord" , ...]
const PRESET_IDS = new Set(HERO_UI_THEME_PRESETS.map((p) => p.id))

export function isValidThemePreset(id){
    return PRESET_IDS.has(id)
}

// apply data-theme to html
export function applyThemePresetToDocument(presetId){
    const id = isValidThemePreset(presetId) ? presetId : DEFAULT_THEME_PRESET_ID
    document.documentElement.setAttribute("data-theme-preset",id)
}

export const ThemeContext = createContext(null)

export function useTheme() {
    const ctx = useContext(ThemeContext)
    if(!ctx) throw new Error("useTheme must be used within ThemeProvider")
    return ctx
}