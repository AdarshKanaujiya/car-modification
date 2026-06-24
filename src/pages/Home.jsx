import { useNavigate } from "react-router-dom";
import { vehicles } from "../data/vehicles";
import { useBuild } from "../context/BuildContext";

const Home = () => {
  const navigate = useNavigate();
  const { setSelectedVehicle } = useBuild();

  const handleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    navigate("/customize");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-amber-500/10">
            V
          </span>
          <span className="font-extrabold text-white tracking-tight text-md">
            VEHICLE<span className="text-amber-500 font-medium">CUSTOMIZER</span>
          </span>
        </div>
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
          v1.0 Visual Prototype
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-8 relative z-10">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest inline-block mb-4 animate-pulse">
          Beta Sandbox
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-none">
          Build Your Ultimate{" "}
          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            Dream Machine
          </span>
        </h1>
        <p className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto leading-relaxed">
          Configure, overlay, and price specific off-road accessories on your model using our interactive canvas staging environment.
        </p>
      </section>

      {/* Vehicle Choices Grid */}
      <main className="max-w-4xl mx-auto w-full px-6 pb-24 relative z-10">
        <h2 className="text-white text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-900 pb-3">
          <span>Choose Vehicle Model</span>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center max-w-2xl mx-auto">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => handleSelect(vehicle)}
              className="group bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:border-amber-500/50 hover:bg-slate-900/60 shadow-xl hover:shadow-2xl hover:shadow-amber-500/[0.02] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="bg-slate-950/60 p-8 flex items-center justify-center h-52 relative border-b border-slate-900">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-5" />
                
                <img
                  src={vehicle.image}
                  alt={vehicle.model}
                  className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x200/1e293b/94a3b8?text=" +
                      encodeURIComponent(vehicle.model);
                  }}
                />
              </div>

              {/* Vehicle Description */}
              <div className="p-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-amber-500 text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">
                    {vehicle.brand}
                  </span>
                  <span className="text-xs text-slate-500">{vehicle.year}</span>
                </div>
                
                <h3 className="text-white text-xl font-bold group-hover:text-amber-400 transition-colors">
                  {vehicle.model}
                </h3>
                
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Start overlaying bumpers, racks, and side steps on the Tata Punch. Fully interactive sandbox.
                </p>

                <button className="mt-5 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/5 group-hover:shadow-amber-500/10 flex items-center justify-center gap-1">
                  Start Customizing
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Vehicle Customizer Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
