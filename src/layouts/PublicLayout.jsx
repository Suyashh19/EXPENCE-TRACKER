const PublicLayout = ({ children }) => {
  return (
    <div
      className="
        relative
        w-full
        min-h-[100dvh]
        overflow-x-hidden
        flex
        flex-col
      "
    >
      {/* GLASS BACKGROUND */}
      <div className="glass-world fixed inset-0 -z-10 pointer-events-none">
        <div className="shine-blob blob-indigo"></div>
        <div className="shine-blob blob-rose"></div>
        <div className="shine-blob blob-sky"></div>
      </div>

      {/* PAGE CONTENT */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;
