// @ts-nocheck
import React from "react";
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

// Định nghĩa schema
const formSchema = z.object({
  old: z.string().min(1).max(3),
});

const ForgotPassword = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
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
      <span className="font-normal text-slate-600 text-center">
        Chúng tôi sẽ gửi hướng dẫn về quy trình đổi mật khẩu qua email của bạn
      </span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-8 flex flex-col"
        >
          <FormField
            control={form.control}
            name="old"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Input
                    className="px-[14px] rounded-2xl h-[50px] border-2 border-slate-300 bg-background placeholder:text-slate-300"
                    placeholder="Email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="primary" className="min-w-full">
            gửi ngay
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPassword;
