// @ts-nocheck
import { Route, Routes } from "react-router-dom";
import Hello from "./pages/set-up/Hello";
import SelectCourse from "./pages/set-up/SelectCourse";
import Learn from "./pages/base/Learn";
import BaseLayout from "./pages/base/BaseLayout";
import Pronun from "./pages/base/Pronun";
import Profile from "./pages/base/Profile";
import StudyPart from "./pages/base/StudyPart";
import Courses from "./pages/base/Courses";
import Lesson from "./pages/lesson/Lesson";
import QuizzResult from "./components/page-component/lesson/quizz/QuizzResult";
import Auth from "./pages/Auth/Auth";
import TrialComponent from "./components/ui/TrialComponent/TrialComponent";
import MainIndexTrialComponent from "./components/ui/TrialComponent/MainIndexTrialComponent";
import RemiderComponent from "./components/ui/TrialComponent/RemiderComponent";
import PlanTrialComponent from "./components/ui/TrialComponent/PlanTrialComponent";
import PaymentComponent from "./components/ui/TrialComponent/PaymentComponent";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Hello />}></Route>
        <Route path="/chon-khoa-hoc" element={<SelectCourse />} />
        <Route
          path="/hoc"
          element={
            <BaseLayout>
              <Learn />
            </BaseLayout>
          }
        />
        <Route path="/hoc/bai-hoc/:slug" element={<Lesson />} />
        <Route path="/hoc/bai-hoc/:slug/ket-qua" element={<QuizzResult />} />
        <Route
          path="/phat-am"
          element={
            <BaseLayout>
              <Pronun />
            </BaseLayout>
          }
        />
        <Route
          path="/hoc-phan"
          element={
            <BaseLayout>
              <StudyPart />
            </BaseLayout>
          }
        />
        <Route
          path="/khoa-hoc"
          element={
            <BaseLayout>
              <Courses />
            </BaseLayout>
          }
        />
        <Route
          path="/ho-so"
          element={
            <BaseLayout>
              <Profile />
            </BaseLayout>
          }
        />
        <Route
          path="/remider"
          element={
            <TrialComponent>
              <RemiderComponent />
            </TrialComponent>
          }
        />
        <Route
          path="/trial"
          element={
            <TrialComponent>
              <MainIndexTrialComponent />
            </TrialComponent>
          }
        />
        <Route
          path="/plan-trial"
          element={
            <TrialComponent>
              <PlanTrialComponent />
            </TrialComponent>
          }
        />
        <Route
          path="/payment"
          element={
            <TrialComponent>
              <PaymentComponent />
            </TrialComponent>
          }
        />
        <Route path="/auth/:action" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
