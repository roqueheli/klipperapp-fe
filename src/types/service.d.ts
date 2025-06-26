export interface Service {
  id: number
  name: string
  description: string | null
  organization_id: number
  price: number
  branch_id?: number
  duration: number
  active: boolean
  photo_url: string
}

export type ServiceResponse = {
  status: number;
  services: Service[];
};