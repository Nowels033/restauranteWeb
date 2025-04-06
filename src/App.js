
import React from "react";
import { Routes, Route} from "react-router";


import Ordenes from "./components/paginas/Ordenes";
import Menu from "./components/paginas/Menu";
import NuevoProducto from "./components/paginas/NuevoProducto";
import Sidebar from "./components/ui/Sidebar";

import firebase , { FirebaseContext } from "./firebase";

function App() {
  return (
    <FirebaseContext.Provider value={{ firebase }}>
  <div className="md:flex min-h-screen">
    <Sidebar />
    <div className="md:w-3/5 xl:w-4/5 p-6">
      <Routes>
        <Route path="/" element={<Ordenes />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/nuevo-producto" element={<NuevoProducto />} />
      </Routes>
    </div>
  </div>
</FirebaseContext.Provider>
  );
}

export default App;
