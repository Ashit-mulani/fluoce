"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button size="icon-sm" variant="outline" onClick={() => router.back()}>
      <IoArrowBack size={20} />
    </Button>
  );
}
