"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) setError(error.message);
    else setMessage("Password reset link sent! Check your email ✅");

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-400">DevLog 🚀</h1>
          <p className="text-gray-400 mt-2">Reset your password</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white outline-none focus:border-purple-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {message && (
              <p className="text-sm text-green-400 bg-green-950 border border-green-800 rounded-lg p-3">
                {message}
              </p>
            )}

            {error && (
              <p className="text-sm text-red-400 bg-red-950 border border-red-800 rounded-lg p-3">
                {error}
              </p>
            )}

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              onClick={() => router.push("/login")}
              className="w-full text-gray-400 hover:text-white text-sm transition text-center"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}