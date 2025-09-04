// @ts-nocheck
import Header from "../../components/layouts/lesson/Header";

function LessonLayout({ children }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 be-vietnam-pro-regular text-slate-600">
      <Header />
      {children}
    </div>
  );
}

export default LessonLayout;
