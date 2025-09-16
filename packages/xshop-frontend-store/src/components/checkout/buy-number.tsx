import { debounce } from "lodash";
import { useRef } from "react";
import { Button } from "../ui/button";

export const BuyNumber = ({
  className,
  maxValue,
  value,
  onChange,
}: {
  className?: string;
  maxValue?: number;
  value?: number;
  onChange?: (value?: number) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInput = debounce((value: string) => {
    let inputValue = Number(value);
    if (inputValue < 1) {
      inputValue = 1;
    }
    if (maxValue && inputValue > maxValue) {
      inputValue = maxValue;
    }
    if (inputRef?.current) {
      inputRef.current.value = String(inputValue);
    }
    onChange?.(inputValue);
  }, 1000);
  const data = value || 1;
  return (
    <div
      className={`bg-gray-100 hover:bg-gray-100 flex-shrink-0 rounded ${className}`}
    >
      <div className="flex justify-between items-center w-full h-full overflow-hidden">
        <Button
          size="sm"
          variant="ghost"
          disabled={data <= 1}
          className="  text-black px-4 text-2xl active:bg-gray-200"
          onClick={() => {
            if (data <= 1) return;
            const newValue = data - 1;
            if (inputRef?.current) {
              inputRef.current.value = String(newValue);
            }
            onChange?.(newValue);
          }}
        >
          -
        </Button>
        <input
          ref={inputRef}
          type="number"
          defaultValue={value}
          // value={value}
          className="w-12 h-9 outline-none active:outline-none text-black  text-center"
          onInput={(e) => handleInput(e.currentTarget.value)}
        />
        <Button
          size="sm"
          variant="ghost"
          disabled={maxValue && data >= maxValue ? true : false}
          className=" text-black px-4 text-2xl active:bg-gray-200"
          onClick={() => {
            if (maxValue && data >= maxValue) return;
            const newValue = data + 1;
            if (inputRef?.current) {
              inputRef.current.value = String(newValue);
            }
            onChange?.(newValue);
          }}
        >
          +
        </Button>
      </div>
    </div>
  );
};
