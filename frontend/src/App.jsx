import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

function App() {
  console.log(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)
  return (
    <>
      <h1>hi</h1>
      <header>
        <Show when="signed-out">
          <SignInButton mode="modal" />
          <SignUpButton mode="modal" />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </>
  );
}

export default App;
