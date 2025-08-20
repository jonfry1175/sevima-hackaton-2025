import type { ObjMachineTimeline } from './machine.type'

export type Role = 'Admin' | 'Operator' | 'Reviewer'

export type RoleOption = {
  id: number
  name: Role
}
export interface User {
  id: number
  name: string
  NIK: string
  machine_id: null | number
  createdAt: Date
  updatedAt: Date
  role: Role
  role_id: number
  machineName: null | string
  allowDelete?: boolean
  profile_image: null | string
}

type Nullable<T extends object, R = null> = {
  [P in keyof T]: T[P] | R
}

export interface OperatorMachine {
  // detail: Omit<
  //   Nullable<ObjMachineTimeline & { calculate_total_cutting_time: string }>,
  //   'timeDifference' | 'description'
  // > & { Machine: { name: string; type?: string } }
  id: number
  name: string
  is_work: boolean
  description: string
  User: null | Nullable<{
    id: number
    name: string
    profile_image: string
  }>
  log: Nullable<
    Pick<
      ObjMachineTimeline,
      | 'id'
      | 'current_status'
      | 'createdAt'
      | 'g_code_name'
      | 'calculate_total_cutting_time'
      | 'total_cutting_time'
    >
  > & {
    runningOn: number
  }
}
