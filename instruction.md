Good — you've done enough research, now let's build. Here's the full plan and thought process before touching any code.

---

# Plan and Thought Process

## What We're Building Today

The goal for today is one thing only: a working visual prototype where a user can select a vehicle, click accessories, and see them appear on the car image as overlays. No backend, no database, no login today. Pure React frontend with hardcoded data so you can demo something real by end of day.

Once this visual core works, plugging in the FastAPI backend and PostgreSQL later becomes straightforward because the frontend logic is already proven.

## Why Frontend First

The biggest risk in this project is the visualization. If the image layering doesn't work cleanly, the whole POC falls apart. So we validate that risk today with a working prototype. Everything else — auth, build saving, backend — is standard CRUD that any intern can build. The overlay system is the hard part.

## Today's Target

By end of day you should have:
- A React app running locally
- A hardcoded vehicle list (Toyota HiLux, Ford Ranger)
- A hardcoded accessory catalog with categories
- Clicking an accessory adds its overlay image onto the vehicle
- Clicking again removes it
- A build summary panel showing what's been added
- A reset button

That's a demoable POC even without a backend.

---

# Project Structure

```
vehicle-customizer/
├── public/
│   └── assets/
│       ├── vehicles/
│       │   ├── hilux.png
│       │   └── ranger.png
│       └── overlays/
│           ├── hilux_bullbar.png
│           ├── hilux_roofrack.png
│           ├── hilux_sidesteps.png
│           ├── ranger_bullbar.png
│           └── ranger_roofrack.png
├── src/
│   ├── data/
│   │   ├── vehicles.js
│   │   └── accessories.js
│   ├── context/
│   │   └── BuildContext.jsx
│   ├── components/
│   │   ├── VehicleSelector/
│   │   │   └── VehicleSelector.jsx
│   │   ├── Canvas/
│   │   │   └── VisualizationCanvas.jsx
│   │   ├── Catalog/
│   │   │   ├── CategoryNav.jsx
│   │   │   └── AccessoryCard.jsx
│   │   └── BuildSummary/
│   │       └── BuildSummary.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Customize.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── index.html
```

---

# Step 1 — Create the React App

Run this in your terminal:

```
npm create vite@latest vehicle-customizer -- --template react
cd vehicle-customizer
npm install
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

In tailwind.config.js replace content with:

```js
content: ["./index.html", "./src/**/*.{js,jsx}"],
```

In src/index.css replace everything with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

# Step 2 — Hardcoded Data Files

## src/data/vehicles.js

```js
export const vehicles = [
  {
    id: "hilux",
    brand: "Toyota",
    model: "HiLux Revo",
    year: "2016-2020",
    image: "/assets/vehicles/hilux.png"
  },
  {
    id: "ranger",
    brand: "Ford",
    model: "Ranger PX3",
    year: "2018-2022",
    image: "/assets/vehicles/ranger.png"
  }
];
```

## src/data/accessories.js

```js
export const accessories = [
  {
    id: "hilux_bullbar",
    name: "Ironman Deluxe Bull Bar",
    category: "Bull Bars",
    price: 1200,
    vehicleId: "hilux",
    overlay: "/assets/overlays/hilux_bullbar.png",
    zIndex: 1,
    fitType: "specific"
  },
  {
    id: "hilux_roofrack",
    name: "Rhino-Rack Pioneer Roof Rack",
    category: "Roof Racks",
    price: 850,
    vehicleId: "hilux",
    overlay: "/assets/overlays/hilux_roofrack.png",
    zIndex: 3,
    fitType: "specific"
  },
  {
    id: "hilux_sidesteps",
    name: "Ironman Side Steps",
    category: "Side Steps",
    price: 650,
    vehicleId: "hilux",
    overlay: "/assets/overlays/hilux_sidesteps.png",
    zIndex: 2,
    fitType: "specific"
  },
  {
    id: "hilux_snorkel",
    name: "Safari Snorkel",
    category: "Snorkels",
    price: 450,
    vehicleId: "hilux",
    overlay: "/assets/overlays/hilux_snorkel.png",
    zIndex: 4,
    fitType: "specific"
  },
  {
    id: "universal_maxtrax",
    name: "MaxTrax Recovery Boards",
    category: "Recovery Equipment",
    price: 300,
    vehicleId: "all",
    overlay: "/assets/overlays/maxtrax.png",
    zIndex: 5,
    fitType: "universal"
  },
  {
    id: "ranger_bullbar",
    name: "ARB Sahara Bull Bar",
    category: "Bull Bars",
    price: 1350,
    vehicleId: "ranger",
    overlay: "/assets/overlays/ranger_bullbar.png",
    zIndex: 1,
    fitType: "specific"
  },
  {
    id: "ranger_roofrack",
    name: "Ironman Slimline Roof Rack",
    category: "Roof Racks",
    price: 780,
    vehicleId: "ranger",
    overlay: "/assets/overlays/ranger_roofrack.png",
    zIndex: 3,
    fitType: "specific"
  }
];

