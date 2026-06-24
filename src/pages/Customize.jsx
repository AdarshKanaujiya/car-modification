import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBuild } from "../context/BuildContext";
import { accessories } from "../data/accessories";
import CategoryNav from "../components/Catalog/CategoryNav";
import AccessoryCard from "../components/Catalog/AccessoryCard";
import VisualizationCanvas from "../components/Canvas/VisualizationCanvas";
import BuildSummary from "../components/BuildSummary/BuildSummary";

const Customize = () => {
  const navigate = useNavigate();
  const { selectedVehicle, activeCategory } = useBuild();

  // Redirect if no vehicle selected
  useEffect(() => {
    if (!selectedVehicle) {
      navigate("/");
    }
  }, [selectedVehicle, navigate]);

  if (!selectedVehicle) {
    return null;
  }

  // Filter accessories belonging to the current vehicle and active category
  const filteredAccessories = accessories.filter(
    (acc) =>
      acc.vehicleId === selectedVehicle.id &&
      acc.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col h-screen overflow-hidden">
      {/* Top Navbar */}
      <header className="border-b border-slate-900 bg-slate-950 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Garage
          </button>
          <span className="text-slate-800">|</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Customizing:</span>
            <span className="text-xs font-black text-amber-500 px-2 py-0.5 rounded bg-amber-500/10">
              {selectedVehicle.brand} {selectedVehicle.model}
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Canvas Active</span>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Sidebar - Categories */}
        <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-slate-900 p-4 shrink-0 bg-slate-950/60 backdrop-blur">
          <CategoryNav />
        </aside>

        {/* Center Panel - Canvas and Accessory Selection Grid */}
        <main className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
          {/* Top half: Canvas */}
          <section className="w-full shrink-0">
            <VisualizationCanvas />
          </section>

          {/* Bottom half: Accessory Cards Grid */}
          <section className="flex-1">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span>Select {activeCategory}</span>
                <span className="text-xs font-normal text-slate-500 lowercase">
                  ({filteredAccessories.length} available)
                </span>
              </h3>
            </div>

            {filteredAccessories.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/10 border border-slate-900 rounded-xl">
                <p className="text-sm text-slate-400">No products found</p>
                <p className="text-xs text-slate-600 mt-1">
                  We don't have any items registered for {activeCategory} at this time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
                {filteredAccessories.map((accessory) => (
                  <AccessoryCard key={accessory.id} accessory={accessory} />
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Right Sidebar - Build Summary */}
        <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-900 p-4 shrink-0 bg-slate-950/60 backdrop-blur overflow-y-auto">
          <BuildSummary />
        </aside>
      </div>
    </div>
  );
};

export default Customize;
