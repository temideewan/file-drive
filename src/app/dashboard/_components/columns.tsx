"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { formatRelative } from "date-fns"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import FileCardActions from "./file-actions"

function UserCell({ userId }: { userId: Id<"users"> }) {
  const userProfile = useQuery(api.users.getUserProfile, { userId })
  return <div >
    <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
      <Avatar className="w-6 h-6">
        <AvatarImage src={userProfile?.image} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {userProfile?.name}
    </div>
  </div>
}

export const columns: ColumnDef<Doc<"files"> & {isFavorited: boolean}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "userId",
    header: "User",
    cell: ({ row }) => {
      return <UserCell userId={row.original.userId} />
    },
  },
  {
    accessorKey: "_creationTime",
    header: "Uploaded on",
    cell: ({ row }) => {
      return <div >{formatRelative(row.original._creationTime, new Date())}</div>
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <FileCardActions file={row.original} isFavorited={row.original.isFavorited} fileUrl={row.original.url}/>
    },
  },
]
