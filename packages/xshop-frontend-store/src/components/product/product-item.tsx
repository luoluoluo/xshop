import { AmountFormat } from "@/components/amount";
import { Product } from "@/generated/graphql";
import Image from "next/image";
import Link from "next/link";

export const ProductItem = ({ product }: { product: Product }) => {
  const detailUrl = `/product/${product.id}`;
  return (
    <Link
      prefetch={false}
      href={detailUrl}
      className="group flex flex-col items-center box-border flex-shrink-0  relative shadow rounded overflow-hidden"
    >
      <div className="flex flex-col items-center w-full overflow-hidden relative box-border">
        <Image
          priority
          width={960}
          height={960}
          src={`${product?.images?.[0]}?w=960&h=960`}
          alt=""
          className="lg:group-hover:scale-110 group-active:scale-110 transition-all duration-500 ease-in-out box-border flex-shrink-0 w-full h-auto object-cover object-center aspect-square"
        />
      </div>
      <div className="flex flex-col p-2 w-full">
        <div className="w-full inline-block overflow-hidden">
          {/* <span className="text-xs px-2 rounded border h-6 leading-6 inline-block mr-2">{product.category?.name}</span> */}
          {product.title}
        </div>
        <div className="text-xs text-gray-500 truncate whitespace-pre-wrap mt-1">
          {product.description}
        </div>
        <div className="text-sm mt-2">
          <AmountFormat size="sm" value={product?.price || 0} />
        </div>
      </div>
      <div className="left-0 bottom-1 w-full py-2 px-4 box-border transition-all duration-200 ease-in-out">
        <div className="flex justify-center items-center w-full h-[2.5rem] rounded shadow-sm border text-black bg-white active:bg-primary active:text-white active:border-primary hover:bg-primary hover:text-white hover:border-primary cursor-pointer active:scale-110 transition-all duration-200 ease-in-out">
          立即购买
        </div>
      </div>
    </Link>
  );
};
