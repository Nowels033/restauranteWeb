import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import Producto from "../ui/Producto";
import { collection, onSnapshot } from "firebase/firestore";

// estilos visuales 
const categoriasVisuales = {
  "Entrantes": { nombre: "Entrantes", color: "text-red-600", icono: "🍽️" },
  "Primeros": { nombre: "Primeros", color: "text-green-600", icono: "🍲" },
  "Segundos": { nombre: "Segundos", color: "text-orange-600", icono: "🍲🍲" },
  "Postres": { nombre: "Postres", color: "text-pink-600", icono: "🍰" },
  "Bebidas": { nombre: "Bebidas", color: "text-blue-600", icono: "🥤" },
  "Snacks": { nombre: "Snacks", color: "text-yellow-600", icono: "🍿" },
  "Ensaladas": { nombre: "Ensaladas", color: "text-lime-600", icono: "🥗" },
  "Especiales": { nombre: "Especiales", color: "text-purple-600", icono: "🌟" },
};

const Menu = () => {
  const [productos, guardarProductos] = useState([]);
  const [orden, setOrden] = useState("nombre");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState("");
  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const productosRef = collection(firebase.db, "productos");

    const unsubscribe = onSnapshot(productosRef, (snapshot) => {
      const productosObtenidos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      guardarProductos(productosObtenidos);
    });

    return () => unsubscribe();
  }, [firebase.db]);

  // Filtro aplicado
  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria = filtroCategoria ? producto.categoria === filtroCategoria : true;
    const coincideDisponibilidad =
      filtroDisponibilidad === "true"
        ? producto.disponible === true
        : filtroDisponibilidad === "false"
        ? producto.disponible === false
        : true;
    return coincideCategoria && coincideDisponibilidad;
  });

  // Orden aplicado
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    if (orden === "precio") return a.precio - b.precio;
    if (orden === "categoria") return a.categoria.localeCompare(b.categoria);
    return a.nombre.localeCompare(b.nombre);
  });

  // Agrupar por categoría
  const productosPorCategoria = productosOrdenados.reduce((grupo, producto) => {
    const categoria = producto.categoria || "Sin categoría";
    if (!grupo[categoria]) grupo[categoria] = [];
    grupo[categoria].push(producto);
    return grupo;
  }, {});

  return (
    <>
      <h1 className="text-3xl font-light mb-4">Menu</h1>

      <Link
        to="/nuevo-producto"
        className="bg-blue-800 hover:bg-blue-700 inline-block mb-5 p-2 uppercase text-white rounded font-bold"
      >
        Nuevo Producto
      </Link>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div>
          <label className="font-bold text-gray-700 mr-2">Ordenar por:</label>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="border p-2 rounded shadow"
          >
            <option value="nombre">Nombre (A-Z)</option>
            <option value="precio">Precio (menor a mayor)</option>
            <option value="categoria">Categoría</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-gray-700 mr-2">Filtrar por categoría:</label>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="border p-2 rounded shadow"
          >
            <option value="">Todas</option>
            <option value="Entrantes">Entrantes</option>
            <option value="Primeros">Primeros</option>
            <option value="Segundos">Segundos</option>
            <option value="Postres">Postres</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Snacks">Snacks</option>
            <option value="Ensaladas">Ensaladas</option>
            <option value="Especiales">Especiales</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-gray-700 mr-2">Disponibilidad:</label>
          <select
            value={filtroDisponibilidad}
            onChange={(e) => setFiltroDisponibilidad(e.target.value)}
            className="border p-2 rounded shadow"
          >
            <option value="">Todos</option>
            <option value="true">Solo disponibles</option>
            <option value="false">No disponibles</option>
          </select>
        </div>
      </div>

      {/* Agrupación visual por categoría */}
      {Object.entries(productosPorCategoria).length === 0 ? (
        <div className="text-center text-gray-600 mt-10">
          <p className="text-lg mb-4">🚫 No hay productos para mostrar con los filtros seleccionados.</p>
          <button
            onClick={() => {
              setFiltroCategoria("");
              setFiltroDisponibilidad("");
              setOrden("nombre");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Reiniciar filtros
          </button>
        </div>
      ) : (
        Object.entries(productosPorCategoria).map(([categoria, productos]) => {
          const info = categoriasVisuales[categoria] || {
            nombre: `Categoría ${categoria}`,
            color: "text-gray-700",
            icono: "📦",
          };

          return (
            <div key={categoria} className="mb-10">
              <h2 className={`text-xl font-extrabold border-b-2 mb-4 uppercase ${info.color}`}>
                {info.icono} {info.nombre} ({productos.length} producto{productos.length !== 1 ? "s" : ""})
              </h2>
              {productos.map((producto) => (
                <Producto key={producto.id} producto={producto} />
              ))}
            </div>
          );
        })
      )}
    </>
  );
};

export default Menu;
