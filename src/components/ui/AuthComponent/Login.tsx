// @ts-nocheck
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../reuseables/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../input";
import FooterForm from "../../auth-component/FormAuthComponent/FooterForm";

const formSchema = z.object({
  name_7276315374: z.string().min(1, "Vui lòng nhập email hoặc số điện thoại"),
  name_4761952747: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export default function Login() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  function onSubmit(values) {
    try {
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
        Đăng Nhập
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-8 flex flex-col"
        >
          {/* Email / Số điện thoại */}
          <FormField
            control={form.control}
            name="name_7276315374"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Input
                    className={
                      "py-[10px] px-[14px] rounded-2xl h-[50px] border-2 border-slate-300 bg-background placeholder:text-slate-300"
                    }
                    placeholder="Email hoặc số điện thoại"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mật khẩu */}
          <FormField
            control={form.control}
            name="name_4761952747"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Input
                    className={
                      "py-[10px] px-[14px] rounded-2xl h-[50px] border-2 border-slate-300 bg-background placeholder:text-slate-300"
                    }
                    type={"password"}
                    placeholder="Mật khẩu"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <span>
            Bạn không nhớ mật khẩu?{" "}
            <Link className="text-primary" to={"/auth/forgotPassword"}>
              Bấm vào đây
            </Link>
          </span>
          <Button type="primary" className="min-w-full">
            Đăng nhập
          </Button>
          <FooterForm />
        </form>
      </Form>
    </div>
  );
}
