export interface Task {
  id: string
  title: string
  description: string
  createdAt: string
  deadline: string | null
  doneAt: string | null
  statusId: number
  handlerId: string
  projectId: string
  status: { id: number; name: string }
  handler: { id: string; name: string; }
}
