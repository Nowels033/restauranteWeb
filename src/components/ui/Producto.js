import React from "react";

const Producto = ({producto}) => {
    const {nombre ,imagen,disponible,categoria,precio,descripcion} = producto;
    return ( 
        <div className="w-full px-3 mb-4">
            <div className="p-5 shadow-md bg-white">
                <div className="lg:flex">
                    <div className="lg:w-5/12 xl:w-3/12">
                        <img src={imagen} alt="imagen producto" />
                    </div>
                    <div className="lg:w-7/12 xl:w-9/12">
                        2
                    </div>
                </div>
            </div>
      </div>
      
     );
}
export default Producto;