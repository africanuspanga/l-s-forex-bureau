import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | L&S Forex Bureau",
};

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-surface px-4 py-16">
      <div className="card-shadow w-full max-w-sm overflow-hidden rounded-2xl bg-white">
        <div className="flex flex-col items-center gap-2 bg-primary px-6 py-8">
          <Image
            src="/logo.png"
            alt="L&S Forex Bureau"
            width={64}
            height={64}
            className="h-16 w-16 object-contain"
            priority
          />
          <p className="font-display text-lg font-semibold text-white">
            L&S Forex Bureau
          </p>
          <p className="text-sm text-white/70">Admin Console</p>
        </div>
        <div className="p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
