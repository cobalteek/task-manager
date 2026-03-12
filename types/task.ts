export interface Task {
  id: string
  title: string
  description: string
  createdAt: string
  deadline: string | null
  statusId: number
  createdById: string
  status: { id: number; name: string }
  handler: { id: string; name: string; }
}
