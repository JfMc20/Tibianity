import React from 'react';
import { format, parseISO, isValid } from 'date-fns';

// Componente para mostrar la tabla de usuarios registrados
const UserTable = ({ 
  users, 
  sessions, 
  currentUser, 
  handlePromote, 
  handleDemote, 
  actionLoading, 
  actionError, 
  actionSuccess 
}) => {

  // Función auxiliar para obtener sesiones de un usuario específico
  const getUserSessionsCount = (userId) => {
    if (!Array.isArray(sessions)) return 0;
    return sessions.filter(session => session.userId === userId).length;
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-[#111118] divide-y divide-[#2e2e3a]">
            {/* Asegurarse que users es un array */}
            {Array.isArray(users) && users.map(listedUser => {
              const isCurrentUser = currentUser?.id === listedUser._id; // Asumiendo que currentUser.id existe
              const isListedUserAdmin = listedUser.isAdmin === true;
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {isListedUserAdmin ? (
                      <button
                        onClick={() => handleDemote(listedUser._id)} // Usar prop
                        disabled={isCurrentUser || actionLoading === listedUser._id}
                        className={`text-red-500 hover:text-red-400 disabled:text-gray-500 disabled:cursor-not-allowed ${actionLoading === listedUser._id ? 'opacity-50 animate-pulse' : ''}`}
                      >
                        {actionLoading === listedUser._id ? 'Degradando...' : (isCurrentUser ? '-' : 'Degradar')}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePromote(listedUser._id)} // Usar prop
                        disabled={actionLoading === listedUser._id}
                        className={`text-indigo-400 hover:text-indigo-300 disabled:text-gray-500 disabled:cursor-not-allowed ${actionLoading === listedUser._id ? 'opacity-50 animate-pulse' : ''}`}
                      >
                        {actionLoading === listedUser._id ? 'Promoviendo...' : 'Promover'}
                      </button>
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