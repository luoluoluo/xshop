import { message, Upload } from "antd";
import * as Icons from "@ant-design/icons";
import { UploadListType } from "antd/es/upload/interface";
import { genId } from "../../utils/gen";
import { upload } from "../../utils/request";
import { useState, useMemo, useEffect } from "react";
import { UploadFile } from "antd/lib";

const uploadButton = (
  <button style={{ border: 0, background: "none" }} type="button">
    <Icons.PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </button>
);

export const CustomUpload = (props: {
  max?: number;
  value?: string[] | string;
  onChange?: (value?: string[] | string) => void;
  listType?: UploadListType;
  accept?: string;
}) => {
  const [status, setStatus] = useState("done");
  const max = props.max || 1;

  const values: string[] = props.value
    ? max === 1
      ? [props.value as string]
      : (props.value as string[])
    : [];

  const [fileList, setFileList] = useState<UploadFile[]>();

  useEffect(() => {
    if (!values.length) {
      return;
    }
    setFileList(
      values.map((f) => ({
        uid: genId(),
        name: f,
        url: f,
        status: "done" as const,
      })),
    );
  }, []);

  return (
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
        upload(file).then((res) => {
          if (res.errors) {
            onError?.(new Error(res.errors[0].message));
            return;
          }
          onSuccess?.(res.data?.signedFileUrl?.downloadUrl);
        });
      }}
      onChange={(e) => {
        console.log(e);
        setStatus(e.file.status || "");
        setFileList(e.fileList);
        switch (e.file.status) {
          case "done":
            if (props.onChange) {
              if (max === 1) {
                props.onChange(String(e.file.response));
              } else if (max > 1) {
                props.onChange(
                  e.fileList.map((v) => String(v?.response || v.url || v.name)),
                );
              }
            }
            break;
          case "removed":
            if (max === 1) {
              props.onChange?.("");
              return;
            }
            props.onChange?.(
              e.fileList.map((v) => String(v?.response || v.url || v.name)),
            );
            break;
          case "error":
            message.error(e.file.error.message);
            break;
          default:
            break;
        }
      }}
    >
      {["done", "removed"].includes(status) && values.length < max
        ? uploadButton
        : null}
    </Upload>
  );
};
