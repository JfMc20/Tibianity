import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Squares2X2Icon,
  UsersIcon,
  ChartBarIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const SidePanelMenu = () => {
  const { logout } = useAuth();

  const baseLinkClasses = "flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out";
  const activeLinkClasses = "bg-gray-700 text-white";
  const inactiveLinkClasses = "text-gray-400 hover:bg-gray-700/50 hover:text-white";

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: Squares2X2Icon, exact: true },
    { name: 'Enviar Correos', href: '/admin/email', icon: EnvelopeIcon },
    { name: 'Mi Perfil', href: '/admin/profile', icon: UserCircleIcon, exact: false },
  ];

  return (
    <div className="w-64 bg-[#111118] border-r border-[#2e2e3a] h-screen flex flex-col fixed top-0 left-0 pt-16">
      <div className="mb-8 text-center">
        <NavLink to="/admin" className="text-2xl font-bold text-white">Admin Panel</NavLink>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.exact}
            className={({ isActive }) =>
              `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
            }
          >
            <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-2 py-4">
        <button
          onClick={logout}
          className={`${baseLinkClasses} ${inactiveLinkClasses} w-full text-red-400 hover:bg-red-900/30 hover:text-red-300`}
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" aria-hidden="true" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default SidePanelMenu; 