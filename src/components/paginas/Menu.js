import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import Producto from "../ui/Producto";

import { collection, onSnapshot } from "firebase/firestore"; // <-- importar desde Firestore

const Menu = () => {

    //state para productos
    const [productos, guardarProductos] = useState([]);

    const { firebase } = useContext(FirebaseContext);

    //consultar base de datos
    useEffect(() => {
        const obtenerProductos = () => {
            const productosRef = collection(firebase.db, 'productos'); // obtener referencia
            onSnapshot(productosRef, manejarSnapshot); // escucha en tiempo real
        };
        obtenerProductos();
    }, []);

    //obtener productos en tiempo real de firebase
    const manejarSnapshot = snapshot => {
        const productos = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            };
        });

        //guardar en state los productos
        guardarProductos(productos);
    };

    return (
        <>
            <h1 className="text-3xl font-light mb-4">Menu</h1>
            <Link to="/nuevo-producto" className="bg-blue-800 hover:bg-blue-700 inline-block mb-5 p-2 uppercase text-white rounded font-bold">
                Nuevo Producto
            </Link>

            {productos.map(producto => (
                <Producto
                    key={producto.id}
                    producto={producto}>
                </Producto>
            ))}
        </>
    );
};

export default Menu;