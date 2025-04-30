import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Squares2X2Icon,
  UsersIcon,
  ChartBarIcon,
  EnvelopeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'; // Usaremos iconos para mejor UI

const SidePanelMenu = () => {
  const baseLinkClasses = "flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out";
  const activeLinkClasses = "bg-gray-700 text-white";
  const inactiveLinkClasses = "text-gray-400 hover:bg-gray-700/50 hover:text-white";

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: Squares2X2Icon, exact: true },
    // { name: 'Usuarios', href: '/admin/users', icon: UsersIcon }, // Ejemplo para futuro
    // { name: 'Estadísticas', href: '/admin/stats', icon: ChartBarIcon }, // Ejemplo para futuro
    { name: 'Enviar Correos', href: '/admin/email', icon: EnvelopeIcon },
    // { name: 'Configuración', href: '/admin/settings', icon: Cog6ToothIcon }, // Ejemplo para futuro
  ];

  return (
    <div className="w-64 bg-[#111118] border-r border-[#2e2e3a] h-screen flex flex-col fixed top-0 left-0 pt-16"> {/* Añadido pt-16 si hay una navbar fija arriba */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.exact} // Usa 'end' para match exacto en la ruta base
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
            }
          >
            <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      {/* Puedes añadir info del usuario o logout aquí si quieres */}
    </div>
  );
};

export default SidePanelMenu; 