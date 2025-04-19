import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Orden from "../ui/Orden";

const Ordenes = () => {
  const { firebase } = useContext(FirebaseContext);
  const [ordenes, guardarOrdenes] = useState([]);

  useEffect(() => {
    const obtenerOrdenes = () => {
      const refOrdenes = collection(firebase.db, 'pedidos'); 
      const q = query(refOrdenes, where('completado', '==', true));

      onSnapshot(q, manejarSnapshot);
    };

    obtenerOrdenes();
  }, []);

  function manejarSnapshot(snapshot) {
    const ordenes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    guardarOrdenes(ordenes);
  }

  return (
    <>
      <h1 className="text-3xl font-light mb-4">Órdenes Completadas</h1>
      <div className="sm:flex sm:flex-wrap -mx-3">
        {ordenes.map(orden => (
          <Orden key={orden.id} orden={orden} />
        ))}
      </div>
    </>
  );
};

export default Ordenes;
