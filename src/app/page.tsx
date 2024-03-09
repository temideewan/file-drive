"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedOut, SignedIn, SignOutButton, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  const createFile = useMutation(api.files.createFile);
  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  // skip the query if there's no organization yet
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip');
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {files?.map((file) => {
        return <div key={file._id}> {file.name}</div>
      })}
      <Button onClick={() => {
        if (!orgId) return;
        createFile({ name: "Hello world", orgId })
      }}>Click me</Button>
    </main>
  );
}

{/* <SignedIn>
  <SignOutButton>
    <Button>Sign out</Button>
  </SignOutButton>
</SignedIn>
<SignedOut>
  <SignInButton mode="modal">
    <Button>Sign in</Button>
  </SignInButton>
</SignedOut> */}
