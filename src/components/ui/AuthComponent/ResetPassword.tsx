// @ts-nocheck
import React, { useState } from "react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import Button from "../../reuseables/Button";
import ToastAuthComponent from "./ToastAuthComponent";

// Định nghĩa schema validation
const formSchema = z.object({
  newpassword: z.string().min(8, "Mật khẩu mới phải tối thiểu 8 ký tự").max(36),
  oldpassword: z.string().min(8, "Mật khẩu cũ phải tối thiểu 8 ký tự").max(36),
});

const ResetPassword = () => {
  const [showToast, setShowToast] = useState(false);
  const [checkPassword, isCheckPassword] = useState();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values) {
    try {
      console.log(values);
      values.newpassword === values.oldpassword
        ? isCheckPassword(true)
        : isCheckPassword(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, [3000]);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-11">
      <h1 className="text-2xl font-extrabold text-center text-primary">
        Quên mật khẩu
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-8 flex flex-col"
        >
          <FormField
            control={form.control}
            name="newpassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="px-[14px] rounded-2xl h-[50px] border-2 border-slate-300 bg-background placeholder:text-slate-300"
                    placeholder="Nhập mật khẩu mới"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="oldpassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="px-[14px] rounded-2xl h-[50px] border-2 border-slate-300 bg-background placeholder:text-slate-300"
                    placeholder="Nhập mật khẩu cũ"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            onclick={form.handleSubmit(onSubmit)}
            type="primary"
            className="min-w-full"
          >
            xác nhận
          </Button>
        </form>
      </Form>
      {showToast ? (
        checkPassword ? (
          <ToastAuthComponent
            message="success"
            content="Đặt lại mật khẩu thành công."
            contentDetail="Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ!"
            link={"/auth/login"}
          />
        ) : (
          <ToastAuthComponent
            message="fail"
            content="Xác thực không thành công"
            contentDetail="Vui lòng thử lại sau giây lát"
            nameButton="Thử lại"
          />
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default ResetPassword;
