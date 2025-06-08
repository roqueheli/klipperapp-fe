export type Service = {
  id: number;
  name: string;
  image: string;
  price: string;
};

export type ServiceResponse = {
  status: number;
  services: Service[];
};