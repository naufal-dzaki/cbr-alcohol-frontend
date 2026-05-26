import { SessionNavBar } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen flex-row overflow-hidden bg-gray-50/50">
      <SessionNavBar />
      
      <main className="ml-[3.05rem] flex h-screen grow flex-col overflow-auto px-6 py-4">
        {children}
      </main>
    </div>
  );
}