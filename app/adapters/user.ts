import type { UserResponse, UserRequest, EmployeeUserRequest } from '~/api/types.gen'
// Currently, there is no distinct User type in UI, only AuthResponse or Employee.
// We map UserResponse roughly to AuthResponse pattern or a generic Object if needed.

export const mapUserResponseToUI = (data: UserResponse) => ({
  id: data.id || 0,
  email: data.email || '',
  role: (data.role ? data.role.charAt(0) + data.role.slice(1).toLowerCase() : 'Cliente') as any,
  status: data.status ?? false,
  personId: data.personId,
  personName: data.personName,
  personLastname: data.personLastname
})

export const mapUserRequestFromUI = (data: any): UserRequest => ({
  email: data.email || '',
  password: data.password || '',
  role: (data.role?.toUpperCase() as any) || 'CLIENTE'
})

export const mapEmployeeUserRequestFromUI = (employeeData: any, userData: any): EmployeeUserRequest => ({
  name: employeeData.name || '',
  lastname: employeeData.lastname || '',
  documentType: employeeData.documentType || 'DNI',
  documentNumber: employeeData.documentNumber || '',
  position: employeeData.position || 'Administrative',
  contractType: employeeData.contractType || 'FULL_TIME',
  weeklyHours: employeeData.weeklyHours || 40,
  hourlyWage: employeeData.hourlyWage || 0,
  user: mapUserRequestFromUI(userData)
})
