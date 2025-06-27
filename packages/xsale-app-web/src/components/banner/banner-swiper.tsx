"use client";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import Swiper core and required modules
import { Banner } from "@/generated/graphql";
import { cn } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const CustomStyle = () => {
  return (
    <style global jsx>{`
      . .swiper-pagination-bullet {
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

export const BannerSwiper = ({ data, className }: { data: Banner[]; className?: string }) => {
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
            }
          }}
          // onSwiper={swiper => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
        >
          {data?.map((banner: Banner, index: number) => (
            <SwiperSlide key={index} className="w-full flex-shrink">
              <>
                <Link
                  prefetch={false}
                  href={banner?.link || ""}
                  className="relative flex flex-col justify-center items-center w-full"
                >
                  <Image
                    priority
                    width={960}
                    height={320}
                    className="w-full h-auto object-cover object-center aspect-[3/1]"
                    src={`${banner?.image}?w=1920&h=640`}
                    // loading="auto"
                    alt=""
                  />
                </Link>
              </>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <CustomStyle />
    </>
  );
};
