export const AmountFormat = ({
  value,
  className,
  size = "base",
}: {
  className?: string;
  value: number;
  size?: "sm" | "base" | "lg" | "xl";
}) => {
  const [integer, decimal] = value.toFixed(2).split(".");
  let integerClassName = "";
  switch (size) {
    case "sm":
      integerClassName = "text-base";
      break;
    case "base":
      integerClassName = "text-lg";
      break;
    case "lg":
      integerClassName = "text-xl";
      break;
    case "xl":
      integerClassName = "text-2xl";
      break;
  }
  return (
    <div
      className={` flex items-end font-semibold text-red-500 text-${size} ${className}`}
    >
      <div className="leading-[100%] px-[1px]">¥</div>
      <div className={`${integerClassName} leading-[100%]`}>{integer}</div>
      <div className="leading-[100%]">.{decimal}</div>
    </div>
  );
};
