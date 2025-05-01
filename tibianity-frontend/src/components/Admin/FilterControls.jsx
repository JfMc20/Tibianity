import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';

// Componente para encapsular los controles de filtro del dashboard
const FilterControls = ({ 
  startDate, 
  endDate, 
  users, 
  selectedUser, 
  onStartDateChange, 
  onEndDateChange, 
  onUserChange 
}) => {
  return (
    <div className="bg-[#111118] border border-[#2e2e3a] rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Filtros</h2>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* Date Picker: Start Date */}
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-sm text-gray-400 mb-1">Fecha inicio</label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={onStartDateChange} // Usar prop
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="p-2 border border-[#2e2e3a] rounded bg-[#1e2232] text-white focus:border-blue-500 focus:ring-blue-500 w-full md:w-auto"
            dateFormat="dd/MM/yyyy"
            locale={es}
          />
        </div>
        
        {/* Date Picker: End Date */}
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-sm text-gray-400 mb-1">Fecha fin</label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onChange={onEndDateChange} // Usar prop
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="p-2 border border-[#2e2e3a] rounded bg-[#1e2232] text-white focus:border-blue-500 focus:ring-blue-500 w-full md:w-auto"
            dateFormat="dd/MM/yyyy"
            locale={es}
          />
        </div>
        
        {/* User Filter Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="userFilter" className="text-sm text-gray-400 mb-1">Usuario</label>
          <select
            id="userFilter"
            value={selectedUser}
            onChange={onUserChange} // Usar prop
            className="p-2 border border-[#2e2e3a] rounded bg-[#1e2232] text-white focus:border-blue-500 focus:ring-blue-500 w-full md:w-auto"
          >
            <option value="all" className="bg-[#1e2232] text-white">Todos los usuarios</option>
            {/* Asegurarse que 'users' sea un array antes de mapear */}
            {Array.isArray(users) && users.map(user => (
              <option key={user._id} value={user._id} className="bg-[#1e2232] text-white">
                {/* Mostrar nombre y email si existen */}
                {user.name || 'Sin nombre'} ({user.email || 'Sin email'})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

// Opcional: PropTypes
// import PropTypes from 'prop-types';
// FilterControls.propTypes = { ... };

export default FilterControls; 