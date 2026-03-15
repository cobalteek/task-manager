export interface Project {
  id: string
  title: string
  description: string
  createdAt: string
  deadline: string | null
  statusId: number
  handlerId: string
  status: { id: number; name: string }
  handler: { id: string; name: string; }
}
