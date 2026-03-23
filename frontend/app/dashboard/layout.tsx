import { UserButton } from "@clerk/nextjs";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0A0A0F] text-[#F1F5F9]">
      {/* Sidebar - fixed at 240px as per 7.2 */}
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Topbar - full width, 64px tall as per 7.2 */}
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
}
