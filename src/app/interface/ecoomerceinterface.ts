export interface ecommerce{
    id: number,
      name: string;
      description: string;
      price: number;
      currency: string;
      size: string[];
      color: string[];
      image: string;
      category:string,
}

export interface CartItem extends ecommerce {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  tax: number;
  subtotal: number;
  shippingCost: number;
  customerEmail: string;
  customerName: string;
  address: string;
  paymentMethod: string;
  status: string;
  orderDate: Date;
}