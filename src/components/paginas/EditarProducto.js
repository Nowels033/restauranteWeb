import React, { useContext, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { FirebaseContext } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";


const EditarProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { firebase } = useContext(FirebaseContext);

    const [imagenURL, setImagenURL] = useState('');
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
   // const [subidaExitosa, setSubidaExitosa] = useState(null);
   // const { nombre, precio, categoria, descripcion, imagen } =producto;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            nombre: '',
            precio: '',
            categoria: '',
            descripcion: '',
            imagen: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().min(3).required('El nombre es obligatorio'),
            precio: Yup.number().min(1).required('El precio es obligatorio'),
            categoria: Yup.string().required('La categoría es obligatoria'),
            descripcion: Yup.string().required('La descripción es obligatoria')
        }),
        onSubmit: async producto => {
            if (subiendo) {
                toast.warning(" Espera a que termine de subir la imagen");
                return;
            }

            if (!imagenURL && !producto.imagen) {
                toast.error(" Debes subir una imagen del producto");
                return;
            }

            try {
                const ref = doc(firebase.db, "productos", id);

                await updateDoc(ref, {
                    nombre: producto.nombre,
                    precio: Number(producto.precio),
                    categoria: producto.categoria,
                    descripcion: producto.descripcion,
                    imagen: imagenURL || producto.imagen
                });

                toast.success(" Producto actualizado correctamente");
                navigate('/menu');
            } catch (error) {
                console.error("Error al actualizar:", error);
                toast.error(" Error al actualizar el producto");
            }
        }
    });
// eslint-disable-next-line
    useEffect(() => {
        const cargarProducto = async () => {
            try {
                const ref = doc(firebase.db, "productos", id);
                const producto = await getDoc(ref);
    
                if (producto.exists()) {
                    const data = producto.data();
                    formik.setValues({
                        nombre: data.nombre,
                        precio: data.precio,
                        categoria: data.categoria,
                        descripcion: data.descripcion,
                        imagen: data.imagen
                    });
                    setImagenURL(data.imagen);
                }
            } catch (error) {
                console.error("Error al cargar producto:", error);
                toast.error(" Error al cargar el producto");
            }
        };
    
        cargarProducto();
    }, [firebase.db, id]);
    

    const handleUploadImage = (e) => {
        const archivo = e.target?.files?.[0];
        if (!archivo) return;

        const storage = getStorage();
        const storageRef = ref(storage, `productos/${Date.now()}_${archivo.name}`);

        setSubiendo(true);
        setProgreso(0);
      //  setSubidaExitosa(null);

        const uploadTask = uploadBytesResumable(storageRef, archivo);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progresoSubida = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgreso(Math.floor(progresoSubida));
            },
            (error) => {
                console.error("Error al subir imagen:", error);
                setSubiendo(false);
               // setSubidaExitosa(false);
                toast.error(" Error al subir la imagen");
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                setImagenURL(url);
                formik.setFieldValue("imagen", url);
                setSubiendo(false);
               // setSubidaExitosa(true);
                toast.success("Imagen subida correctamente");
            }
        );
    };

    return (
        <>
            <h1 className="text-3xl font-light mb-4">Editar Producto</h1>

            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl">
                    <form onSubmit={formik.handleSubmit}>
                        
                        {/* nombre */}
                        <div className="mb-4">
                            <label htmlFor="nombre" className="block text-gray-700 font-bold mb-2">Nombre</label>
                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                placeholder="Nombre Producto"
                                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                            />
                        </div>

                        {/* precio */}
                        <div className="mb-4">
                            <label htmlFor="precio" className="block text-gray-700 font-bold mb-2">Precio</label>
                            <input
                                id="precio"
                                name="precio"
                                type="number"
                                placeholder="Precio Producto"
                                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                            />
                        </div>

                        {/* categoria */}
                        <div className="mb-4">
                            <label htmlFor="categoria" className="block text-gray-700 font-bold mb-2">Categoría</label>
                            <select
                                id="categoria"
                                name="categoria"
                                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                value={formik.values.categoria}
                                onChange={formik.handleChange}
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

                        {/* imagen */}
                        <div className="mb-4">
                            <label htmlFor="imagen" className="block text-gray-700 font-bold mb-2">Imagen</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUploadImage}
                                disabled={subiendo}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700"
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
                            {imagenURL && (
                                <img src={imagenURL} alt="preview" className="mt-4 h-40 object-contain" />
                            )}
                        </div>

                        {/* descripcion */}
                        <div className="mb-4">
                            <label htmlFor="descripcion" className="block text-gray-700 font-bold mb-2">Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 h-40"
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                            />
                        </div>

                        {/* botoes */}
                        <div className="flex gap-4 mt-6">
                            <button
                                type="submit"
                                disabled={subiendo}
                                className={`py-2 px-4 rounded font-bold text-white ${subiendo ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                Guardar Cambios
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    toast.info("Edición cancelada");
                                    navigate("/menu");
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded font-bold"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditarProducto;
