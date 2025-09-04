// @ts-nocheck
import AuthStep2 from "../components/ui/AuthComponent/AuthStep2";
import ForgotPassword from "../components/ui/AuthComponent/ForgotPassword";
import Login from "../components/ui/AuthComponent/Login";
import Register from "../components/ui/AuthComponent/Register";
import ResetPassword from "../components/ui/AuthComponent/ResetPassword";
const useAuthComponent = (action) => {
  switch (action) {
    case "login":
      return <Login />;
    case "register":
      return <Register />;
    case "forgotPassword":
      return <ForgotPassword />;
    case "resetPassword":
      return <ResetPassword />;
    case "confirmLogin":
      return <AuthStep2 />;
    default:
      return <p>Trang không tồn tại!</p>;
  }
};

export default useAuthComponent;
