import { useBuild } from "../../context/BuildContext";

const VisualizationCanvas = () => {
  const { selectedVehicle, activeAccessories, selectedView, setSelectedView } = useBuild();

  if (!selectedVehicle) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 p-8 shadow-inner relative overflow-hidden">
        {/* Subtle grid lines background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
        
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Workspace Empty</h3>
          <p className="text-sm text-slate-500">
            Please select a vehicle model from the right panel to begin customization.
          </p>
        </div>
      </div>
    );
  }

  // Get active view image path
  const baseImage = selectedVehicle.views?.[selectedView] || selectedVehicle.image;

  // Filter and sort active accessories that fit the CURRENT view
  const currentOverlays = activeAccessories
    .filter((acc) => acc.view === selectedView)
    .sort((a, b) => a.zIndex - b.zIndex);

  const availableViews = [
    { id: "front", name: "Front View", icon: "🚘" },
    { id: "side", name: "Side View", icon: "🚗" },
    { id: "back", name: "Rear View", icon: "🍑" },
    { id: "top", name: "Top View", icon: "📐" }
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header and View Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">
            Customization Stage
          </span>
          <h2 className="text-lg font-bold text-white">
            {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})
          </h2>
        </div>
        
        {/* View Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          {availableViews.map((view) => {
            const hasOverlaysInThisView = activeAccessories.some((a) => a.view === view.id);
            return (
              <button
                key={view.id}
                onClick={() => setSelectedView(view.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5
                  ${
                    selectedView === view.id
                      ? "bg-amber-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
              >
                <span>{view.icon}</span>
                <span className="hidden md:inline">{view.name}</span>
                {hasOverlaysInThisView && (
                  <span className={`h-1.5 w-1.5 rounded-full ${selectedView === view.id ? 'bg-slate-950' : 'bg-amber-500'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center p-6 min-h-[300px] md:min-h-[450px]">
        {/* Ambient background grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10 pointer-events-none" />
        
        {/* Glow indicator behind vehicle */}
        <div className="absolute w-[80%] h-[50%] rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        {/* Overlay stack wrapper */}
        <div className="relative w-full max-w-4xl aspect-[16/9] flex items-center justify-center">
          
          {/* Base Vehicle Image */}
          <img
            src={baseImage}
            alt={`${selectedVehicle.model} - ${selectedView}`}
            className="absolute max-w-full max-h-full object-contain transition-all duration-500 ease-in-out"
            style={{ zIndex: 0 }}
            onError={(e) => {
              e.target.src =
                `https://placehold.co/800x450/1e293b/94a3b8?text=${encodeURIComponent(selectedVehicle.model + " " + selectedView)}`;
            }}
          />

          {/* Accessory Overlay Images */}
          {currentOverlays.map((accessory) => (
            <img
              key={accessory.id}
              src={accessory.overlay}
              alt={accessory.name}
              className="absolute max-w-full max-h-full object-contain pointer-events-none transition-all duration-300"
              style={{ zIndex: accessory.zIndex }}
              onError={(e) => {
                // If overlay image fails, hide it gracefully.
                e.target.style.display = "none";
              }}
            />
          ))}
        </div>

        {/* View Indicator Badge */}
        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-800 text-[10px] text-slate-400 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
          Camera: {selectedView} view
        </div>

        {/* Empty view status helper */}
        {currentOverlays.length === 0 && activeAccessories.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur border border-slate-800 text-[10px] text-slate-400 px-2.5 py-1 rounded-full">
            💡 Switch views to see other installed accessories
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationCanvas;