export const categories = [
  "Bull Bars",
  "Roof Racks",
  "Side Steps",
  "Suspension Kits",
  "Snorkels",
  "Lighting",
  "Wheels & Tyres",
  "Recovery Equipment"
];
```

---

# Step 3 — Build Context (Global State)

## src/context/BuildContext.jsx

```jsx
import { createContext, useContext, useState } from "react";

const BuildContext = createContext();

export const BuildProvider = ({ children }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeAccessories, setActiveAccessories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Bull Bars");

  const addAccessory = (accessory) => {
    // One accessory per category rule
    const filtered = activeAccessories.filter(
      (a) => a.category !== accessory.category
    );

    // Check conflict - side steps vs rock sliders example
    const conflicts = {
      hilux_sidesteps: ["hilux_rocksliders"],
      hilux_rocksliders: ["hilux_sidesteps"]
    };

    const conflictList = conflicts[accessory.id] || [];
    const hasConflict = activeAccessories.some((a) =>
      conflictList.includes(a.id)
    );

    if (hasConflict) {
      alert(
        `Cannot add ${accessory.name} — it conflicts with an accessory already in your build.`
      );
      return;
    }

    setActiveAccessories([...filtered, accessory]);
  };

  const removeAccessory = (accessoryId) => {
    setActiveAccessories(activeAccessories.filter((a) => a.id !== accessoryId));
  };

  const resetBuild = () => {
    setActiveAccessories([]);
  };

  const isActive = (accessoryId) => {
    return activeAccessories.some((a) => a.id === accessoryId);
  };

  const totalPrice = activeAccessories.reduce((sum, a) => sum + a.price, 0);

  return (
    <BuildContext.Provider
      value={{
        selectedVehicle,
        setSelectedVehicle,
        activeAccessories,
        activeCategory,
        setActiveCategory,
        addAccessory,
        removeAccessory,
        resetBuild,
        isActive,
        totalPrice
      }}
    >
      {children}
    </BuildContext.Provider>
  );
};

export const useBuild = () => useContext(BuildContext);
```

---

# Step 4 — Components

## src/components/VehicleSelector/VehicleSelector.jsx

```jsx
import { vehicles } from "../../data/vehicles";
import { useBuild } from "../../context/BuildContext";

const VehicleSelector = () => {
  const { selectedVehicle, setSelectedVehicle, resetBuild } = useBuild();

  const handleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    resetBuild();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Select Your Vehicle
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => handleSelect(vehicle)}
            className={`cursor-pointer rounded-xl border-2 p-4 transition-all
              ${
                selectedVehicle?.id === vehicle.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300"
              }`}
          >
            <img
              src={vehicle.image}
              alt={vehicle.model}
              className="w-full h-32 object-contain mb-2"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/300x150/e5e7eb/6b7280?text=" +
                  vehicle.model;
              }}
            />
            <p className="font-semibold text-gray-800">{vehicle.brand}</p>
            <p className="text-sm text-gray-600">{vehicle.model}</p>
            <p className="text-xs text-gray-400">{vehicle.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleSelector;
```

## src/components/Canvas/VisualizationCanvas.jsx

```jsx
import { useBuild } from "../../context/BuildContext";

const VisualizationCanvas = () => {
  const { selectedVehicle, activeAccessories } = useBuild();

  if (!selectedVehicle) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-100 rounded-xl text-gray-400">
        Select a vehicle to start customizing
      </div>
    );
  }

  const sortedOverlays = [...activeAccessories].sort(
    (a, b) => a.zIndex - b.zIndex
  );

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {selectedVehicle.brand} {selectedVehicle.model}
      </h3>

      {/* Canvas Container - all images stack here */}
      <div
        className="relative w-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200"
        style={{ paddingBottom: "50%" }}
      >
        {/* Base Vehicle Image */}
        <img
          src={selectedVehicle.image}
          alt={selectedVehicle.model}
          className="absolute inset-0 w-full h-full object-contain"
          style={{ zIndex: 0 }}
          onError={(e) => {
            e.target.src =
              "https://placehold.co/800x400/e5e7eb/6b7280?text=" +
              selectedVehicle.model;
          }}
        />

        {/* Accessory Overlay Images */}
        {sortedOverlays.map((accessory) => (
          <img
            key={accessory.id}
            src={accessory.overlay}
            alt={accessory.name}
            className="absolute inset-0 w-full h-full object-contain"
            style={{ zIndex: accessory.zIndex }}
            onError={(e) => {
              // If overlay image missing, show colored placeholder
              e.target.style.display = "none";
            }}
          />
        ))}
      </div>

      {/* Active accessories count */}
      <p className="text-sm text-gray-500 mt-2">
        {activeAccessories.length === 0
          ? "No modifications added yet"
          : `${activeAccessories.length} modification${
              activeAccessories.length > 1 ? "s" : ""
            } applied`}
      </p>
    </div>
  );
};

