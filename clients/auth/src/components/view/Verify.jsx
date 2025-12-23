import { useStateContext } from "@/context/State";
import React from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import SendBtn from "../ui/SendBtn";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import FormHeader from "../ui/FormHeader";
import useAuthApi from "@/api/auth-api";

const Verify = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const { error, refUrl, user, isLoading, setError } = useStateContext();

  const { verifyEmail } = useAuthApi();

  const verify = async (data) => {
    const success = await verifyEmail({ otp: data?.otp, email: user?.email });
    if (success) {
      if (refUrl) {
        window.location.replace(refUrl);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 w-64">
      <div className="flex flex-col gap-1.5 items-start">
        <FormHeader />
        <p className="text-xs font-medium p-0.5 text-zinc-700">
          Enter the 4-digit code we just sent to{" "}
          {user?.email ? (
            <span className="font-semibold">{user?.email}</span>
          ) : (
            <span className="text-red-600">
              your email address (not found), retry
            </span>
          )}
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5 items-start">
          <form
            className="flex items-center justify-between w-full gap-3"
            onSubmit={handleSubmit(verify)}
          >
            <Controller
              name="otp"
              control={control}
              rules={{
                required: "Code is required",
                pattern: {
                  value: /^\d{4}$/,
                  message: "Enter a valid 4-digit code",
                },
              }}
              render={({ field }) => (
                <InputOTP
                  maxLength={4}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup className="gap-1">
                    <InputOTPSlot
                      className="rounded-md border p-5.5"
                      index={0}
                    />
                    <InputOTPSlot
                      className="rounded-md border p-5.5"
                      index={1}
                    />
                    <InputOTPSlot
                      className="rounded-md border p-5.5"
                      index={2}
                    />
                    <InputOTPSlot
                      className="rounded-md border p-5.5"
                      index={3}
                    />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            <SendBtn isLoading={isLoading} type="submit" />
          </form>
          <span className="text-xs font-medium text-zinc-500 ml-0.5">
            One-time password
          </span>
          {errors.otp && (
            <span className="text-xs flex items-center justify-center font-medium text-red-500">
              {errors.otp.message}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 justify-end font-medium">
          <span className="text-xs text-zinc-500">Didn't receive a code ?</span>
          <Link
            aria-disabled={isLoading}
            onClick={() => setError(null)}
            className="text-xs hover:underline text-blue-600 cursor-pointer"
            to={`/auth?ref=${refUrl}`}
          >
            Retry
          </Link>
        </div>
        {error && (
          <span className="text-[13px] flex items-center justify-center font-medium text-red-500">
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default Verify;
