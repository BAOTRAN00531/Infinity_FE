// @ts-nocheck
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Button from "../../reuseables/Button";
import { Button as buttonform } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  cardNumber: z.string().min(1, "Số thẻ không được để trống"),
  expiryDate: z.coerce.date(),
  cvv: z.string().min(1, "Mã bảo mật không được để trống"),
  country: z.string().default("Việt Nam"),
});

const PaymentComponent = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expiryDate: new Date(),
    },
  });

  const onSubmit = (values) => {
    console.log(values);
    toast.success("Form submitted successfully!");
  };

  return (
    <div className="w-full h-full flex justify-between items-center gap-[200px]">
      <div className="flex flex-col gap-[38px] flex-1">
        <h1 className="uppercase font-[900] text-4xl text-slate-600">
          hãy chọn một trong những gói sau để đăng ký dùng thử
          <span className="bg-[linear-gradient(91deg,#00F6FF_-18.85%,#008CFF_50.9%,#0FF_124.79%)] bg-clip-text text-transparent">
            {" "}
            miễn phí
          </span>
        </h1>
        <div className="cursor-pointer w-[414px] flex flex-col items-start gap-8 rounded-2xl p-4 border-2 border-[rgba(0, 0, 0, 0.00)]">
          <div className="font-bold text-white bg-[linear-gradient(91deg,#00F6FF_-18.85%,#008CFF_50.9%,#0FF_124.79%)] p-2 rounded-lg">
            2-6 thành viên
          </div>
          <div className="text-slate-600 flex w-full items-center justify-between font-bold">
            <span className="text-[20px]">Gói đội nhóm</span>
            <span>12 tháng</span>
          </div>
          <div className="w-full flex justify-end font-bold text-slate-600">
            <span>247.999 / Tháng</span>
          </div>
        </div>
        <div className="font-normal flex flex-col gap-1 text-slate-600">
          <span className="font-bold">
            Thanh toán định kỳ, hủy bất kỳ lúc nào
          </span>
          <span className="font-medium">
            Nếu bạn không hủy đăng ký muộn nhất là 24 tiếng trước khi hết hạn
            dùng thử thì ứng dụng sẽ tự động trừ phí đăng ký theo điều khoản và
            mức giá mà bạn đã chọn trước đó.
          </span>
        </div>
      </div>
      <div className="flex-1 trial__main__right">
        <div className="trial_table w-full mx-auto rounded-2xl backdrop-blur-sm flex flex-col gap-4 items-center justify-end">
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md relative z-999">
            <h2 className="text-xl font-semibold mb-4">Thông tin thanh toán</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SỐ THẺ</FormLabel>
                      <FormControl>
                        <Input placeholder="123 123 123 123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NGÀY HẾT HẠN</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <buttonform
                              variant={"outline"}
                              className={`w-full text-left ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              {field.value
                                ? format(field.value, "MM/yyyy")
                                : "MM/YY"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </buttonform>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MÃ BẢO MẬT</FormLabel>
                      <FormControl>
                        <Input placeholder="CVC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>QUỐC GIA</FormLabel>
                      <FormControl>
                        <Input placeholder="Việt Nam" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <p className="text-sm text-gray-500">
                  Khi cung cấp thông tin thẻ, bạn cho phép Infinity tính phí của
                  bạn cho các khoản thanh toán trong tương lai theo các điều
                  khoản cụ thể của hợp đồng.
                </p>

                <Button type="ctaPremium" className="min-w-full">
                  BẮT ĐẦU 14 NGÀY DÙNG THỬ MIỄN PHÍ
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
