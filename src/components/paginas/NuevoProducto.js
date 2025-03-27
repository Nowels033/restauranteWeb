import React from "react";

const NuevoProducto = () => {
    return (
        <>
    <h1 className="text-3xl font-light mb-4">Nuevo Producto</h1>

    <div className="flex justify-center mt-10">

        <div className="w-full max-w-3xl">
            <form>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 html"htmlFor="nombre">Nombre</label>
                    <input id="nombre" type="text" placeholder="Nombre Producto" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 html"htmlFor="Precio">Precio</label>
                    <input id="Precio" type="number" min="0" placeholder="Precio Producto" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 html"htmlFor="Precio">Categoria</label>

                    <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="Categoria"
                    name="Categoria">
                        
                        <option value="">-- Selecciona Categoria --</option>
                        <option value="1">Categoría 1</option>
                        <option value="2">Categoría 2</option>
                        <option value="3">Categoría 3</option>
                        <option value="4">Categoría 4</option>

                    </select>
                </div>

            </form>
        </div>
    </div>
        </>
    );
}

export default NuevoProducto;