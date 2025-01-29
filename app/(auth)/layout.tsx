import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has("token");

  if (!isAuthenticated) {
    redirect("/login");
  }

  return <>{children}</>;
}
