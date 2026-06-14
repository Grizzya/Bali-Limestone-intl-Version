import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "./components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const adminId = (await cookies()).get("admin_session")?.value;

  // Security: redirect to login if no session cookie
  if (!adminId) {
    redirect("/admin/login");
  }

  // Security: verify session is valid against DB (not just trusting cookie value)
  const currentUser = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, role: true, isActive: true },
  });

  // Security: redirect if user not found or deactivated
  if (!currentUser || !currentUser.isActive) {
    redirect("/admin/login");
  }

  const isSuperAdmin = currentUser.role === "SUPERADMIN";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-black">
      <Sidebar isSuperAdmin={isSuperAdmin} />
      <main className="flex-grow overflow-y-auto bg-gray-50 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
