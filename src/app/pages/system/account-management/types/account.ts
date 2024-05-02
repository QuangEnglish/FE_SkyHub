export interface AccountSearchRequest {
  fullName: string
  email: string
  status: number
  active: number
}

export interface AccountSearchResponse {
  id: number
  fullName: string
  email: string
  status: number
  active: number
  roles: string
  createdDate: any
  updatedDate: any
}
