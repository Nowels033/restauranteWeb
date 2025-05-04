import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const NuevoProducto = () => {
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [imagenURL, setImagenURL] = useState('');
    const [subidaExitosa, setSubidaExitosa] = useState(null);

    const { firebase } = useContext(FirebaseContext);
    const navigate = useNavigate();

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
                .typeError('El precio debe ser un número')
                .positive('El precio debe ser positivo')
                .required('El precio es obligatorio'),
            categoria: Yup.string()
                .required('La categoría es obligatoria'),
            descripcion: Yup.string()
                .required('La descripción es obligatoria')
        }),
        onSubmit: async datos => {
            if (subiendo) {
                toast.warning("Espera a que termine de subir la imagen");
                return;
            }

            if (!imagenURL) {
                toast.error("Debes subir una imagen antes de guardar");
                return;
            }

            try {
                await addDoc(collection(firebase.db, 'productos'), {
                    disponible: true,
                    nombre: datos.nombre,
                    precio: parseFloat(datos.precio),  // ✅ guarda como decimal
                    categoria: datos.categoria,
                    descripcion: datos.descripcion,
                    imagen: imagenURL
                });

                toast.success("Producto creado correctamente");
                navigate('/menu');
            } catch (error) {
                console.error("Error al guardar en Firebase:", error);
                toast.error("Error al crear el producto");
            }
        }
    });

    const handleUploadImage = (e) => {
        const archivo = e.target?.files?.[0];
        if (!archivo || typeof archivo.name !== 'string') {
            console.error("Archivo inválido:", archivo);
            return;
        }

        try {
            const storage = getStorage();
            const storageRef = ref(storage, `productos/${Date.now()}_${archivo.name}`);

            setSubiendo(true);
            setProgreso(0);
            setSubidaExitosa(null);

            const uploadTask = uploadBytesResumable(storageRef, archivo);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progresoSubida = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgreso(Math.floor(progresoSubida));
                },
                (error) => {
                    console.error("Error al subir imagen:", error);
                    setSubiendo(false);
                    setSubidaExitosa(false);
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    setImagenURL(url);
                    formik.setFieldValue("imagen", archivo);
                    setSubiendo(false);
                    setSubidaExitosa(true);
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

                        {/* Precio (decimal) */}
                        <div className="mb-4">
                            <label htmlFor="precio" className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
                            <input
                                id="precio"
                                name="precio"
                                type="number"
                                min="0"
                                step="0.01"  // ✅ permite decimales
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
                                    <div
                                        className="bg-green-500 absolute left-0 top-0 h-full text-white text-xs px-2 flex items-center transition-all duration-300 ease-in-out"
                                        style={{ width: `${progreso}%` }}
                                    >
                                        {progreso > 10 && `Subiendo: ${progreso}%`}
                                    </div>
                                </div>
                            )}
                            {subidaExitosa === true && (
                                <div className="my-2 bg-green-100 text-green-700 p-4 rounded shadow-sm">
                                    Imagen subida correctamente
                                </div>
                            )}
                            {subidaExitosa === false && (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                                    Error al subir la imagen. Intentalo de nuevo.
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
