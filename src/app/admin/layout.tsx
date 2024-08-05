import { Sidebar } from "@/components/common/sidebar/Sidebar";

export const metadata = {
 title: 'Tech-Store Admin',
 description: 'Tech-Store Admin Dashboard',
};

export default function AdminLayout({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar/>
      <div className="p-4 sm:ml-64">
        <div className="mt-14">
        {children}
        </div>
      </div>
    </>
  );
}