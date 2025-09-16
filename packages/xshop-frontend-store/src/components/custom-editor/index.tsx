"use client";
import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

import { upload } from "@/utils/request.client";

export const CustomEditor = ({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const editorRef = useRef<any>(null);

  return (
    <>
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        onInit={(_evt: any, editor: any) => (editorRef.current = editor)}
        // onChange={() => {
        //   console.log(editorRef.current.getContent());
        //   onChange && onChange(editorRef.current.getContent());
        // }}
        onBlur={() => {
          onChange?.(editorRef.current.getContent());
        }}
        initialValue={value}
        init={{
          relative_urls: false,
          remove_script_host: false,
          convert_urls: true,
          images_upload_handler: async (blobInfo: any) => {
            if (!(blobInfo.blob() instanceof File)) {
              throw new Error("Invalid file");
            }
            const res = await upload(blobInfo.blob());
            if (res.errors) {
              throw new Error(res.errors[0].message);
            }
            return res.data?.signedFileUrl?.downloadUrl;
          },
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
            "code",
          ],
          toolbar:
            "image | " +
            "link | code |" +
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help |" +
            "table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img { max-width: 100%; height: auto; }",
        }}
      />
    </>
  );
};
