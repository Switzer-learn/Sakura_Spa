// Common interfaces and types
export interface User {
  id: string;
  name: string;
  role: 'admin' | 'staff';
  email: string;
}

export interface Order {
  id: string;
  customerId: string;
  services: Service[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: Date;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}