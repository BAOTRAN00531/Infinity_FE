import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import api from "@/api";

const VerifyEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    const [countdown, setCountdown] = useState(3);
    const [redirectTo, setRedirectTo] = useState<string | null>(null);
    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [message, setMessage] = useState("Đang xác thực email...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Không tìm thấy token xác thực.");
            toast.error("Không tìm thấy token xác thực.", { autoClose: 1200 });
            return;
        }

        const controller = new AbortController();

        api
            .get("/auth/verify-email", {
                params: { token },
                signal: controller.signal,
            })
            .then((res) => {
                const data = res.data;
                setStatus("success");
                setMessage(data.message || "Xác thực email thành công!");
                toast.success(data.message || "Xác thực email thành công!", {
                    autoClose: 1200,
                });

                if (data.redirectTo) {
                    setRedirectTo(data.redirectTo);
                    const timer = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                clearInterval(timer);
                                navigate(data.redirectTo);
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                }
            })
            .catch((error) => {
                if (error.name === "CanceledError") return;
                console.error(error);
                setStatus("error");
                setMessage(error.response?.data?.message || "Có lỗi xảy ra!");
                toast.error(error.response?.data?.message || "Có lỗi xảy ra!", {
                    autoClose: 1200,
                });
            });

        return () => controller.abort();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            >
                {/* Icon trạng thái */}
                <div className="flex justify-center mb-6">
                    {status === "loading" && (
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                    )}
                    {status === "success" && (
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    )}
                    {status === "error" && (
                        <XCircle className="w-16 h-16 text-red-500" />
                    )}
                </div>

                {/* Tiêu đề */}
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    {status === "loading" && "Đang xác thực..."}
                    {status === "success" && "Xác thực thành công"}
                    {status === "error" && "Xác thực thất bại"}
                </h2>

                {/* Thông điệp */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {message}
                </p>

                {/* Redirect đếm ngược */}
                {redirectTo && status === "success" && (
                    <p className="text-sm text-gray-500">
                        Bạn sẽ được chuyển hướng sau{" "}
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
              {countdown}
            </span>{" "}
                        giây...
                    </p>
                )}
            </motion.div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default VerifyEmail;
