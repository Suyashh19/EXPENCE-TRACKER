import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Add Expense", path: "/add" },
    { name: "Expenses", path: "/expenses" },
    { name: "Analytics", path: "/analytics" },
    { name: "AI Advisory", path: "/advice" },
  ];

  return (
    <aside className="flex w-80 flex-col rounded-[3rem] border border-white/90 bg-white/5 p-10 shadow-2xl backdrop-blur-[120px] ring-1 ring-white/20">
      <div className="mb-16 flex items-center gap-4">
        <div className="h-10 w-10 rounded-2xl bg-blue-600 shadow-xl shadow-blue-400/30 flex items-center justify-center">
          <div className="h-4 w-4 rounded-sm bg-white rotate-45"></div>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Ecomic</h2>
      </div>
      
      <nav className="flex-1 space-y-4">
        {menuItems.map((item) => (
          <div 
            key={item.path} 
            onClick={() => navigate(item.path)}
            className={`flex cursor-pointer items-center rounded-2xl px-6 py-4 transition-all duration-500 ${
              location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/40' 
                : 'text-slate-400 hover:bg-white/40 hover:text-slate-900'
            }`}
          >
            <span className="text-sm font-bold tracking-wide">{item.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;