"use client";
import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";


const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z.custom<FileList>((val) => val instanceof FileList, "Required").refine((files) => files.length > 0, "Required"),
})
export default function UploadButton() {

  const { toast } = useToast()

  // Auth related logic
  const organization = useOrganization();
  const user = useUser();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  // FORM related logic
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  })

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return;

    try {
      const postUrl = await generateUploadUrl();
      console.log(postUrl)

      const fileType = values.file[0].type;
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": fileType },
        body: values.file[0],
      });
      const { storageId } = await result.json();

      console.log(fileType);
      const types = {
        "image/jpeg": "image",
        "image/png": "image",
        "image/jpg": "image",
        "text/csv": "csv",
        "application/pdf": "pdf",
      } as Record<string, Doc<'files'>['type']>
      await createFile({
        name: values.title,
        orgId,
        fileId: storageId,
        type: types[fileType]
      })

      form.reset();
      setIsFileDialogOpen(false)
      toast({
        title: "File uploaded",
        description: "Now everyone can view your file",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your file could not be uploaded, try again later!",
        variant: "destructive"
      })
    }
  }

  // API interaction related logic
  const createFile = useMutation(api.files.createFile);
  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }
  // component states
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false)

  // UI
  return (
    <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
      setIsFileDialogOpen(isOpen);
      form.reset();
    }}>
      <DialogTrigger asChild>
        <Button>Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-8">Upload your File Here</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input
                        type="file" {...fileRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit"
                disabled={form.formState.isSubmitting}
                className="flex gap-1"
              >
                {
                  form.formState.isSubmitting
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : null
                }
                Submit
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
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
