import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
// Nota: El registro de ChartJS (ChartJS.register(...)) se asume que se hace
// en un nivel superior (como en AdminDashboard.jsx o App.jsx) 
// o debería incluirse aquí si este es el único lugar donde se usan gráficos.

// Opciones de configuración comunes para los gráficos con tema oscuro
const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: { color: '#cbd5e1' } // Color leyenda (gris claro)
    },
    title: {
      display: true,
      // El título específico se pasará como prop
      color: '#e2e8f0' // Color título (gris más claro)
    },
    tooltip: {
       backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo tooltip oscuro
       titleColor: '#ffffff',
       bodyColor: '#e2e8f0',
    }
  },
  scales: {
    x: {
      ticks: { color: '#94a3b8' }, // Color ticks eje X (gris azulado)
      grid: { color: '#374151' } // Color grid eje X (gris oscuro)
    },
    y: {
      ticks: { color: '#94a3b8' }, // Color ticks eje Y
      grid: { color: '#374151' } // Color grid eje Y
    }
  }
};

// Componente para mostrar gráficos de sesiones (Barra o Línea)
const SessionChart = ({ data, type = 'bar', title }) => {
  
  // Fusionar opciones por defecto con título específico
  const chartOptions = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      title: {
        ...defaultChartOptions.plugins.title,
        display: !!title, // Mostrar título solo si se proporciona
        text: title || '',
      }
    }
  };

  return (
    <div className="bg-[#111118] border border-[#2e2e3a] rounded-lg p-4 h-80"> {/* Altura fija para consistencia */}
      {/* Renderizar el tipo de gráfico correspondiente */}
      {type === 'line' ? (
        <Line data={data} options={chartOptions} />
      ) : (
        <Bar data={data} options={chartOptions} />
      )}
    </div>
  );
};

// Opcional: PropTypes
// import PropTypes from 'prop-types';
// SessionChart.propTypes = { ... };

export default SessionChart; 