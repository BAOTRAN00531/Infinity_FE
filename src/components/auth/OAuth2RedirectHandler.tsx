import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * Component xử lý redirect từ OAuth2 (Google, Facebook, …)
 */
const OAuth2RedirectHandler: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const token = params.get("token");
        const error = params.get("error");

        if (token) {
            localStorage.setItem("access_token", token);

            toast.success("🎉 Đăng nhập thành công!");

            setTimeout(() => navigate("/"), 1000);
        } else {
            console.error("OAuth2 error:", error);
            toast.error(`Đăng nhập thất bại. ${error || ""}`);
            setTimeout(() => navigate("/login"), 2000);
        }
    }, [location, navigate]);


    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Đang xử lý đăng nhập…
            </p>
        </div>
    );
};

export default OAuth2RedirectHandler;
