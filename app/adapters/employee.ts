import type { EmployeeResponse, EmployeeRequest } from '~/api/types.gen'
import type { Employee } from '~/types'

export const mapEmployeeResponseToUI = (data: EmployeeResponse): Employee => ({
  id: data.id || 0,
  name: data.name || '',
  lastname: data.lastname || '',
  documentType: (data.documentType as any) || 'DNI',
  documentNumber: data.documentNumber || '',
  birthdate: new Date(), // Assuming not available yet
  hoursWeek: data.weeklyHours || 0,
  hourlyWage: data.hourlyWage || 0,
  position: (data.position as any) || 'Administrative',
  status: data.status ?? false
})

export const mapEmployeeRequestFromUI = (data: Partial<Employee>): EmployeeRequest => ({
  name: data.name || '',
  lastname: data.lastname || '',
  documentType: data.documentType || 'DNI',
  documentNumber: data.documentNumber || '',
  position: data.position || 'Administrative',
  contractType: 'Full-Time', // Defaulting as not mapped in UI currently
  weeklyHours: data.hoursWeek || 40,
  hourlyWage: data.hourlyWage || 0
})
