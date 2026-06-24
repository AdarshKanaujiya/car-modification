import { useBuild } from "../../context/BuildContext";
import { useState } from "react";

const BuildSummary = () => {
  const { activeAccessories, removeAccessory, resetBuild, totalPrice, selectedVehicle } =
    useBuild();
  const [saveStatus, setSaveStatus] = useState("");

  const handleSave = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 3000);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-white text-lg mb-4 flex items-center justify-between">
          <span>Build Summary</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
            {activeAccessories.length} items
          </span>
        </h3>

        {/* Selected Vehicle Info */}
        {selectedVehicle ? (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 mb-4 flex items-center gap-3">
            <div className="w-12 h-8 bg-slate-900 rounded p-1 flex items-center justify-center">
              <img
                src={selectedVehicle.image}
                alt={selectedVehicle.model}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Selected Vehicle</p>
              <h4 className="text-xs font-bold text-white leading-tight">
                {selectedVehicle.brand} {selectedVehicle.model}
              </h4>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 bg-slate-950/20 border border-dashed border-slate-800 rounded-xl mb-4 text-xs text-slate-500">
            No vehicle model selected
          </div>
        )}

        {/* Applied Accessories List */}
        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
          {activeAccessories.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">
              No modifications added to the build yet.
            </p>
          ) : (
            activeAccessories.map((accessory) => (
              <div
                key={accessory.id}
                className="flex items-center justify-between bg-slate-950/40 border border-slate-900 hover:border-slate-800 rounded-lg p-2.5 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    {accessory.name}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Category: {accessory.category} ({accessory.view} angle)
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-2">
                  <span className="text-xs font-black text-amber-500 whitespace-nowrap">
                    ₹{accessory.price.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => removeAccessory(accessory.id)}
                    className="text-slate-500 hover:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
                    title="Remove accessory"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pricing and Action Buttons */}
      <div className="border-t border-slate-800 mt-6 pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Estimated Total
          </span>
          <span className="text-lg font-black text-amber-500">
            ₹{totalPrice.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={resetBuild}
            disabled={activeAccessories.length === 0}
            className="w-full py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-semibold hover:text-white hover:border-slate-700 transition-all disabled:opacity-40 disabled:hover:border-slate-800 disabled:hover:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
          >
            Reset Build
          </button>

          <button
            onClick={handleSave}
            disabled={activeAccessories.length === 0 || saveStatus === "saving"}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5
              ${
                saveStatus === "saved"
                  ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  : "bg-amber-500 text-slate-950 hover:bg-amber-400"
              }`}
          >
            {saveStatus === "saving" ? (
              <>
                <span className="h-3 w-3 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : saveStatus === "saved" ? (
              "Saved Successfully!"
            ) : (
              "Save Build"
            )}
          </button>
        </div>

        {/* Save confirmation toast mock feedback */}
        {saveStatus === "saved" && (
          <p className="text-[10px] text-center text-emerald-400 animate-pulse mt-1">
            ✓ Customized build settings saved to profile!
          </p>
        )}
      </div>
    </div>
  );
};

export default BuildSummary;
