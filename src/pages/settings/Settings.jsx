import { useState } from "react";
import Profile from "./Profile";
import Preferences from "./Preferences";
import Notifications from "./Notifications";
import Security from "./Security";
import DataPrivacy from "./DataPrivacy";

export default function Settings() {
  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "preferences", label: "Preferences" },
    { key: "notifications", label: "Notifications" },
    { key: "security", label: "Security" },
    { key: "privacy", label: "Data & Privacy" },
  ];

  const [activeTab, setActiveTab] = useState("profile");

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "preferences":
        return <Preferences />;
      case "notifications":
        return <Notifications />;
      case "security":
        return <Security />;
      case "privacy":
        return <DataPrivacy />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-3xl font-black tracking-tight text-slate-900">
        Settings
      </h2>

      <div className="flex gap-8">
        {/* LEFT SETTINGS MENU */}
        <div className="w-72 rounded-[3rem] thin-glass p-6 shadow-xl">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full rounded-2xl px-6 py-4 text-left text-sm font-bold transition-all ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-400 hover:bg-white/40 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 rounded-[3rem] thin-glass p-10 shadow-2xl">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
