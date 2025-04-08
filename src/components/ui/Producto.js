import React, { useContext, useState } from "react";
import { FirebaseContext } from "../../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


const Producto = ({ producto, onEliminar }) => {
    const { firebase } = useContext(FirebaseContext);
    const { nombre, imagen, disponible: disponibleInicial, categoria, precio, descripcion, id } = producto;

    const [disponible, setDisponible] = useState(disponibleInicial);

    const actualizarDisponible = async (e) => {
        const nuevoValor = e.target.value === "true";
        setDisponible(nuevoValor);

        try {
            const refProducto = doc(firebase.db, "productos", id);
            await updateDoc(refProducto, { disponible: nuevoValor });
            toast.success(`Estado actualizado: ${nuevoValor ? "Disponible" : "No disponible"}`);
        } catch (error) {
            console.error("Error al actualizar:", error);
            toast.error("Error al actualizar disponibilidad");
        }
    };

    const eliminarProducto = async () => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (!confirmar) return;

        try {
            const refProducto = doc(firebase.db, "productos", id);
            await deleteDoc(refProducto);
            toast.success("Producto eliminado correctamente");

            if (onEliminar) onEliminar();
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            toast.error(" Error al eliminar el producto");
        }
    };

    return (
        <div className="w-full px-3 mb-4">
            <div className="p-5 shadow-md bg-white">
                <div className="lg:flex">
                    {/* Columna Izquierda */}
                    <div className="lg:w-5/12 xl:w-3/12">
                        <p className="font-bold text-2xl text-yellow-600 mb-4">{nombre.toUpperCase()}</p>
                        <img src={imagen} alt={`imagen de ${nombre}`} className="mb-4 rounded" />
                        
                        <div className="block mt-5 sm:w-2/4">
                            <label className="block text-gray-800 mb-2 font-bold">Existencias :</label>
                            <select
                                value={disponible}
                                onChange={actualizarDisponible}
                                className="w-full py-2 px-3 rounded bg-white shadow border focus:outline-none focus:shadow-outline"
                            >
                                <option value="true">Disponible</option>
                                <option value="false">No disponible</option>
                            </select>
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={eliminarProducto}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                                >
                                    Eliminar Producto
                                </button>

                                <Link
                                    to={`/editar-producto/${id}`}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-center w-full"
                                >
                                    Modificar Producto
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha */}
                    <div className="lg:w-7/12 xl:w-9/12 pl-5 pt-5">
                        <p className="font-bold text-2xl text-yellow-600 mb-4">INFORMACIÓN</p>

                        <p className="text-gray-600 mb-2">Categoría:</p>
                        <span className="text-gray-700 font-bold block mb-4">{categoria.toUpperCase()}</span>

                        <p className="text-gray-600 mb-2">Descripción:</p>
                        <p className="text-gray-700 mb-4">{descripcion}</p>

                        <p className="text-gray-600 mb-2">Precio:</p>
                        <span className="text-gray-700 font-bold">{precio}€</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Producto;
