import { Link as LinkType } from "@/generated/graphql";
import Image from "next/image";
import { useState } from "react";
import { LinkModal } from "./link-modal";

export const LinkItem = ({ link }: { link: LinkType }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <a
        href={link.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="group flex flex-col items-center box-border flex-shrink-0 relative shadow rounded overflow-hidden bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
      >
        <div className="flex gap-2 items-start w-full overflow-hidden relative box-border p-2 flex-1">
          {link.logo ? (
            <div className="w-10 h-10 mb-3 flex items-center justify-center flex-shrink-0">
              <Image
                priority
                width={40}
                height={40}
                src={link.logo}
                alt={link.name || "链接"}
                className="w-full h-full object-cover object-center rounded"
              />
            </div>
          ) : (
            <div className="w-10 h-10 mb-3 flex items-center justify-center bg-gray-100 rounded flex-shrink-0">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
          )}
          <div className="flex flex-col">
            <div className="w-full inline-block overflow-hidden">
              <span className="text-sm font-medium text-gray-900">
                {link.name || "未命名链接"}
              </span>
            </div>
            {link.url && (
              <div className="text-xs text-gray-500 break-all">{link.url}</div>
            )}
            {link.qrcode && (
              <div className="w-20 h-auto mt-3 flex items-center justify-center flex-shrink-0">
                <Image
                  priority
                  width={40}
                  height={40}
                  src={link.qrcode}
                  alt={link.name || "链接"}
                  className="w-full h-full object-cover object-center rounded"
                />
              </div>
            )}
          </div>
        </div>

        <div className="left-0 bottom-1 w-full py-2 px-4 box-border transition-all duration-200 ease-in-out">
          <div className="flex justify-center items-center w-full h-[2rem] rounded shadow-sm border text-black bg-white active:bg-primary active:text-white active:border-primary hover:bg-primary hover:text-white hover:border-primary cursor-pointer active:scale-110 transition-all duration-200 ease-in-out text-xs">
            访问链接
          </div>
        </div>
      </a>

      <LinkModal
        link={link}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
