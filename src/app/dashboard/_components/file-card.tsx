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


import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { FileText, FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, StarHalf, StarIcon, TrashIcon } from "lucide-react"
import { ReactNode, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Protect } from "@clerk/nextjs"



function FileCardActions({ file, isFavorited }: { file: Doc<"files">, isFavorited: boolean }) {
  const deleteFile = useMutation(api.files.deleteFile)
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
        <DropdownMenuItem className="flex gap-1 items-center cursor-pointer" onClick={() => { toggleFavorite({ fileId: file._id, storageId: file.fileId }) }}> {!isFavorited ? (<><StarHalf className="h-4" /> Favorite</>) : <><StarIcon className="h-4" /> Unfavorite </>}</DropdownMenuItem>
        {/* <Protect
          permission="org:invoices:create"
          fallback={<></>}
        > */}
        <DropdownMenuSeparator />
          <DropdownMenuItem className="flex gap-1 items-center text-red-600 cursor-pointer" onClick={() => setIsConfirmOpen(true)}> <TrashIcon className="h-4" /> Delete</DropdownMenuItem>
        {/* </Protect> */}
      </DropdownMenuContent>
    </DropdownMenu>
  </>

}

export function FileCard({ file, favorites }: { file: Doc<"files">, favorites: Doc<"favorites">[] | undefined }) {
  const fileUrl = useQuery(api.files.getStorageUrl, {fileId: file.fileId})
  const typeIcons = {
    "image": <ImageIcon />,
    "csv": <GanttChartIcon />,
    "pdf": <FileTextIcon />,
  } as Record<Doc<"files">["type"], ReactNode>
  const isFavorited = favorites ? favorites.some(f => f.fileId === file._id) : false;
  const {toast} = useToast();
  return <Card>
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <div className="flex gap-2">
          <p>{typeIcons[file.type]}</p>
          <p>
            {file.name}
          </p>
        </div> <FileCardActions file={file} isFavorited={isFavorited} /></CardTitle>
      {/* <CardDescription>Card Description</CardDescription> */}
    </CardHeader>
    <CardContent className="h-[200px] flex justify-center items-center">
      {file.type === 'image' && fileUrl ?
        <Image
          alt={file.name}
          width={200}
          height={100}
          src={fileUrl}
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
    <CardFooter className="flex justify-center">
      <Button className="w-full sm:w-min" onClick={() => {
        // open a new tab to the file location on convex
        if(!fileUrl) {
          toast({
            title: "Something went wrong",
            description: "Your file could not be accessed, try again later!",
            variant: "destructive"
          })
        }
        window.open(fileUrl, "_blank")
      }}>Download</Button>
    </CardFooter>
  </Card>

}
