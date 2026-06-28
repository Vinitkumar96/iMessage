import { useState } from "react";
import { frameStyleFromUrl, getWallpaperById } from "../data/wallpapers";
import { useEffect } from "react";
import { WallpaperContext } from "./wallpaper";

const STORAGE_KEY = "apka-selected-wallpaper";

function readStoredWallpaperId() {
  const wallpaperId = localStorage.getItem(STORAGE_KEY);
  if (wallpaperId) {
    return wallpaperId;
  } else {
    return "sonoma-horizon";
  }
}

export function WallpaperProvider({ children }) {
  const [wallpaperId, setWallpaperIdState] = useState(readStoredWallpaperId());

  const wallpaper = getWallpaperById(wallpaperId);

  // each component can use it to change wallpaperId state
  const setWallpaperId = (id) => {
    setWallpaperIdState(id);
  };

  // final css styling with wallpaper , size and position
  const frameStyle = frameStyleFromUrl(wallpaper.url);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, wallpaperId);
  });

  return (
    <WallpaperContext.Provider value={{frameStyle, setWallpaperId, wallpaper, wallpaperId}}>
        {children}
    </WallpaperContext.Provider>
  );
}
