"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import UploadButton from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Home() {

  // Auth related logic
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  // skip the query if there's no organization yet
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip');
  // UI
  const isLoading = files === undefined
  return (
    <main className="container mx-auto pt-12">
      {isLoading ? (
        <div className="flex gap-8 flex-col items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
          <p className="text-2xl">Loading your files....</p>
        </div>
      ): null}
      {
        !isLoading && files.length === 0 ? (
          <div className="flex gap-8 flex-col items-center mt-24">
            <Image
              alt="an image of suggestions to upload a file"
              width={300}
              height={300}
              src="/empty.svg"
            />
            <p className="text-2xl">You have no files upload one now.</p>
            <UploadButton />
          </div>
        ) : null
      }
      {!isLoading && files.length > 0 ?
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold"> Your Files </h1>
            <UploadButton />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />
            })}
          </div>
        </>
        : null}
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
