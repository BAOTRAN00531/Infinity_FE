// @ts-nocheck
import Layout from "./layout";
import Gradient from "../../components/reuseables/Gradient";
import Button from "../../components/reuseables/Button";
import { NavLink } from "react-router-dom";

function Hello() {
  return (
    <Layout>
      <Gradient />
      <div className="">
        <img src="/images/black-cat.png" alt="black-cat" className="w-sm" />
      </div>
      <h4 className="font-bold text-xl text-center leading-8 text-slate-600 be-vietnam-pro-bold max-w-[550px]">
        Xin chào, hãy để chúng mình trở thành bạn đồng hành trên con đường khám
        phá ngôn ngữ của bạn nhé!
      </h4>

      <NavLink to="/chon-khoa-hoc">
        <Button type="primary" className="px-12">
          Tiếp tục
        </Button>
      </NavLink>
    </Layout>
  );
}

export default Hello;
