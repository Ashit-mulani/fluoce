import React, { useEffect } from "react";
import Google from "../others/Google";
import Facebook from "../others/Facebook";
import Github from "../others/Github";
import Apple from "../others/Apple";
import { Input } from "../ui/input";
import { useStateContext } from "@/context/State";
import { useLocation, useNavigate } from "react-router-dom";
import SendBtn from "../ui/SendBtn";
import { useForm } from "react-hook-form";
import FormHeader from "../ui/FormHeader";
import useAuthApi from "@/api/auth-api";
import { Button } from "../ui/button";
import { getHomeUrl } from "@/utils/getRefUrl";

const SignUp = () => {
  const { error, setRefUrl, refUrl, isLoading } = useStateContext();

  const { emailAuth } = useAuthApi();

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");

    if (ref) {
      setRefUrl(ref);
    }
  }, [location.search]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const singUpWithEmail = async (data) => {
    const success = await emailAuth(data);
    if (success) {
      navigate("/auth/verify");
    }
  };

  return (
    <div className="flex flex-col gap-8 w-64">
      <div className="flex flex-col gap-1.5 items-start">
        <FormHeader />
        <p className="text-xs font-medium p-0.5 text-zinc-700">
          Sign up with email or continue with a social. Quick, simple, and
          secure.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <form
          onSubmit={handleSubmit(singUpWithEmail)}
          className="flex items-center justify-center gap-3"
        >
          <Input
            className="p-5.5 placeholder:text-sm text-sm"
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
            })}
          />
          <SendBtn isLoading={isLoading} type="submit" />
        </form>
        {errors.email && (
          <span className="text-xs flex items-center justify-center font-medium text-red-500">
            {errors.email.message}
          </span>
        )}
        <div className="flex items-center justify-center gap-1 ">
          <span className="border-t flex-1"></span>
          <span className="text-xs font-medium shrink-0 text-zinc-500/50 -mt-1">
            or continue with
          </span>
          <span className="border-t flex-1"></span>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center">
          <Google />
          {/* <Facebook />
          <Apple />
          <Github /> */}
        </div>
        {error && (
          <span className="text-[13px] flex items-center justify-center font-medium text-red-500">
            {error}
          </span>
        )}
      </div>
      <div className=" text-[10px] items-center font-medium text-zinc-400 justify-between flex gap-2">
        {refUrl && (
          <Button
            onClick={() => {
              const url = getHomeUrl(refUrl);
              if (url) {
                window.location.replace(url);
              }
            }}
            variant="ghost"
          >
            Back
          </Button>
        )}
        <p className="flex items-center gap-2">
          <span className="hover:text-blue-600 hover:underline">
            Terms of Use
          </span>
          |
          <span className="hover:text-blue-600 hover:underline">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
