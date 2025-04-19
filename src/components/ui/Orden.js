import React, { useContext, useState } from "react";
import { FirebaseContext } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore"; // firebase v9

const Orden = ({ orden }) => {
  const { firebase } = useContext(FirebaseContext);
  const [tiempoEntrega, guardarTiempoEntrega] = useState(0);

  const definirTiempo = async (id) => {
    const pedidoRef = doc(firebase.db, 'pedidos', id);
    try {
      await updateDoc(pedidoRef, { tiempoEntrega });
      console.log("Tiempo de entrega actualizado");
    } catch (error) {
      console.error("Error al actualizar tiempo de entrega:", error);
    }
  };
  const completarOrden = async (id) => {
    const pedidoRef = doc(firebase.db, 'pedidos', id);
    try {
      await updateDoc(pedidoRef, { completado: true });
      console.log("Tiempo de entrega actualizado");
    } catch (error) {
      console.error("Error al actualizar tiempo de entrega:", error);
    }
  }

  return (
    <div className="sm:w-1/2 lg:w-1/3 mb-4">
      <div className="p-3 shadow-md bg-white">
        <h1 className="text-yellow-600 text-lg">
          {orden.id} - {orden.nombre}
        </h1>

        {orden.orden.map((producto) => (
          <p key={producto.id}>
            {producto.cantidad} x {producto.nombre}
          </p>
        ))}

        <p className="font-bold mt-2">Total a pagar: {orden.total} €</p>

        {orden.tiempoEntrega === 0 && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tiempo de entrega
            </label>
            <input
              type="number"
              min={1}
              placeholder="20"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={tiempoEntrega}
              onChange={(e) => guardarTiempoEntrega(parseInt(e.target.value))}
            />
            <button
              onClick={() => definirTiempo(orden.id)}
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
            >
              Definir tiempo
            </button>
          </div>
        )}
        { orden.tiempoEntrega > 0 && (
          <p className="text-gray-700">
           <span className="font-bold">Tiempo de entrega: </span> 
            {orden.tiempoEntrega} minutos
          </p>
        )}
        {!orden.completado && orden.tiempoEntrega > 0 && (
          <button
            onClick={() => {
             completarOrden(orden.id);
            }}
            type="submit"
            className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
          >
            Marcar como completado
          </button>
        )}
      </div>
    </div>
  );
};

export default Orden;

           