// @ts-nocheck
import { useParams } from "react-router-dom";
import useAuthComponent from "../../hooks/useAuthComponent";
import HeaderAuthComponent from "../../components/auth-component/HeaderAuthComponent/HeaderAuthComponent";

const Auth = () => {
  const { action } = useParams();
  const main = useAuthComponent(action);

  return (
    <div className="w-full min-h-screen py-[80px] px-[120px] relative">
      <HeaderAuthComponent action={action} />
      <div className="max-w-[340px] m-auto">
        {main}
      </div>
    </div>
  );
};

export default Auth;
