import React , {useContext} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase"; 
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


import { getStorage, ref, uploadBytes, getDownloadURL,uploadBytesResumable } from "firebase/storage";




const NuevoProducto = () => {

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
            //imagen: Yup.string()
             //   .required('La imagen es obligatoria'),
            descripcion: Yup.string()
                .required('La descripción es obligatoria')
        }),
        onSubmit: async datos => {
            //console.log(datos);
            
            try {
                let urlImagen = '';

                if (datos.imagen) {
                const storage = getStorage(firebase.app); // obtenemos instancia
                const storageRef = ref(storage, `productos/${Date.now()}_${datos.imagen.name}`); // nombre único

                // subimos archivo
                await uploadBytes(storageRef, datos.imagen);

                // obtenemos URL
                urlImagen = await getDownloadURL(storageRef);
                }
                //guardar en la base de datos
                await addDoc(collection(firebase.db, 'productos'), {
                    disponible: true,
                    nombre: datos.nombre,
                    precio: Number(datos.precio),
                    categoria: datos.categoria,
                    descripcion: datos.descripcion,
                    imagen: datos.imagen ? datos.imagen.name : '' // puedes gestionar el upload luego
                });
        
                console.log("Producto agregado con éxito");
                navigate('/menu');
            } catch (error) {
                console.log("Error al guardar en Firebase:", error);
            }
        }
    });        

    return (
        <>
            <h1 className="text-3xl font-light mb-4">Nuevo Producto</h1>

            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl">
                    <form onSubmit={formik.handleSubmit}>
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

                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null}

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

                        {formik.touched.precio && formik.errors.precio ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.precio}</p>
                            </div>
                        ) : null}

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

                        {formik.touched.categoria && formik.errors.categoria ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.categoria}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label htmlFor="imagen" className="block text-gray-700 text-sm font-bold mb-2">Imagen</label>
                            <input
                                id="imagen"
                                name="imagen"
                                type="file"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) =>
                                    formik.setFieldValue("imagen", e.currentTarget.files[0])
                                }
                                onBlur={formik.handleBlur}
                                accept="image/*"
                            />
                        </div>

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

                        {formik.touched.descripcion && formik.errors.descripcion ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.descripcion}</p>
                            </div>
                        ) : null}

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
