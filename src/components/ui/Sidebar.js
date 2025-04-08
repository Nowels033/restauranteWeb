import React from "react";
import {  NavLink } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="md:w-2/5 xl:w-1/5 bg-gray-800">
            <div className="p-6">
                <p className="uppercase text-white text-2xl traking-wide text-center font-bold">Restaurante CCC</p>

                <p className="mt-1 text-gray-600 text-center">Administra tu restaurante :</p>

                <nav className="mt-5">
                    <NavLink className={({isActive}) => isActive ? "text-yellow-500  hover:text-gray-900 hover:bg-yellow-500 block" : "p1 text-gray-400 block hover:text-gray-900 hover:bg-yellow-500 "} to="/">- Ordenes</NavLink>
                    <NavLink className={({isActive}) => isActive ? "text-yellow-500  hover:text-gray-900 hover:bg-yellow-500 block" : "p1 text-gray-400 block hover:text-gray-900 hover:bg-yellow-500 "} to="/menu">- Menú</NavLink>
                </nav>

            </div>
        </div>
    );
};

export default Sidebar;