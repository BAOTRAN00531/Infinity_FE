// @ts-nocheck
import { NavLink } from "react-router-dom";
import { useQuizz } from "../../../contexts/QuizzContext";
import ProgressBar from "./ProgressBar";
import { ArrowLeftIcon } from "lucide-react";

function Header() {
  const {
    state: { progress },
  } = useQuizz();

  return (
    <div className="flex items-center gap-16">
      <NavLink
        to="/hoc"
        className={"text-slate-300 hover:text-slate-400 transition"}
      >
        <ArrowLeftIcon />
      </NavLink>
      <ProgressBar />
      <div className="font-bold text-slate-600">{progress}%</div>
    </div>
  );
}

export default Header;
