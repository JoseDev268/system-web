import { auth } from "@/auth.config";
import Footer from "@/components/landing/Footer";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { TopMenu } from "@/components/ui/top-menu/TopMenu";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Si no hay sesión, redirigir a /public
  if (!session || !session.user) {
    redirect('/');
  }

  // Si el usuario no es ADMIN, redirigir a /unauthorized
  if (session.user.rol !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return (
    <main className="min-h-screen">
      <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Header /> */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
    </main>
  );
}