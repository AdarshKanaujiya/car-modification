import { vehicles } from "../../data/vehicles";
import { useBuild } from "../../context/BuildContext";

const VehicleSelector = () => {
  const { selectedVehicle, setSelectedVehicle } = useBuild();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
        Select Your Base Model
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => setSelectedVehicle(vehicle)}
            className={`group cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 relative overflow-hidden bg-slate-950/60
              ${
                selectedVehicle?.id === vehicle.id
                  ? "border-amber-500 shadow-amber-500/10 shadow-lg"
                  : "border-slate-800 hover:border-slate-700 hover:bg-slate-900"
              }`}
          >
            {/* Ambient Background Glow */}
            <div className={`absolute -right-16 -bottom-16 w-32 h-32 rounded-full filter blur-2xl opacity-10 transition-all duration-500 group-hover:scale-125
              ${selectedVehicle?.id === vehicle.id ? "bg-amber-500 opacity-20" : "bg-slate-500"}`}
            />

            <div className="relative z-10">
              <div className="w-full h-36 flex items-center justify-center mb-3 bg-slate-900/50 rounded-lg p-2 group-hover:scale-[1.02] transition-transform duration-300">
                <img
                  src={vehicle.image}
                  alt={vehicle.model}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/300x150/1e293b/94a3b8?text=" +
                      encodeURIComponent(vehicle.model);
                  }}
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 px-2 py-0.5 bg-amber-500/10 rounded">
                    {vehicle.brand}
                  </span>
                  <h3 className="font-bold text-white text-lg mt-1 group-hover:text-amber-400 transition-colors">
                    {vehicle.model}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{vehicle.year}</p>
                </div>
                {selectedVehicle?.id === vehicle.id && (
                  <span className="h-5 w-5 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center text-xs font-bold shadow-md shadow-amber-500/20">
                    ✓
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleSelector;
