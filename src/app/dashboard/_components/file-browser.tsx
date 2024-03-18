"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import UploadButton from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { FileIcon, Loader2, StarIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PlaceHolder() {
  return <div className="flex gap-8 flex-col items-center mt-24">
    <Image
      alt="an image of suggestions to upload a file"
      width={300}
      height={300}
      src="/empty.svg"
    />
    <p className="text-2xl">You have no files upload one now.</p>
    <UploadButton />
  </div>
}

export function FileBrowser({title}: {title: string}) {

  // Auth related logic
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("")

  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  // skip the query if there's no organization yet
  const files = useQuery(api.files.getFiles, orgId ? { orgId, query } : 'skip');
  // UI
  const isLoading = files === undefined
  return (

    <>
      {isLoading ? (
        <div className="flex gap-8 flex-col items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
          <p className="text-2xl">Loading your files....</p>
        </div>
      ) : null}
      {!isLoading ?
        <>
          <div className="flex justify-between items-center mb-8 gap-2">
            <h1 className="text-4xl font-bold"> {title} </h1>
            <div className="flex-grow">
              <SearchBar setQuery={setQuery} query={query} />
            </div>
            <UploadButton />
          </div>

          {
            files.length === 0 ? (
              <PlaceHolder />
            ) : null
          }

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {files?.map((file) => {
              return <FileCard key={file._id} file={file} />
            })}
          </div>
        </>
        : null}
    </>

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
