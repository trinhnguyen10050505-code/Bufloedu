"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/hook/useCurrentUser";

type AuthGuardProps = {
  allowRole?: "student" | "teacher";
  children: React.ReactNode;
};

export default function AuthGuard({
  allowRole,
  children,
}: AuthGuardProps) {
  const { profile, loading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!profile) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowRole && profile.role !== allowRole) {
      router.replace("/");
    }
  }, [profile, loading, allowRole, router, pathname]);

  if (loading || !profile || (allowRole && profile.role !== allowRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-[28px] bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Bu đang kiểm tra quyền truy cập cho em...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}