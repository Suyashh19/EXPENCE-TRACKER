import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Add Expenses", path: "/add" },
    { name: "Expense List", path: "/expenses" },
    { name: "Analytics", path: "/analytics" },
    { name: "Advice", path: "/advice" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className="
          hidden md:flex
          w-64 lg:w-72 xl:w-80
          flex-col
          rounded-[3rem]
          border border-white/90
          bg-white/5
          p-8 lg:p-10
          shadow-2xl
          backdrop-blur-[120px]
          ring-1 ring-white/20
        "
      >
        {/* LOGO */}
        <div className="mb-12 flex items-center gap-4">
          <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
            <div className="h-4 w-4 rounded-sm bg-white rotate-45" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Finora
          </h2>
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  w-full
                  text-left
                  rounded-2xl
                  px-6
                  py-4
                  font-bold
                  transition-all
                  duration-200
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-400 hover:bg-white/40 hover:text-slate-800"
                  }
                `}
              >
                {item.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav
        className="
          fixed bottom-0 left-0 right-0
          z-50
          md:hidden
          bg-white/80
          backdrop-blur-xl
          border-t border-white/60
          safe-bottom
        "
      >
        <div
          className="
            flex
            gap-2
            px-3
            py-2
            overflow-x-auto
            scrollbar-hide
          "
        >
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  flex
                  flex-col
                  items-center
                  justify-center
                  min-w-[72px]
                  px-3
                  py-2
                  rounded-xl
                  text-[11px]
                  font-bold
                  transition-all
                  ${
                    active
                      ? "text-blue-600"
                      : "text-slate-400"
                  }
                `}
              >
                {/* ACTIVE INDICATOR */}
                <span
                  className={`
                    mb-1
                    h-1
                    w-6
                    rounded-full
                    transition-all
                    ${
                      active
                        ? "bg-blue-600"
                        : "bg-transparent"
                    }
                  `}
                />
                <span className="whitespace-nowrap">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
