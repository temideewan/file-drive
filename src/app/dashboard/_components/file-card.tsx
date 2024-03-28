
import { formatRelative, subDays } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { FileIcon, FileText, FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, StarHalf, StarIcon, TrashIcon, UndoIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Protect } from "@clerk/nextjs"



function FileCardActions({ file, isFavorited, fileUrl }: { file: Doc<"files">, isFavorited: boolean, fileUrl?: string }) {
  const deleteFile = useMutation(api.files.deleteFile)
  const restoreFile = useMutation(api.files.restoreFile)
  const toggleFavorite = useMutation(api.files.toggleFavorite)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { toast } = useToast();
  return <>
    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will mark the file for our deletion process. Files are deleted periodically
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={async () => {
            await deleteFile({ fileId: file._id, storageId: file.fileId })
            toast({
              title: "File marked for deletion",
              description: "That file will be deleted soon",
              variant: "default"
            })
          }}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>


    <DropdownMenu>
      <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="flex gap-1" onClick={() => {
            // open a new tab to the file location on convex
            if (!fileUrl) {
              toast({
                title: "Something went wrong",
                description: "Your file could not be accessed, try again later!",
                variant: "destructive"
              })
            }
            window.open(fileUrl, "_blank")
          }} >
          <FileIcon className="h-4 w-4"/> Download
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => { toggleFavorite({ fileId: file._id, storageId: file.fileId }) }}> {!isFavorited ? (<><StarHalf className="h-4" /> Favorite</>) : <><StarIcon className="h-4" /> Unfavorite </>}</DropdownMenuItem>
        <Protect
          role="org:admin"
          fallback={<></>}
        >
          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => {
            if (!file.shouldDelete) {
              setIsConfirmOpen(true)
            } else {
              restoreFile({ fileId: file._id })
            }
          }}>
            {
              file.shouldDelete ?
                <div className="text-green-600 flex gap-1 items-center">
                  <UndoIcon className="h-4 w-4" /> Restore
                </div> :
                <div className="text-red-600 flex gap-1 items-center">
                  <TrashIcon className="h-4 w-4" /> Delete
                </div>
            }
          </DropdownMenuItem>
        </Protect>
      </DropdownMenuContent>
    </DropdownMenu>
  </>

}

export function FileCard({ file, favorites }: { file: Doc<"files">, favorites: Doc<"favorites">[] | undefined }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId
  })
  const typeIcons = {
    "image": <ImageIcon />,
    "csv": <GanttChartIcon />,
    "pdf": <FileTextIcon />,
  } as Record<Doc<"files">["type"], ReactNode>
  const isFavorited = favorites ? favorites.some(f => f.fileId === file._id) : false;
  const { toast } = useToast();
  return <Card>
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <div className="flex gap-2">
          <p>{typeIcons[file.type]}</p>
          <p className='text-base font-normal'>
            {file.name}
          </p>
        </div> <FileCardActions file={file} isFavorited={isFavorited} fileUrl={file.url} /></CardTitle>
      {/* <CardDescription>Card Description</CardDescription> */}
    </CardHeader>
    <CardContent className="h-[200px] flex justify-center items-center">
      {file.type === 'image' && file.url ?
        <Image
          alt={file.name}
          width={200}
          height={100}
          src={file.url}
          className="h-full object-cover rounded-sm"
        /> :
        null
      }
      {file.type === 'csv' ?
        <GanttChartIcon className="w-20 h-20" /> :
        null
      }
      {file.type === 'pdf' ?
        <FileTextIcon className="w-20 h-20" /> :
        null
      }
    </CardContent>
    <CardFooter className="flex justify-between">
      <div className="flex gap-2 text-xs text-gray-700 w-20 items-center">
      <Avatar className="w-6 h-6">
        <AvatarImage src={userProfile?.image} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {userProfile?.name}
      </div>
      <div className="text-xs text-gray-700">
      uploaded {formatRelative(file._creationTime, new Date())}
      </div>

    </CardFooter>
  </Card>

}
