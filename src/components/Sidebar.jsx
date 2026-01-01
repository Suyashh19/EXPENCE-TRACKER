import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Add", path: "/add" },
    { name: "Expenses", path: "/expenses" },
    { name: "Analytics", path: "/analytics" },
    { name: "Advice", path: "/advice" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="
        hidden md:flex
        w-80
        flex-col
        rounded-[3rem]
        border border-white/90
        bg-white/5
        p-10
        shadow-2xl
        backdrop-blur-[120px]
        ring-1 ring-white/20
      ">
        {/* LOGO */}
        <div className="mb-16 flex items-center gap-4">
          <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center">
            <div className="h-4 w-4 rounded-sm bg-white rotate-45"></div>
          </div>
          <h2 className="text-2xl font-black text-slate-900">Finora</h2>
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  cursor-pointer
                  rounded-2xl
                  px-6
                  py-4
                  font-bold
                  transition
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-400 hover:bg-white/40"
                  }
                `}
              >
                {item.name}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className="
        fixed bottom-0 left-0 right-0
        z-50
        flex md:hidden
        justify-around
        items-center
        bg-white/80
        backdrop-blur-xl
        border-t border-white/60
        py-3
      ">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col
                items-center
                text-xs
                font-bold
                transition
                ${
                  active
                    ? "text-blue-600"
                    : "text-slate-400"
                }
              `}
            >
              <span
                className={`
                  mb-1
                  h-1.5
                  w-1.5
                  rounded-full
                  ${
                    active ? "bg-blue-600" : "bg-transparent"
                  }
                `}
              />
              {item.name}
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
