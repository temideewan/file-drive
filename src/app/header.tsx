import { OrganizationSwitcher, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export function Header() {
  return <div className="border-b py-4 bg-gray-50">
    <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2 text-xl">
        <Image width={48} height={48} src="/logo.png" alt="File drive logo" />
        FileDrive
      </div>
      <div className="flex gap-2">
        <SignedOut>
          <SignInButton></SignInButton>
        </SignedOut>
        <OrganizationSwitcher />
        <UserButton />
      </div>
    </div>
  </div>
}
