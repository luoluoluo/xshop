import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

import { upload } from "../../utils/request";
import { BASE_PATH } from "../../config/constant";

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
        language="zh_CN"
        tinymceScriptSrc={`${BASE_PATH}/tinymce/tinymce.min.js`}
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
          language: "zh_CN",
          width: "100%",
          relative_urls: false,
          remove_script_host: false,
          convert_urls: true,
          automatic_uploads: true,
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
          file_picker_types: "media",
          // 配置支持的文件类型
          images_file_types: "jpg,jpeg,png,gif,webp",
          // 配置媒体文件类型
          media_file_types: "mp4,webm,ogg,avi,mov,wmv,flv",
          // 添加文件选择器回调
          file_picker_callback: (callback: any, value: any, meta: any) => {
            if (meta.filetype === "media") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "video/*");
              input.click();

              input.onchange = async () => {
                const file = input.files?.[0];
                if (file) {
                  try {
                    const res = await upload(file);
                    if (res.errors) {
                      throw new Error(res.errors[0].message);
                    }
                    callback(res.data?.signedFileUrl?.downloadUrl, {
                      title: file.name,
                      alt: file.name,
                    });
                  } catch (error) {
                    console.error("Upload failed:", error);
                  }
                }
              };
            }
          },
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "media",
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
            "media | " +
            "image | " +
            "link | code |" +
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help |" +
            "table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img { max-width: 100%; height: auto; } video { max-width: 100%; height: auto; }",
        }}
      />
    </>
  );
};
