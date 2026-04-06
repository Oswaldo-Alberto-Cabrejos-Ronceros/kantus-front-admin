import type { Employee } from '~/types'

export default defineEventHandler(async () => {
  const mockEmployees: Employee[] = [
    {
      id: 1,
      name: 'Carlos',
      lastname: 'García',
      documentType: 'DNI',
      documentNumber: '76543210',
      birthdate: '1990-05-14',
      hoursWeek: 48,
      hourlyWage: 15,
      position: 'Chef',
      status: true
    },
    {
      id: 2,
      name: 'María',
      lastname: 'López',
      documentType: 'CE',
      documentNumber: '001234567',
      birthdate: '1995-08-22',
      hoursWeek: 40,
      hourlyWage: 12,
      position: 'Administrative',
      status: true
    },
    {
      id: 3,
      name: 'José',
      lastname: 'Pérez',
      documentType: 'DNI',
      documentNumber: '12345678',
      birthdate: '2000-01-10',
      hoursWeek: 30,
      hourlyWage: 10,
      position: 'Waiter',
      status: false
    }
  ]

  return mockEmployees
})
