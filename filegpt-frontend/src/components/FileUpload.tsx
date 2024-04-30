"use client";
// import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/AxiosRequests";

// https://github.com/aws/aws-sdk-js-v3/issues/4126

type Props = {
  user_id: string
}

const FileUpload = ({user_id}: Props) => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const response = await uploadFile(file, user_id)
      return {
        chat_id: response.chat_id,
        file_key: `${response.user_id}/${file.name}`,
        file_name: file.name
      }

    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to handle it outside
    } finally {
      // setUploading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"]
    },    
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large");
        return;
      }

      try {
        const data = await handleFileUpload(file);
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong");
          return;
        }
        toast.success("Chat created!");
        router.push(`/chat/${data.chat_id}`);
      } catch (error) {
        toast.error("Error creating chat");
      }
    },
  });
  
  
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling Tea to GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF, JPEG, JPG, or PNG Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
