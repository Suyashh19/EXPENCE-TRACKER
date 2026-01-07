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
    <div className="flex flex-col gap-6 sm:gap-8 px-4 sm:px-0">
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
        Settings
      </h2>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* LEFT SETTINGS MENU */}
        <div className="
          w-full
          lg:w-72
          rounded-3xl lg:rounded-[3rem]
          thin-glass
          p-3 sm:p-4 lg:p-6
          shadow-xl
          overflow-x-auto
        ">
          <div className="
            flex lg:flex-col
            gap-2
            min-w-max lg:min-w-0
          ">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  whitespace-nowrap
                  rounded-2xl
                  px-4 sm:px-5 lg:px-6
                  py-3 sm:py-3.5 lg:py-4
                  text-sm
                  font-bold
                  transition-all
                  ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-400 hover:bg-white/40 hover:text-slate-900"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="
          flex-1
          rounded-3xl lg:rounded-[3rem]
          thin-glass
          p-6 sm:p-8 lg:p-10
          shadow-2xl
        ">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
