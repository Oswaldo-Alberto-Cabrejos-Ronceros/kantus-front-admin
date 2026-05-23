import type { EmployeeResponse, EmployeeRequest } from '~/api/types.gen'
import type { Employee, ContractType } from '~/types'

export const mapEmployeeResponseToUI = (data: EmployeeResponse): Employee => ({
  id: data.id || 0,
  name: data.name || '',
  lastname: data.lastname || '',
  documentType: (data.documentType as any) || 'DNI',
  documentNumber: data.documentNumber || '',
  position: (data.position as any) || 'Administrative',
  contractType: (data.contractType as ContractType) || 'FULL_TIME',
  weeklyHours: data.weeklyHours || 0,
  hourlyWage: data.hourlyWage || 0,
  status: data.status ?? false
})

export const mapEmployeeRequestFromUI = (data: Partial<Employee>): EmployeeRequest => ({
  name: data.name || '',
  lastname: data.lastname || '',
  documentType: data.documentType || 'DNI',
  documentNumber: data.documentNumber || '',
  position: data.position || 'Administrative',
  contractType: data.contractType || 'FULL_TIME',
  weeklyHours: data.weeklyHours || 0,
  hourlyWage: data.hourlyWage || 0
})
