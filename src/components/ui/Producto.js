import React, { useContext, useState } from "react";
import { FirebaseContext } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

const Producto = ({ producto }) => {

    // context de firebsa para cambiar el estado en la BBDD
    const { firebase } = useContext(FirebaseContext);

    //descomponer el objeto de producto
    const { nombre, imagen, disponible: disponibleInicial, categoria, precio, descripcion, id } = producto;

    // acceder al valor del context para editar producto
    const [disponible, setDisponible] = useState(disponibleInicial);

    //modificar el estado del producto en firebase
    const actualizarDisponible = async (e) => {
        const nuevoValor = e.target.value === "true";
        setDisponible(nuevoValor); 
    
        try {
            const refProducto = doc(firebase.db, "productos", id); 
            await updateDoc(refProducto, { disponible: nuevoValor }); 
            console.log("actualizado:", nuevoValor);
        } catch (error) {
            console.error("erro al actualizar en Firebase:", error);
        }
    };

    return (
        <div className="w-full px-3 mb-4">
            <div className="p-5 shadow-md bg-white">
                <div className="lg:flex">
                    <div className="lg:w-5/12 xl:w-3/12">
                        <img src={imagen} alt="imagen producto" />
                        <div className="sm:flex sm:-mx-2 pl-2">
                            <label className="block mt-5 sm:w-2/4">
                                <span className="block text-gray-800 mb-2 font-bold">Existencias :</span>

                                <select
                                    value={disponible}
                                    onChange={actualizarDisponible}
                                    className="p-2 w-full py-2 px-3 rounded bg-white shadow appearance-none border leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="true">Disponible</option>
                                    <option value="false">No disponible</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="lg:w-7/12 xl:w-9/12 pl-5">
                        <p className="font-bold text-2xl text-yellow-600 mb-4">{nombre.toUpperCase()}</p>
                        <p className="text-gray-600 mb-4">Categoría: {''}</p>
                        <span className="text-gray-700 font-bold">{categoria.toUpperCase()}</span>
                        <p className="text-gray-600 mb-4">{descripcion}</p>
                        <p className="text-gray-600 mb-4">Precio:{''}</p>
                        <span className="text-gray-700 font-bold">{precio}€</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Producto;
