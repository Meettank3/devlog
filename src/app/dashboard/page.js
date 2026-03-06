"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
      else setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-400">DevLog 🚀</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome, {user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-gray-300 font-medium">Dashboard coming soon!</p>
          <p className="text-gray-500 text-sm mt-1">Standup form goes here next</p>
        </div>
      </div>
    </main>
  );
}