import { writeApi } from "@/lib/axios";

export const payOrder = async (data) => {
  try {
    const res = await writeApi.post(`/pay/order`, data);
    return res.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message || "Failed to create your order"
    );
  }
};
