export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'online' | 'cash';

export type BuyerValidationErrors = Partial<Record<keyof IBuyer, string>>;


export interface IApi {
    baseUrl: string;
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

// Ответ сервера с товарами
export interface IProductsResponse {
  items: IProduct[];
  total: number;
}

// Данные для отправки заказа
export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Ответ сервера после отправки заказа
export interface IOrderResponse {
  id: string;
  total: number;
}