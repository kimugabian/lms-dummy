"use client";

import { UserButton, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function CustomUserButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <UserButton
      appearance={{
        elements: {
          userButtonPopoverActionButton__signOut: {
            onClick: async () => {
              await signOut();
              router.push("/"); // langsung redirect ke "/"
            },
          },
        },
      }}
    />
  );
}
