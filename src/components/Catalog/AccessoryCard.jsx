import { useBuild } from "../../context/BuildContext";

const AccessoryCard = ({ accessory }) => {
  const { addAccessory, removeAccessory, isActive } = useBuild();
  const active = isActive(accessory.id);

  return (
    <div
      onClick={() => (active ? removeAccessory(accessory.id) : addAccessory(accessory))}
      className={`group rounded-xl border-2 p-4 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between h-full bg-slate-950/60
        ${
          active
            ? "border-amber-500 bg-amber-500/[0.02] shadow-lg shadow-amber-500/5"
            : "border-slate-800 hover:border-slate-700 hover:bg-slate-900/40"
        }`}
    >
      <div>
        {/* Overlay preview thumbnail */}
        <div className="w-full h-24 flex items-center justify-center bg-slate-900/60 rounded-lg p-2 mb-3 group-hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden border border-slate-900">
          <img
            src={accessory.overlay}
            alt={accessory.name}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/200x100/1e293b/94a3b8?text=" +
                encodeURIComponent(accessory.name);
            }}
          />
          {/* Angle indicator badge */}
          <span className="absolute bottom-1 right-1 text-[8px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 font-bold uppercase">
            {accessory.view} angle
          </span>
        </div>

        {/* Info */}
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors leading-tight">
            {accessory.name}
          </h4>
          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider whitespace-nowrap bg-slate-800 text-slate-400">
            {accessory.fitType}
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
          {accessory.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
        <span className="text-sm font-black text-amber-500">
          ₹{accessory.price.toLocaleString("en-IN")}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Avoid double click since card has click handler
            active ? removeAccessory(accessory.id) : addAccessory(accessory);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer
            ${
              active
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white"
                : "bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold"
            }`}
        >
          {active ? "Remove" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default AccessoryCard;
