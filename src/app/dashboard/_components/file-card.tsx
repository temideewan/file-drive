
import { formatRelative } from 'date-fns'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import {  FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react"
import { ReactNode } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import FileCardActions from './file-actions'

export function FileCard({ file }: { file: Doc<"files"> & {isFavorited: boolean}}) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId
  })
  const typeIcons = {
    "image": <ImageIcon />,
    "csv": <GanttChartIcon />,
    "pdf": <FileTextIcon />,
  } as Record<Doc<"files">["type"], ReactNode>
  const { toast } = useToast();
  return <Card>
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <div className="flex gap-2">
          <p>{typeIcons[file.type]}</p>
          <p className='text-base font-normal'>
            {file.name}
          </p>
        </div> <FileCardActions file={file} isFavorited={file.isFavorited} fileUrl={file.url} /></CardTitle>
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
