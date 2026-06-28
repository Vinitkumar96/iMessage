import { createContext, useContext } from "react";

//creating an empty store
export const WallpaperContext = createContext(null)

//custom hook to utilize the context 
export function useWallpaper(){
    const ctx = useContext(WallpaperContext)
    if(!ctx) throw new Error("useWallpaper must be used within wallpaperProvider")
    return ctx
}