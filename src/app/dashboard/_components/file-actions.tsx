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
} from "@/components/ui/alert-dialog"


import { Doc, } from "../../../../convex/_generated/dataModel"
import { FileIcon, MoreVertical, StarHalf, StarIcon, TrashIcon, UndoIcon } from "lucide-react"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import { Protect } from "@clerk/nextjs"



export default function FileCardActions({ file, isFavorited, fileUrl }: { file: Doc<"files">, isFavorited: boolean, fileUrl?: string }) {
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

          <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={async () => {
            if (!file.shouldDelete) {
              setIsConfirmOpen(true)
            } else {
              await restoreFile({ fileId: file._id })
              toast({
                title: "File restored",
                description: "That file is no longer marked for deletion",
                variant: "default"
              })
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
