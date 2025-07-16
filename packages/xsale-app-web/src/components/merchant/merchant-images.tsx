"use client";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import Swiper core and required modules
import { cn } from "@/utils";
import Image from "next/image";
import { useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const CustomStyle = () => {
  return (
    <style global jsx>{`
      .swiper-pagination-bullet {
        width: 1.5rem;
        height: 0.4rem;
        margin: 0 0.3rem !important;
        border: 1px solid rgba(0, 0, 0, 0.3);
        box-shadow: 0 0 2px #fff;
        opacity: 1;
        background: #fff;
        /* border: 1px solid hsl(var(--primary)); */
        border-radius: 0.2rem;
      }
      .swiper-pagination-bullet-active {
        border: 1px solid hsl(var(--primary));
        background: hsl(var(--primary));
      }

      .swiper-button-prev::after,
      .swiper-button-next::after {
        font-size: 1.5rem;
        color: #fff !important;
        padding: 8px;
        background: rgba(0, 0, 0, 0.3);
      }
      @media (min-width: 1024px) {
        .swiper-pagination-bullets {
          bottom: 0.5rem !important;
        }
      }
    `}</style>
  );
};

export const MerchantImages = ({
  data,
  className,
}: {
  data: string[];
  className?: string;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const openPreview = (img: string, index: number) => {
    setSelectedImage(img);
    setCurrentIndex(index);
  };

  const closePreview = () => {
    setSelectedImage(null);
    setCurrentIndex(0);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(data[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex === data.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedImage(data[newIndex]);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closePreview();
    } else if (e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };

  if (!data.length) return null;
  return (
    <>
      <div className={cn(`w-full`, className)}>
        <Swiper
          className="w-full"
          modules={[Pagination, Autoplay]}
          loop={data.length > 1}
          spaceBetween={50}
          autoplay={{ delay: 5000 }}
          slidesPerView="auto"
          pagination={{
            clickable: true,
            renderBullet: function (index, className) {
              return `<div key="${index}" class="${className}"></div>`;
            },
          }}
          // onSwiper={swiper => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
        >
          {data?.map((img: string, index: number) => (
            <SwiperSlide key={index} className="w-full flex-shrink">
              <>
                <div className="relative flex flex-col justify-center items-center w-full">
                  <Image
                    priority
                    width={960}
                    height={960}
                    className="w-full h-auto object-cover object-center aspect-[2/1] cursor-pointer"
                    src={img}
                    // loading="auto"
                    alt=""
                    onClick={() => openPreview(img, index)}
                  />
                </div>
              </>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closePreview}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 z-10"
              onClick={closePreview}
            >
              ×
            </button>

            {/* Previous button */}
            {data.length > 1 && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                ‹
              </button>
            )}

            {/* Next button */}
            {data.length > 1 && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                ›
              </button>
            )}

            {/* Image counter */}
            {data.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {data.length}
              </div>
            )}

            <div className="w-full h-full flex items-center justify-center p-4">
              <Image
                src={selectedImage}
                alt="Preview"
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}

      <CustomStyle />
    </>
  );
};
