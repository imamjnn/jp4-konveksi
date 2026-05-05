/* eslint-disable react-hooks/immutability */
"use client";

import { LoginForm } from "@/components/auth/login-form";
import Cookies from "js-cookie";

export default function Page() {
  const token = Cookies.get("accessToken");

  if (token) {
    // kalau token masih ada, redirect ke dashboard
    window.location.href = "/dashboard";
    return null;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
