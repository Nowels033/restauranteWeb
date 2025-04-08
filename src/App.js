
import React from "react";
import { Routes, Route } from "react-router";

import Ordenes from "./components/paginas/Ordenes";
import Menu from "./components/paginas/Menu";
import NuevoProducto from "./components/paginas/NuevoProducto";
import Sidebar from "./components/ui/Sidebar";
import EditarProducto from "./components/paginas/EditarProducto";



import firebase, { FirebaseContext } from "./firebase";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            <Route path="/editar-producto/:id" element={<EditarProducto />} />
          </Routes>
        </div>
        {/* Contenedor de toasts global */}
        <ToastContainer 
          position="bottom-right" // Puedes poner top-right, top-center, etc.
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
      </div>
    </FirebaseContext.Provider>
  );
}

export default App;

