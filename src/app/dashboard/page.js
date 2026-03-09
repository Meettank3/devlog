"use client";
import { useState, useEffect } from "react";
import { Plus, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [form, setForm] = useState({ did: "", blockers: "", plan: "" });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const router = useRouter();

  // TODO: useEffect to get user and fetch logs on page load
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) router.push("/login");
      setUser(user);
      fetchLogs(user.id);
    };
    getUser();
  }, []);

  // TODO: fetchLogs function - fetch logs from supabase for current user
  const fetchLogs = async (userId) => {
    const { data, error } = await supabase
      .from("log")
      .select("*")
      .eq("user_id", userId);
    if (error) return;
    setLogs(data);
    setStreak(calculateStreak(data));
  };

  // TODO: handleSubmit function - save form data to supabase
  const handleSubmit = async () => {
    if (!form.did) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("log")
      .insert({
        user_id: user.id,
        did: form.did,
        blockers: form.blockers,
        plan: form.plan,
      })
      .select();
    if (error) {
      setMessage("❌ Error: " + error.message);
      setLoading(false);
      return;
    }
    setForm({ did: "", blockers: "", plan: "" });
    setMessage("✅ Log saved!");
    setLoading(false);
    fetchLogs(user.id);
  };

  // TODO: handleLogout function - sign out and redirect to login
  const handleLogOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const generateSummary = async () => {
    setSummaryLoading(true);
    const response = await fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs: logs.slice(0, 7) }), // bcz we have 3 value in form blocker,did and plan
    });
    const data = await response.json();
    setSummary(data.summary);
    setSummaryLoading(false);
  };

  const calculateStreak = (logs) => {
    if (!logs || logs.length === 0) return 0;

    logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    let count = 0;
    for (let i = 0; i < logs.length; i++) {
      const logDate = new Date(logs[i].created_at);
      logDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date();
      expectedDate.setHours(0, 0, 0, 0);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (logDate.getTime() === expectedDate.getTime()) {
        count++;
      } else {
        break;
      }
    }
    return count;
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-purple-400">DevLog 🚀</h1>
            <p className="text-gray-400 text-sm mt-1">
              Welcome, {user?.email}
            </p>{" "}
          </div>
          <button
            onClick={handleLogOut}
            className="bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        <p className="text-orange-400 text-sm mt-1">🔥 {streak} day streak</p>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">
            Today's Standup 📝
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-green-400 flex items-center gap-2 mb-1">
                <CheckCircle size={14} /> What did you do today?
              </label>
              <textarea
                className="w-full bg-gray-800 rounded-lg p-3 text-sm text-white resize-none outline-none border border-gray-700 focus:border-purple-500"
                rows={2}
                placeholder="e.g. Built login page, fixed navbar bug..."
                value={form.did}
                onChange={(e) => setForm({ ...form, did: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-red-400 flex items-center gap-2 mb-1">
                <AlertCircle size={14} /> Any blockers?
              </label>
              <textarea
                className="w-full bg-gray-800 rounded-lg p-3 text-sm text-white resize-none outline-none border border-gray-700 focus:border-purple-500"
                rows={2}
                placeholder="e.g. Stuck on API integration..."
                value={form.blockers}
                onChange={(e) => setForm({ ...form, blockers: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-blue-400 flex items-center gap-2 mb-1">
                <Calendar size={14} /> Plan for tomorrow?
              </label>
              <textarea
                className="w-full bg-gray-800 rounded-lg p-3 text-sm text-white resize-none outline-none border border-gray-700 focus:border-purple-500"
                rows={2}
                placeholder="e.g. Work on dashboard UI..."
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
              />
            </div>

            {message && (
              <p className="text-sm text-green-400 bg-green-950 border border-green-800 rounded-lg p-3">
                {message}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Plus size={18} />
              {loading ? "Saving..." : "Log Today's Standup"}
            </button>
          </div>
        </div>

        {/* Button For getSummary */}

        <button
          onClick={generateSummary}
          disabled={summaryLoading}
          className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-sm text-gray-300 px-4 py-2 rounded-lg transition"
        >
          {summaryLoading ? "Generating..." : "🤖 Get Weekly Summary"}
        </button>

        {summary && (
          <div className="bg-gray-900 border border-purple-800 rounded-2xl p-6 my-4">
            <h2 className="text-lg font-semibold text-purple-400 mb-3">
              🤖 Weekly Summary
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Previous Logs */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">
            Previous Logs 📅
          </h2>
          {logs.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-gray-400">
                No logs yet. Submit your first standup above!
              </p>
            </div>
          )}
          {logs.length > 0 && (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
                >
                  <p className="text-xs text-gray-500 mb-3">
                    {new Date(log.created_at).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-green-400">✅ {log.did}</p>
                  {log.blockers && (
                    <p className="text-sm text-red-400 mt-1">
                      🚧 {log.blockers}
                    </p>
                  )}
                  {log.plan && (
                    <p className="text-sm text-blue-400 mt-1">📅 {log.plan}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
