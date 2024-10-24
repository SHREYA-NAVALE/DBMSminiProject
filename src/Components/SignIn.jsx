import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, SignUpButton } from "@clerk/clerk-react";

export const SignIn = ()=> {
  return (
    <div>
      <SignedOut>
        <SignUpButton mode="modal"/>
        <SignInButton mode="modal"/>
    </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>

      {/* <h2>SignIn</h2> */}

    </div>
  );
}
