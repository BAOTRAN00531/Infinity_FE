// @ts-nocheck
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Button from "../../reuseables/Button";
import ToastAuthComponent from "./ToastAuthComponent";

// Schema: OTP phải đúng 6 ký tự
const formSchema = z.object({
  otp: z.string().length(6, "Mã OTP phải đủ 6 số"),
});
const AuthStep2 = () => {
  const [checkOPT, setCheckOPT] = useState();
  const [showToast, setShowToast] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  function onSubmit(values) {
    const OPT = 123456;
    // example use toast
    Number(values.otp) == OPT ? setCheckOPT(true) : setCheckOPT(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, [3000]);
  }
  return (
    <>
      <div className="flex flex-col gap-11">
        <h1 className="text-2xl font-extrabold text-center text-primary">
          Xác thực 2 lớp
        </h1>
        <span className="font-normal text-slate-600 text-center">
          Mở ứng dụng Google Authenticator, lấy mã và nhập vào ô bên dưới để xác
          thực
        </span>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="gap-8 flex flex-col"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="w-full h-auto">
                  {/* <FormLabel>Nhập mã OTP</FormLabel> */}
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <InputOTPGroup className="w-full flex gap-2 h-auto">
                        <InputOTPSlot
                          className="!rounded-2xl flex-1 text-center font-[900] text-slate-600 p-2.5 border-2 border-slate-300 shrink-0 w-[48px] h-[48px]"
                          index={0}
                        />
                        <InputOTPSlot
                          className="!rounded-2xl flex-1 text-center font-[900] text-slate-600 p-2.5 border-2 border-slate-300 shrink-0 w-[48px] h-[48px]"
                          index={1}
                        />
                        <InputOTPSlot
                          className="!rounded-2xl flex-1 text-center font-[900] text-slate-600 p-2.5 border-2 border-slate-300 shrink-0 w-[48px] h-[48px]"
                          index={2}
                        />
                        <InputOTPSlot
                          className="!rounded-2xl flex-1 text-center font-[900] text-slate-600 p-2.5 border-2 border-slate-300 shrink-0 w-[48px] h-[48px]"
                          index={3}
                        />
                        <InputOTPSlot
                          className="!rounded-2xl flex-1 text-center font-[900] text-slate-600 p-2.5 border-2 border-slate-300 shrink-0 w-[48px] h-[48px]"
                          index={4}
                        />
                        <InputOTPSlot
                          className="!rounded-2xl flex-1 text-center font-[900] text-slate-600 p-2.5 border-2 border-slate-300 shrink-0 w-[48px] h-[48px]"
                          index={5}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              onclick={form.handleSubmit(onSubmit)}
              type="secondary"
              className="m-auto"
            >
              xác thực
            </Button>
          </form>
        </Form>
      </div>
      {showToast ? (
        checkOPT ? (
          <ToastAuthComponent message="success" content="Xác thực thành công" />
        ) : (
          <ToastAuthComponent
            message="fail"
            content="Xác thực không thành công"
            contentDetail="Vui lòng thử lại sau giây lát"
          />
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default AuthStep2;
