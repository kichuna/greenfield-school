"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email:    z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email:    data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) router.push("/admin/dashboard");
    else setError("Invalid email or password.");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-school-blue rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-9 h-9 text-school-gold" />
            </div>
            <div>
              <p className="font-heading font-bold text-school-blue text-lg">Greenfield High School</p>
              <p className="text-gray-500 text-sm">Staff Portal</p>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="font-heading font-bold text-2xl text-gray-900 mb-1">Sign In</h1>
          <p className="text-gray-500 text-sm mb-8">Access the school management dashboard.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 mb-6">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                {...register("email")}
                className="input"
                placeholder="admin@greenfieldhs.ac"
                autoComplete="email"
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  {...register("password")}
                  className="input pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-3">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Need access?{" "}
            <a href="mailto:admin@greenfieldhs.ac" className="text-school-blue hover:underline font-medium">
              Contact the administrator
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Default credentials: admin@greenfieldhs.ac / Admin@1234
        </p>
      </div>
    </div>
  );
}
