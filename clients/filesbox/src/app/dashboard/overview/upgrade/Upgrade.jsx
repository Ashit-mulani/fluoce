"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PriceCard from "@/components/view/dashboard/Usage/PriceCard";
import Wrapper from "@/components/view/dashboard/wrapper/Wrapper";
import { usePayOrder } from "@/hooks/tanstack/pay-tanstack";
import { setTrashFolders, setUsage } from "@/store/slice/usage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidPurchaseTagAlt } from "react-icons/bi";

const PLAN_NAME_MAP = {
  FREE: "FREE",
  STANDARD: "STANDARD",
  PRO: "PRO",
};

const Upgrade = ({ data }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUsage(data?.data?.storage));
    dispatch(setTrashFolders(data?.data?.trashFolders));
  }, [data]);

  const { mutate, isPending } = usePayOrder();

  const { usage } = useSelector((state) => state.usage);

  const activePlanName = usage?.plan?.name
    ? PLAN_NAME_MAP[usage.plan.name]
    : null;

  const plans = [
    {
      planName: "Free",
      description: "Includes 2 GB storage for basic usage.",
      price: "0",
      currency: "₹",
      btnText: "Free Plan",
      className: "bg-[#D88F73]",
      active: activePlanName === "FREE",
    },
    {
      planName: "Standard",
      description: "20 GB storage. Perfect for personal use.",
      price: "149",
      currency: "₹",
      btnText: "Purchase Now",
      className: "bg-[#83A4AB]",
      active: activePlanName === "STANDARD",
      disabled: isPending,
      onClick: () =>
        mutate({
          plan_name: "STANDARD",
        }),
    },
    {
      planName: "Pro",
      description: "100 GB storage built for professional use.",
      price: "199",
      currency: "₹",
      btnText: "Purchase Now",
      className: "bg-[#83AB87]",
      active: activePlanName === "PRO",
      disabled: isPending,
      onClick: () =>
        mutate({
          plan_name: "PRO",
        }),
    },
  ];

  return (
    <>
      <Wrapper className="p-2 md:p-4">
        <div className="flex flex-col gap-2 md:gap-4">
          <span className="text-4xl font-semibold text-neutral-500 md:text-6xl">
            Simple{" "}
            <span className="text-neutral-300 dark:text-neutral-700">
              pricing
            </span>
          </span>
          <div className="flex flex-wrap items-start gap-8">
            <span className="max-w-80 font-mono text-2xl text-zinc-500 md:text-3xl">
              Choose the right plan for your cloud storage needs
            </span>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 gap-y-4">
              {plans.map((plan, idx) => (
                <PriceCard key={plan.planName} {...plan} />
              ))}
            </div>
          </div>
          {usage && usage?.plan?.name && (
            <div className="mt-4 flex flex-col gap-4">
              <span className="flex items-center gap-2 text-zinc-500">
                <BiSolidPurchaseTagAlt className="rotate-90" size={18} /> Last
                Purchase
              </span>
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-500/10">
                    <TableHead className="text-xs text-zinc-500">
                      Plan
                    </TableHead>
                    <TableHead className="text-xs text-zinc-500">
                      Paid Amount
                    </TableHead>
                    <TableHead className="text-xs text-zinc-500">
                      Currency
                    </TableHead>
                    <TableHead className="text-xs text-zinc-500">
                      Provider
                    </TableHead>
                    <TableHead className="text-xs text-zinc-500">
                      OrderId
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{usage?.plan?.name}</TableCell>
                    <TableCell className="text-zinc-500">
                      {usage?.plan?.paymentBroker?.lastPaidAmount}
                    </TableCell>
                    <TableCell>
                      {usage?.plan?.paymentBroker?.currency}
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {usage?.plan?.paymentBroker?.provider}
                    </TableCell>
                    <TableCell>
                      {usage?.plan?.paymentBroker?.lastOrderId}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Wrapper>
    </>
  );
};

export default Upgrade;
