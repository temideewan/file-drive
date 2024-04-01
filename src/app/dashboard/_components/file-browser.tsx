"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import UploadButton from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { GridIcon, Loader2, Rows2Icon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


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

export function FileBrowser({ title, isFavorites, isDeleted }: { title: string, isFavorites?: boolean, isDeleted?: boolean }) {

  // Auth related logic
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("")

  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  // skip the query if there's no organization yet
  const files = useQuery(api.files.getFiles, orgId ? { orgId, query, isFavorites, isDeleted } : 'skip');
  // UI
  const isLoading = files === undefined
  const favorites = useQuery(api.files.getAllFavorites, orgId ? { orgId, } : 'skip');

  const modifiedFiles = files?.map(file => ({
    ...file,
    isFavorited: (favorites ?? [])?.some(favorites => favorites.fileId === file._id)
  })) ?? [];

  return (

    <>

      {
        <>
          <div className="flex justify-between items-center mb-8 gap-2">
            <h1 className="text-4xl font-bold"> {title} </h1>
            <div className="flex-grow">
              <SearchBar setQuery={setQuery} query={query} />
            </div>
            <UploadButton />
          </div>
          <Tabs defaultValue="grid">
            <TabsList className="mb-4">
              <TabsTrigger value="grid" className="flex gap-2 items-center"><GridIcon className="h-5 w-5" /> Grid</TabsTrigger>
              <TabsTrigger value="table" className="flex gap-2 items-center"><Rows2Icon className="h-5 w-5" /> Table</TabsTrigger>
            </TabsList>
            {isLoading ? (
              <div className="flex gap-8 flex-col items-center mt-24">
                <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
                <p className="text-2xl">Loading your files....</p>
              </div>
            ) : null}
            <TabsContent value="grid">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {modifiedFiles?.map((file) => {
                  return <FileCard key={file._id} file={file} />
                })}
              </div>
            </TabsContent>
            <TabsContent value="table">
              <DataTable columns={columns} data={modifiedFiles} />
            </TabsContent>
          </Tabs>

          {
            files && files?.length <= 0 && <PlaceHolder />
          }
        </>
        }
    </>

  );
}

