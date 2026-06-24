import { createContext, useContext, useState, useEffect } from "react";

const BuildContext = createContext();

export const BuildProvider = ({ children }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeAccessories, setActiveAccessories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Front Bumper");
  const [selectedView, setSelectedView] = useState("side");

  // Reset build when vehicle changes
  useEffect(() => {
    setActiveAccessories([]);
    setSelectedView("side");
  }, [selectedVehicle]);

  const addAccessory = (accessory) => {
    // Rule: Only one accessory per category is active at a time
    const filtered = activeAccessories.filter(
      (a) => a.category !== accessory.category
    );

    setActiveAccessories([...filtered, accessory]);

    // Automatically switch canvas view to match the accessory's overlay view
    if (accessory.view) {
      setSelectedView(accessory.view);
    }
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
        selectedView,
        setSelectedView,
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
