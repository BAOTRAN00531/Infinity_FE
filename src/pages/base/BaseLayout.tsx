// @ts-nocheck
import Header from "../../components/layouts/base/Header";
import Sidebar from "../../components/layouts/base/Sidebar";

export default function BaseLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex h-[88vh]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
