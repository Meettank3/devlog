"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) setError(error.message);
      else router.push("/dashboard");
    } else {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (error) setError(error.message);
      else setError("Check your email for confirmation link! ✅");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-400">DevLog 🚀</h1>
          <p className="text-gray-400 mt-2">Your daily dev standup tracker</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {/* Toggle */}
          <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                isLogin ? "bg-purple-600 text-white" : "text-gray-400"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                !isLogin ? "bg-purple-600 text-white" : "text-gray-400"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white outline-none focus:border-purple-500"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white outline-none focus:border-purple-500"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950 border border-red-800 rounded-lg p-3">
                {error}
              </p>
            )}

            <div className="text-right">
              <button
                onClick={() => router.push("/forgot-password")}
                className="text-xs text-purple-400 hover:text-purple-300 transition"
              >
                Forgot Password?
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create Account"}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Built with ❤️ by Meet
        </p>
      </div>
    </main>
  );
}
