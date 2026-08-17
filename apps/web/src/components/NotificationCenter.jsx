import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Activity,
  CheckCircle2,
  ShieldAlert,
  X,
  ArrowRight,
  Filter,
  Trash2
} from "lucide-react";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "CRITICAL",
    title: "Patient SpO2 Drop Detected",
    message: "Sarah Jenkins (MRN-908124) SpO2 dropped to 89% in ICU Telemetry.",
    timestamp: "2 mins ago",
    read: false,
    link: "/early-warning",
    icon: Activity,
    color: "red",
  },
  {
    id: 2,
    type: "WARNING",
    title: "Financial Billing Overcharge Flag",
    message: "ADK Advocate detected $34,700 overcharge on Robert Chen's biologic bill.",
    timestamp: "14 mins ago",
    read: false,
    link: "/financial-advocate",
    icon: ShieldAlert,
    color: "orange",
  },
  {
    id: 3,
    type: "INFO",
    title: "New Trial Match Available",
    message: "Model 1 found 96% match for Elena Rostova on Phase III Ischemia trial.",
    timestamp: "1 hour ago",
    read: true,
    link: "/trial-matching",
    icon: CheckCircle2,
    color: "blue",
  },
  {
    id: 4,
    type: "INFO",
    title: "Kaggle Model Training Complete",
    message: "Early Warning LSTM v2.4 trained on Kaggle with 97.4% ROC-AUC.",
    timestamp: "3 hours ago",
    read: true,
    link: "/kaggle-training",
    icon: CheckCircle2,
    color: "green",
  },
];

export default function NotificationCenter({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("ALL");

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (filter === "ALL") return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#1e293b] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                Clinical Alerts & Notifications
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">Real-time ICU telemetry & AI updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            {["ALL", "CRITICAL", "WARNING", "INFO"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  filter === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[11px] text-blue-400 hover:underline font-medium"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No notifications in this category.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all relative ${
                    item.read
                      ? "bg-slate-900/40 border-slate-800/80 text-slate-400"
                      : item.type === "CRITICAL"
                      ? "bg-red-500/10 border-red-500/30 text-slate-200"
                      : item.type === "WARNING"
                      ? "bg-amber-500/10 border-amber-500/30 text-slate-200"
                      : "bg-blue-500/10 border-blue-500/30 text-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded border ${
                          item.type === "CRITICAL"
                            ? "bg-red-500/20 text-red-400 border-red-500/40"
                            : item.type === "WARNING"
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/40"
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="font-bold text-xs text-white">{item.title}</span>
                    </div>
                    <button
                      onClick={() => deleteNotification(item.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-2">{item.message}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>{item.timestamp}</span>
                    <a
                      href={item.link}
                      onClick={onClose}
                      className="text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Inspect Module <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
