// @ts-nocheck
import SetUpHeader from "../../components/page-component/set-up/SetUpHeader";

function Layout({ children }) {
  return (
    <div className="max-w-7xl mx-auto relative">
      <SetUpHeader></SetUpHeader>
      <main className="flex flex-col items-center justify-center gap-10 mt-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
