import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return <div className="relative z-10 border-b py-4 bg-gray-50">
    <div className="container mx-auto flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2 text-xl">
        <Image width={48} height={48} src="/logo.png" alt="File drive logo" />
        FileDrive
      </Link>
      <SignedIn>
      <Button variant={'outline'}>
        <Link href="/dashboard/files">Your Files</Link>
      </Button>
      </SignedIn>
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
