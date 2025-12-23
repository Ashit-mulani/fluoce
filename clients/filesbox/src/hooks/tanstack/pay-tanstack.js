import { useMutation } from "@tanstack/react-query";
import { payOrder } from "../api/pay-api";
import { toast } from "sonner";

export const usePayOrder = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await payOrder(data);
      return res.data;
    },
    onSuccess: (data) => {
      const order = data?.orderData;
      if (order) {
        const options = {
          key: order.key,
          order_id: order.orderId,
          amount: order.amount,
          currency: order.currency,
          name: "Fluoce",
          description: `Upgrade to ${order.planName}`,
        };

        if (typeof window === "undefined" || !window.Razorpay) {
          alert(
            "Payment provider failed to load. Please try refreshing the page."
          );
          return;
        }
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    },
    onError: (error) => {
      if (error?.message && typeof window !== "undefined") {
        toast.error(error.message);
      }
    },
  });
};
