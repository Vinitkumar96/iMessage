import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import { WallpaperProvider } from "./context/WallpaperContext";

function App() {

  return (
    <WallpaperProvider>
    <div className="bg-neutral-400">
      <header>
        <Show when="signed-out">
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </div>
    </WallpaperProvider>
  );
}

export default App;
