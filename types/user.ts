export type User = {
  id: string
  name: string
  email?: string
  gender?: string
  roles?: {
    userId: string
    roleId: number
    role: {
      id: number
      name: string
    }
  }[]
}
