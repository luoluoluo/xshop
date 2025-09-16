import { message, Upload } from "antd";
import * as Icons from "@ant-design/icons";
import { UploadListType } from "antd/es/upload/interface";
import { upload } from "@/utils/request.client";
import { useState, useEffect } from "react";
import { UploadFile } from "antd/lib";
import { Loading } from "../loading";

const uploadButton = (
  <button style={{ border: 0, background: "none" }} type="button">
    <Icons.PlusOutlined />
    <div style={{ marginTop: 8 }}>上传</div>
  </button>
);

export const CustomUpload = (props: {
  max?: number;
  value?: string[] | string;
  onChange?: (value?: string[] | string) => void;
  listType?: UploadListType;
  accept?: string;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("done");
  const max = props.max || 1;

  const [values, setValues] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>();

  useEffect(() => {
    if (props.value) {
      setValues(
        max === 1 ? [props.value as string] : (props.value as string[]),
      );
    } else {
      setValues([]);
    }
  }, [props.value]);

  useEffect(() => {
    console.log(values, fileList);
    setFileList((prev) => {
      return values.map((f) => {
        const file = prev?.find((v) => v.url === f || v.response === f);
        if (file) {
          return file;
        }
        const uid = crypto.randomUUID();
        return {
          key: uid,
          uid: uid,
          name: f,
          url: f,
          status: "done",
        };
      });
    });
  }, [values]);

  return (
    <>
      <Upload
        name="file"
        listType={props.listType || "picture-card"}
        multiple={max > 1}
        accept={
          props.accept ||
          "image/png, image/gif, image/jpeg, image/webp, images/jpg"
        }
        fileList={fileList}
        maxCount={max}
        customRequest={({ onSuccess, onError, file }) => {
          if (!(file instanceof File)) {
            onError?.(new Error("Invalid file"));
            return;
          }
          setIsUploading(true);
          upload(file)
            .then((res) => {
              if (res.errors) {
                onError?.(new Error(res.errors[0].message));
                return;
              }
              onSuccess?.(res.data?.signedFileUrl?.downloadUrl);
            })
            .catch((e) => {
              console.log(e);
            })
            .finally(() => {
              setIsUploading(false);
            });
        }}
        onChange={(e) => {
          setStatus(e.file.status || "");
          setFileList(e.fileList);
          console.log(e);
          switch (e.file.status) {
            case "done":
              if (props.onChange) {
                if (max === 1) {
                  props.onChange(String(e.file.response));
                } else if (max > 1) {
                  props.onChange([...values, String(e.file.response)]);
                }
              }
              break;
            case "removed":
              if (max === 1) {
                props.onChange?.("");
                return;
              }
              props.onChange?.(values.filter((v) => v !== e.file.url));
              break;
            case "error":
              message.error(e.file.error.message);
              break;
            default:
              break;
          }
        }}
      >
        {["done", "removed"].includes(status) && values?.length < max
          ? uploadButton
          : null}
      </Upload>
      {isUploading && <Loading />}
    </>
  );
};
