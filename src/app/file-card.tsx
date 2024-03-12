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


import { Doc } from "../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { MoreVertical, TrashIcon } from "lucide-react"
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"



function FileCardActions({file}: {file: Doc<"files"> }) {
  const deleteFile = useMutation(api.files.deleteFile)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const {toast} = useToast();
  return <>
    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={async () =>{
            // TODO: delete the file
            await deleteFile({fileId: file._id, storageId: file.fileId})
            toast({
              title: "File deleted",
              description: "That file is now deleted successfully",
              variant: "default"
            })
          }}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>


    <DropdownMenu>
      <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="flex gap-1 items-center text-red-600 cursor-pointer" onClick={() => setIsConfirmOpen(true)}> <TrashIcon className="h-4" /> Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>

}
export function FileCard({ file }: {file: Doc<"files"> } ) {
  return <Card>
    <CardHeader>
      <CardTitle className="flex justify-between items-center">{file.name} <FileCardActions file={file}/></CardTitle>
      {/* <CardDescription>Card Description</CardDescription> */}
    </CardHeader>
    <CardContent>
      <p>Card Content</p>
    </CardContent>
    <CardFooter>
      <Button>Download</Button>
    </CardFooter>
  </Card>

}
