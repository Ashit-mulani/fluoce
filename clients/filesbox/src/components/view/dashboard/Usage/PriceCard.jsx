import { Spinner } from "@/components/ui/spinner";
import React from "react";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const PriceCard = ({
  className,
  planName,
  description,
  onClick,
  price,
  currency,
  btnText,
  active,
  disabled,
}) => {
  return (
    <div
      className={`${className} flex w-full max-w-66 flex-col justify-between gap-12 rounded-4xl border p-8 pb-6 text-neutral-700`}
    >
      <div className="flex flex-col items-start">
        <h1 className="text-3xl font-bold">{planName}</h1>
        <p className="font-mono tracking-tighter text-neutral-600">
          {description}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="ml-2 flex items-end text-2xl">
          <span>{currency}</span>
          <span className="font-semibold">
            {price} <span className="text-zinc-500">/-</span>
          </span>
        </div>
        <PurchaseBtn
          onClick={onClick}
          active={active}
          disabled={disabled}
          text={btnText}
        />
      </div>
    </div>
  );
};

export default PriceCard;

const PurchaseBtn = ({ onClick, active, text, disabled }) => {
  if (active) {
    return (
      <button
        className="flex items-center justify-center gap-2 rounded-full bg-[#152527] p-2.5 font-medium text-green-500"
        disabled
      >
        <IoCheckmarkDoneCircle size={20} />
        Active
      </button>
    );
  }
  return (
    <button
      disabled={disabled}
      className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#152527] p-2.5 font-medium text-neutral-300 hover:opacity-90"
      onClick={onClick}
    >
      {disabled && <Spinner />} {text}
    </button>
  );
};
