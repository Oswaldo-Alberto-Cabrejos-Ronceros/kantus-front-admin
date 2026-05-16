import type { Employee } from '~/types'

export default defineEventHandler(async () => {
  const employees: Employee[] = [
    { id: 1, name: 'Juan', lastname: 'Pérez', documentType: 'DNI', documentNumber: '12345678', birthdate: '1990-05-15', hoursWeek: 48, hourlyWage: 12.00, position: 'Administrative', status: true, email: 'admin@kantus.com', userRole: 'Admin', hasSystemUser: true },
    { id: 2, name: 'María', lastname: 'Gómez', documentType: 'DNI', documentNumber: '87654321', birthdate: '1995-08-22', hoursWeek: 40, hourlyWage: 8.00, position: 'Waiter', status: true, email: 'mozo@kantus.com', userRole: 'Mozo', hasSystemUser: true },
    { id: 3, name: 'Carlos', lastname: 'López', documentType: 'DNI', documentNumber: '11223344', birthdate: '1988-12-01', hoursWeek: 48, hourlyWage: 10.00, position: 'Cashier', status: true, email: 'cajero@kantus.com', userRole: 'Cajero', hasSystemUser: true },
    { id: 4, name: 'Karla', lastname: 'Velazco', documentType: 'DNI', documentNumber: '55667788', birthdate: '1992-03-10', hoursWeek: 48, hourlyWage: 9.00, position: 'Chef', status: true, email: 'cocinero@kantus.com', userRole: 'Cocinero', hasSystemUser: true },
    { id: 5, name: 'Jhon', lastname: 'Manchado', documentType: 'DNI', documentNumber: '99887766', birthdate: '1998-07-25', hoursWeek: 40, hourlyWage: 7.50, position: 'Delivery', status: true, email: 'delivery@kantus.com', userRole: 'Delivery', hasSystemUser: true },
    { id: 6, name: 'Rosa', lastname: 'Mendoza', documentType: 'CE', documentNumber: 'CE123456', birthdate: '1993-11-30', hoursWeek: 36, hourlyWage: 8.00, position: 'Waiter', status: false, hasSystemUser: false }
  ]
  return employees
})
