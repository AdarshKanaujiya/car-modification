import { categories } from "../../data/accessories";
import { useBuild } from "../../context/BuildContext";

const CategoryNav = () => {
  const { activeCategory, setActiveCategory } = useBuild();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1">
        Catalog Categories
      </h3>
      <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-left px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border flex items-center justify-between gap-2
                ${
                  isActive
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold shadow-sm shadow-amber-500/5"
                    : "text-slate-400 hover:text-white border-transparent hover:bg-slate-800/50"
                }`}
            >
              <span>{cat}</span>
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNav;
