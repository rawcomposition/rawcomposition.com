import Header from "components/Header";
import Sidebar from "components/Sidebar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <div className="container flex flex-col md:flex-row gap-8 max-w-[1200px]">
        <div className="flex-1 p-12 bg-white mb-4 prose prose-headings:font-heading prose-headings:text-neutral-600 prose-a:text-orange max-w-full">
          {children}
        </div>
        <Sidebar />
      </div>
    </>
  );
}
