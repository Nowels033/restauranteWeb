import React, { useContext, useState } from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const NuevoProducto = () => {
    //state para la imagen emulando onUPLOAD
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [imagenURL, setImagenURL] = useState('');
    const [subidaExitosa, setSubidaExitosa] = useState(null); // null | true | false


    //context con las operaciones de firebase
    const { firebase } = useContext(FirebaseContext);
    console.log(firebase);

    //hook para redireccionar
    const navigate = useNavigate();

    //leer formulario y validar 
    const formik = useFormik({
        initialValues: {
            nombre: '',
            precio: '',
            categoria: '',
            imagen: '',
            descripcion: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .min(3, 'El nombre es inferior a 3 caracteres')
                .required('El nombre del producto es obligatorio'),
            precio: Yup.number()
                .min(1, 'El precio es muy bajo')
                .required('El precio es obligatorio'),
            categoria: Yup.string()
                .required('La categoría es obligatoria'),
            descripcion: Yup.string()
                .required('La descripción es obligatoria')
        }),
        onSubmit: async datos => {
            try {
                let urlImagen = imagenURL;

                //guardar en la base de datos
                await addDoc(collection(firebase.db, 'productos'), {
                    disponible: true,
                    nombre: datos.nombre,
                    precio: Number(datos.precio),
                    categoria: datos.categoria,
                    descripcion: datos.descripcion,
                    imagen: urlImagen
                });

                console.log("Producto agregado con éxito");
                navigate('/menu');
            } catch (error) {
                console.log("Error al guardar en Firebase:", error);
            }
        }
    });

    // función personalizada que maneja la subida de imagen a Firebase Storage
    // función personalizada que maneja la subida de imagen a Firebase Storage
    const handleUploadImage = (e) => {
        const archivo = e.target?.files?.[0];
        if (!archivo || typeof archivo.name !== 'string') {
            console.error("Archivo inválido:", archivo);
            return;
        }

        try {
            const storage = getStorage(); // usamos instancia por defecto sin depender de firebase.app
            const storageRef = ref(storage, `productos/${Date.now()}_${archivo.name}`);

            setSubiendo(true);
            setProgreso(0);
            setSubidaExitosa(null); // reiniciar estado

            const uploadTask = uploadBytesResumable(storageRef, archivo);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progresoSubida = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgreso(Math.floor(progresoSubida));
                },
                (error) => {
                    console.error("Error al subir imagen:", error);
                    setSubiendo(false);
                    setSubidaExitosa(false); // ❌ error
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    setImagenURL(url);
                    formik.setFieldValue("imagen", archivo);
                    setSubiendo(false);
                    setSubidaExitosa(true); // ✅ éxito
                }
            );
        } catch (error) {
            console.error("Error inesperado:", error);
            setSubidaExitosa(false);
        }
    };

    

    return (
        <>
            <h1 className="text-3xl font-light mb-4">Nuevo Producto</h1>

            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl">
                    <form onSubmit={formik.handleSubmit}>
                        {/* Nombre */}
                        <div className="mb-4">
                            <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                placeholder="Nombre Producto"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {formik.touched.nombre && formik.errors.nombre && (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        )}

                        {/* Precio */}
                        <div className="mb-4">
                            <label htmlFor="precio" className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
                            <input
                                id="precio"
                                name="precio"
                                type="number"
                                min="0"
                                placeholder="Precio Producto"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {formik.touched.precio && formik.errors.precio && (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.precio}</p>
                            </div>
                        )}

                        {/* Categoría */}
                        <div className="mb-4">
                            <label htmlFor="categoria" className="block text-gray-700 text-sm font-bold mb-2">Categoría</label>
                            <select
                                id="categoria"
                                name="categoria"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formik.values.categoria}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">-- Selecciona Categoría --</option>
                                <option value="1">Categoría 1</option>
                                <option value="2">Categoría 2</option>
                                <option value="3">Categoría 3</option>
                                <option value="4">Categoría 4</option>
                                <option value="5">Categoría 5</option>
                                <option value="6">Categoría 6</option>
                                <option value="7">Categoría 7</option>
                            </select>
                        </div>

                        {formik.touched.categoria && formik.errors.categoria && (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.categoria}</p>
                            </div>
                        )}

                        {/* Imagen */}
                        <div className="mb-4">
                            <label htmlFor="imagen" className="block text-gray-700 text-sm font-bold mb-2">Imagen</label>
                            <input
                                id="imagen"
                                name="imagen"
                                type="file"
                                accept="image/*"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={handleUploadImage}
                                onBlur={formik.handleBlur}
                            />
                            {subiendo && (
                                <div className="h-6 w-full bg-gray-200 rounded overflow-hidden mb-4 relative border">
                                    {/* Fondo animado con el progreso */}
                                    <div
                                        className="bg-green-500 absolute left-0 top-0 h-full text-white text-xs px-2 flex items-center transition-all duration-300 ease-in-out"
                                        style={{ width: `${progreso}%` }}
                                    >
                                        {/* Solo muestra texto si el ancho es suficiente */}
                                        {progreso > 10 && `Subiendo: ${progreso}%`}
                                    </div>
                                </div>
                            )}

                                            {/* Mensaje de subida */}
                            {subidaExitosa === true && (
                               // <div className="my-2 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
                                <div className="my-2 bg-green-100 text-green-700 p-4 rounded shadow-sm">
                                    ✅ Imagen subida correctamente
                                </div>
                            )}

                            {subidaExitosa === false && (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                                    ❌ Error al subir la imagen. Intentalo de nuevo.
                                </div>
                            )}

                        </div>

                        {/* Descripción */}
                        <div className="mb-4">
                            <label htmlFor="descripcion" className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                placeholder="Descripción del Producto"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {formik.touched.descripcion && formik.errors.descripcion && (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.descripcion}</p>
                            </div>
                        )}

                        {/* Botón */}
                        <input
                            type="submit"
                            className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                            value="Agregar Producto"
                        />
                    </form>
                </div>
            </div>
        </>
    );
};

export default NuevoProducto;
