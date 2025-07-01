"use client";
import { useState } from "react";
import areaJson from "./area.json";
import { Icons } from "./icons";
interface Area {
  code: string;
  name: string;
  children: Area[];
  value?: string[];
}
const AreaTree = ({
  data,
  onChange,
  value,
  // openNames,
  // setOpenNames
  depth,
}: {
  data?: Area[];
  onChange?: (value: string[], isLeaf: boolean) => void;
  value: string[];
  depth: number;
  // openNames: string[];
  // setOpenNames: (names: string[]) => void;
}) => {
  const children = data?.find((v) => v.name === value[depth])?.children;
  return (
    <>
      <div className="flex-1 max-h-80 border overflow-x-scroll p-1 rounded">
        {data?.map((v, k) => {
          return (
            <div
              key={k}
              className={`flex flex-1 items-center w-full p-1 hover:bg-gray-100 rounded cursor-pointer whitespace-nowrap ${v.name === value[depth] ? "bg-gray-100" : ""}`}
              onClick={() => {
                const newValue = [...(value || [v.name])];
                for (let i = 0; i < newValue.length; i++) {
                  if (i === depth) {
                    newValue[i] = v.name;
                  } else if (i > depth) {
                    newValue[i] = "";
                  }
                }
                newValue.splice(depth, 1, v.name);
                onChange?.(newValue, !v.children);
              }}
            >
              <div>{v.name}</div>
              {v.children ? (
                <Icons.arrow className="flex-shrink-0 w-2.5 ml-2 text-gray-400 -rotate-90" />
              ) : (
                <></>
              )}
            </div>
          );
        })}
      </div>
      {children ? (
        <AreaTree
          data={children}
          onChange={onChange}
          value={value}
          depth={depth + 1}
        />
      ) : (
        <></>
      )}
    </>
  );
};

// const getAreaTreeData = (data: Area[], value: string[] = []) => {
//   return data.map(v => {
//     if (!v.value) v.value = [];
//     v.value = [...value, v.name];
//     if (v.children) {
//       v.children = getAreaTreeData(v.children, v.value);
//     }

//     return v;
//   });
// };
export const AreaSelect = ({
  className,
  value,
  onChange,
  onBlur,
}: {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}) => {
  // const [value, setValue] = useState(props.value ? (props.value as string) : "");
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative flex items-center ${className}`}>
      <div
        className={`w-full flex items-center justify-between flex-nowrap whitespace-nowrap ${value ? "" : "text-gray-400"}`}
        onClick={() => {
          if (open) {
            onBlur?.();
          }
          setOpen(!open);
        }}
      >
        <div className="text-ellipsis overflow-hidden">{value || "地区"}</div>
        <Icons.arrow className=" flex-shrink-0 w-2.5 transition-transform ease-in-out duration-200 ml-2 text-gray-400" />
      </div>
      {open ? (
        <div className=" flex gap-1 absolute top-[100%] w-full left-0 py-4 bg-white z-10">
          <AreaTree
            data={areaJson as Area[]}
            value={value?.split(" ") || []}
            onChange={(value, isLeaf) => {
              if (isLeaf) setOpen(false);
              onChange?.(value.join(" "));
              onBlur?.();
            }}
            depth={0}
          />
        </div>
      ) : null}
    </div>
  );
};
