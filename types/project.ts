export interface Project {
  id: string
  title: string
  description: string
  createdAt: string // с API обычно приходит string
  deadline: string | null
  statusId: number
  createdById: string
  status: { id: number; name: string }
  createdBy: { id: string; name: string; }
}
