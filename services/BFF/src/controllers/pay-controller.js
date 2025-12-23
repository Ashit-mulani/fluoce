import { asyncFunc } from "../utils/asyncFunc.js";
import { validateFields } from "../utils/validateFields.js";
import { resolveService } from "../configs/service-discovery.js";
import { axiosHandler } from "../utils/axiosHandler.js";

// read

const payOrder = asyncFunc(async (req, res) => {
  const userId = req.user._id;
  const { plan_name } = req.body;

  validateFields({
    plan_name,
    userId,
  });

  const baseUrl = await resolveService("write-imagebox-write");

  const result = await axiosHandler({
    method: "post",
    url: `${baseUrl}/write/api/v2/pay/order`,
    data: {
      plan_name,
      userId,
    },
  });

  return res.json(result);
});

const payWebHook = asyncFunc(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];

  const rawBody = req.body;

  validateFields({ signature, rawBody });

  const baseUrl = await resolveService("write-imagebox-write");

  try {
    const result = await axiosHandler({
      method: "post",
      url: `${baseUrl}/write/api/v2/webhook/razorpay`,
      headers: {
        "x-razorpay-signature": signature,
        "content-type": "application/json",
      },
      data: rawBody,
      transformRequest: [(data) => data],
    });

    return res.status(200).json({
      success: true,
      forwarded: true,
      message: "Webhook received",
      serviceResponse: result,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      forwarded: false,
      message: "Error forwarding webhook",
    });
  }
});

export { payOrder, payWebHook };