export default VisualizationCanvas;
```

## src/components/Catalog/CategoryNav.jsx

```jsx
import { categories } from "../../data/accessories";
import { useBuild } from "../../context/BuildContext";

const CategoryNav = () => {
  const { activeCategory, setActiveCategory } = useBuild();

  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
        Categories
      </h3>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`text-left px-3 py-2 rounded-lg text-sm transition-all
            ${
              activeCategory === cat
                ? "bg-orange-500 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryNav;
```

## src/components/Catalog/AccessoryCard.jsx

```jsx
import { useBuild } from "../../context/BuildContext";

const AccessoryCard = ({ accessory }) => {
  const { addAccessory, removeAccessory, isActive } = useBuild();
  const active = isActive(accessory.id);

  return (
    <div
      className={`rounded-xl border-2 p-3 transition-all cursor-pointer
        ${active ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`}
    >
      <img
        src={accessory.overlay}
        alt={accessory.name}
        className="w-full h-24 object-contain mb-2 bg-gray-100 rounded"
        onError={(e) => {
          e.target.src =
            "https://placehold.co/200x100/e5e7eb/6b7280?text=" +
            encodeURIComponent(accessory.name);
        }}
      />
      <p className="text-sm font-semibold text-gray-800 leading-tight">
        {accessory.name}
      </p>
      <p className="text-xs text-gray-500 mb-2">{accessory.fitType}</p>
      <p className="text-sm font-bold text-orange-600 mb-2">
        ₹{accessory.price.toLocaleString()}
      </p>

      <button
        onClick={() => (active ? removeAccessory(accessory.id) : addAccessory(accessory))}
        className={`w-full py-1.5 rounded-lg text-sm font-semibold transition-all
          ${
            active
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
      >
        {active ? "Remove" : "Add to Build"}
      </button>
    </div>
  );
};

export default AccessoryCard;
```

## src/components/BuildSummary/BuildSummary.jsx

```jsx
import { useBuild } from "../../context/BuildContext";

const BuildSummary = () => {
  const { activeAccessories, removeAccessory, resetBuild, totalPrice, selectedVehicle } =
    useBuild();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 h-full flex flex-col">
      <h3 className="font-bold text-gray-800 text-lg mb-3">Build Summary</h3>

      {selectedVehicle && (
        <div className="bg-orange-50 rounded-lg p-2 mb-3">
          <p className="text-xs text-gray-500">Vehicle</p>
          <p className="text-sm font-semibold text-gray-800">
            {selectedVehicle.brand} {selectedVehicle.model}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {activeAccessories.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-8">
            No accessories added yet
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {activeAccessories.map((accessory) => (
              <div
                key={accessory.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg p-2"
              >
                <div>
                  <p className="text-xs font-semibold text-gray-700">
                    {accessory.name}
                  </p>
                  <p className="text-xs text-orange-600">
                    ₹{accessory.price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => removeAccessory(accessory.id)}
                  className="text-red-400 hover:text-red-600 text-xs font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t mt-3 pt-3">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-700">
            Estimated Total
          </span>
          <span className="text-lg font-bold text-orange-600">
            ₹{totalPrice.toLocaleString()}
          </span>
        </div>

        <button
          onClick={resetBuild}
          className="w-full py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 mb-2"
        >
          Reset Build
        </button>

        <button
          disabled={activeAccessories.length === 0}
          className="w-full py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save Build
        </button>
      </div>
    </div>
  );
};

export default BuildSummary;
```

---

# Step 5 — Pages

## src/pages/Home.jsx

```jsx
import { useNavigate } from "react-router-dom";
import { vehicles } from "../data/vehicles";
import { useBuild } from "../context/BuildContext";

const Home = () => {
  const navigate = useNavigate();
  const { setSelectedVehicle, resetBuild } = useBuild();

  const handleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    resetBuild();
    navigate("/customize");
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="bg-gray-900 text-white py-16 px-8 text-center">
        <h1 className="text-4xl font-bold mb-3">
          Build Your Perfect{" "}
          <span className="text-orange-500">4x4</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Select your vehicle and start customizing with real accessories
        </p>
      </div>

      {/* Vehicle Selection */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-white text-2xl font-bold mb-6">
          Choose Your Vehicle
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => handleSelect(vehicle)}
              className="bg-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all"
            >
              <div className="bg-gray-700 p-6">
                <img
                  src={vehicle.image}
                  alt={vehicle.model}
                  className="w-full h-48 object-contain"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x200/374151/9ca3af?text=" +
                      vehicle.model;
                  }}
                />
              </div>
              <div className="p-4">
                <p className="text-orange-400 text-sm font-semibold">
                  {vehicle.brand}
                </p>
                <h3 className="text-white text-xl font-bold">{vehicle.model}</h3>
                <p className="text-gray-400 text-sm">{vehicle.year}</p>
                <button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-all">
                  Start Customizing →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
```

## src/pages/Customize.jsx

```jsx
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

  if (!selectedVehicle) {
    navigate("/");
    return null;
  }

  // Filter accessories by selected vehicle and active category
  const filteredAccessories = accessories.filter(
    (acc) =>
      (acc.vehicleId === selectedVehicle.id || acc.vehicleId === "all") &&
      acc.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-gray-400 hover:text-white text-sm"
        >
          ← Back
        </button>
        <span className="text-gray-400">|</span>
        <span className="text-sm">
          {selectedVehicle.brand} {selectedVehicle.model} — Customizer
        </span>
      </div>

      <div className="flex h-screen">
        {/* Left Sidebar — Categories */}
        <div className="w-48 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <CategoryNav />
        </div>

        {/* Center — Canvas + Accessories */}
        <div className="flex-1 p-6 overflow-y-auto">
          <VisualizationCanvas />

          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {activeCategory}
            </h3>

            {filteredAccessories.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg">No accessories available</p>
                <p className="text-sm mt-1">
                  No {activeCategory.toLowerCase()} found for{" "}
                  {selectedVehicle.model}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredAccessories.map((accessory) => (
                  <AccessoryCard key={accessory.id} accessory={accessory} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar — Build Summary */}
        <div className="w-64 border-l border-gray-200 p-4 bg-white overflow-y-auto">
          <BuildSummary />
        </div>
      </div>
    </div>
  );
};

export default Customize;
```

---

# Step 6 — App.jsx and main.jsx

## src/App.jsx

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BuildProvider } from "./context/BuildContext";
import Home from "./pages/Home";
import Customize from "./pages/Customize";

function App() {
  return (
    <BuildProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customize" element={<Customize />} />
        </Routes>
      </BrowserRouter>
    </BuildProvider>
  );
}

export default App;
```

## src/main.jsx

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

# Step 7 — Images Setup (Most Important Part)

Since you don't have real overlay PNGs yet, here is exactly what to do right now:

**For base vehicle images:**
Go to Google Images, search "Toyota HiLux side view white background PNG" and "Ford Ranger side view white background PNG". Download and save as:
- public/assets/vehicles/hilux.png
- public/assets/vehicles/ranger.png

**For overlay images (the hard part):**
For today's demo, don't worry about real overlays. The code already has an onError fallback that hides missing overlays gracefully. The canvas will show the vehicle and clicking accessories will update the build summary — the visual overlay will work once you add real PNGs later.

When you do have overlays, rules for creating them:
- Open the vehicle base image in any image editor (even Canva works)
- Note the canvas size, say 800x400
- Place the accessory in its real position on the car
- Delete the car, keep only the accessory
- Export as PNG with transparent background
- Save at exact same dimensions as the base image

---

# Step 8 — Run It

```
npm run dev
```

Open http://localhost:5173

---

# What You'll Have by End of Today

- Home page with vehicle cards
- Click a vehicle → goes to customization screen
- Left sidebar shows all 8 categories
- Center shows vehicle image
- Bottom shows accessories for that category filtered by vehicle
- Click Add to Build → accessory appears in right panel
- Price totals up
- Reset clears everything
- If overlay PNG exists it shows on canvas, if not the card still works

---

# What to Tell Your Manager Today

> Started Phase 3 frontend implementation. Built the core React structure with vehicle selection, accessory catalog with category filtering, compatibility-based filtering by vehicle, and build summary panel. Visualization canvas with overlay system is in place — currently using placeholder images, real overlay PNGs will be added in Phase 4. Full component architecture is set up and ready for backend integration next week.

That is a genuine day's work and a demoable result.