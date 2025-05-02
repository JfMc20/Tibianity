import React, { useState, useRef, useEffect } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { EllipsisVerticalIcon, ArrowUpCircleIcon, ArrowDownCircleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';

// Componente para mostrar la tabla de usuarios registrados
const UserTable = ({ 
  users, 
  sessions, 
  currentUser, 
  handlePromote, 
  handleDemote, 
  handleGrantAccess,
  handleRevokeAccess,
  actionLoading, 
  actionError, 
  actionSuccess 
}) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // Función auxiliar para obtener sesiones de un usuario específico
  const getUserSessionsCount = (userId) => {
    if (!Array.isArray(sessions)) return 0;
    return sessions.filter(session => session.userId === userId).length;
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = (userId) => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  return (
    <div className="bg-[#111118] border border-[#2e2e3a] rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Usuarios Registrados</h2>
      
      {/* Mostrar mensajes de éxito/error de acciones aquí arriba de la tabla */}
      {actionSuccess && (
        <div className="mb-4 bg-green-900/50 border border-green-700 text-green-300 px-4 py-2 rounded text-sm" role="alert">
          {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="mb-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-2 rounded text-sm" role="alert">
          {actionError}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#2e2e3a]">
          <thead className="bg-[#1e2232]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha Registro</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sesiones</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rol</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acceso</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#111118] divide-y divide-[#2e2e3a]">
            {/* Asegurarse que users es un array */}
            {Array.isArray(users) && users.map(listedUser => {
              const isCurrentUser = currentUser?.id === listedUser._id; // Asumiendo que currentUser.id existe
              const isListedUserAdmin = listedUser.isAdmin === true;
              const hasPublicAccess = listedUser.canAccessPublicSite === true;
              const userSessionsCount = getUserSessionsCount(listedUser._id);

              return (
                <tr key={listedUser._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{listedUser.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">{listedUser.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">
                      {listedUser.createdAt && isValid(parseISO(listedUser.createdAt))
                        ? format(parseISO(listedUser.createdAt), 'dd/MM/yyyy')
                        : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">{userSessionsCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ 
                      isListedUserAdmin ? 'bg-green-900/50 text-green-300' : 'bg-gray-700/50 text-gray-300'
                    }`}>
                      {isListedUserAdmin ? 'Admin' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ 
                      hasPublicAccess ? 'bg-sky-900/60 text-sky-300' : 'bg-slate-700/50 text-slate-400'
                    }`}> 
                      {hasPublicAccess ? 'Permitido' : 'Denegado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      onClick={() => toggleDropdown(listedUser._id)}
                      disabled={actionLoading === listedUser._id}
                      className={`p-1 text-gray-400 hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${actionLoading === listedUser._id ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Acciones para {listedUser.name}</span>
                    </button>

                    {openDropdownId === listedUser._id && (
                      <div 
                        ref={dropdownRef}
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                        role="menu" aria-orientation="vertical" aria-labelledby={`menu-button-${listedUser._id}`}
                      >
                        {isListedUserAdmin ? (
                          <button
                            onClick={() => { handleDemote(listedUser._id); setOpenDropdownId(null); }}
                            disabled={isCurrentUser || actionLoading === listedUser._id}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            role="menuitem"
                          >
                            <ArrowDownCircleIcon className="h-4 w-4"/> Degradar
                          </button>
                        ) : (
                          <button
                            onClick={() => { handlePromote(listedUser._id); setOpenDropdownId(null); }}
                            disabled={actionLoading === listedUser._id}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-indigo-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            role="menuitem"
                          >
                            <ArrowUpCircleIcon className="h-4 w-4"/> Promover
                          </button>
                        )}
                        {hasPublicAccess ? (
                          <button
                            onClick={() => { handleRevokeAccess(listedUser._id); setOpenDropdownId(null); }}
                            disabled={actionLoading === listedUser._id}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-yellow-500 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            role="menuitem"
                          >
                            <XCircleIcon className="h-4 w-4"/> Denegar Acceso
                          </button>
                        ) : (
                          <button
                            onClick={() => { handleGrantAccess(listedUser._id); setOpenDropdownId(null); }}
                            disabled={actionLoading === listedUser._id}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-sky-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            role="menuitem"
                          >
                            <CheckCircleIcon className="h-4 w-4"/> Permitir Acceso
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {Array.isArray(users) && users.length === 0 && (
            <p className="text-center text-gray-500 py-4">No hay usuarios para mostrar.</p>
        )}
      </div>
    </div>
  );
};

// Opcional: PropTypes
// import PropTypes from 'prop-types';
// UserTable.propTypes = { ... };

export default UserTable; 