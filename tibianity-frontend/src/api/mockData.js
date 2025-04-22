import { format, subDays } from 'date-fns';

// Generar fechas para los últimos 30 días
const generateDates = (days) => {
  return Array.from({ length: days }).map((_, i) => {
    return format(subDays(new Date(), i), 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'');
  });
};

const dates = generateDates(30);

// Datos de usuarios simulados
export const mockUsers = [
  {
    _id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    _id: '2',
    name: 'María García',
    email: 'maria@example.com',
    createdAt: subDays(new Date(), 25).toISOString(),
  },
  {
    _id: '3',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    createdAt: subDays(new Date(), 20).toISOString(),
  },
  {
    _id: '4',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    createdAt: subDays(new Date(), 15).toISOString(),
  },
  {
    _id: '5',
    name: 'Roberto Sánchez',
    email: 'roberto@example.com',
    createdAt: subDays(new Date(), 10).toISOString(),
  },
];

// Generar sesiones aleatorias para los usuarios
export const mockSessions = [];

// Distribuir sesiones entre los usuarios a lo largo de los últimos 30 días
for (let i = 0; i < 200; i++) {
  const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  const randomDate = dates[Math.floor(Math.random() * dates.length)];
  const sessionDuration = Math.floor(Math.random() * 120) + 10; // 10-130 minutos
  
  const startTime = new Date(randomDate);
  const endTime = new Date(startTime.getTime() + sessionDuration * 60000);
  
  mockSessions.push({
    _id: `session_${i}`,
    userId: randomUser._id,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    duration: sessionDuration
  });
}

// API simulada
export const mockAPI = {
  getUsers: () => {
    return Promise.resolve(mockUsers);
  },
  
  getSessions: (startDate, endDate) => {
    let filteredSessions = [...mockSessions];
    
    if (startDate) {
      const start = new Date(startDate);
      filteredSessions = filteredSessions.filter(
        session => new Date(session.startTime) >= start
      );
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Final del día
      filteredSessions = filteredSessions.filter(
        session => new Date(session.startTime) <= end
      );
    }
    
    return Promise.resolve(filteredSessions);
  }
};