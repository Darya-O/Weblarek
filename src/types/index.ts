import { categoryMap } from "../utils/constants";

export type CategoryKey = keyof typeof categoryMap;

export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;

  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = "card" | "cash" | "";

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrder extends IBuyer {
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export type TFormErrors = Partial<Record<keyof IBuyer, string>>;

export interface IHeaderData {
  counter: number;
}

export interface IGalleryData {
  catalog: HTMLElement[];
}

export interface IModalData {
  content: HTMLElement;
}

export interface ICardData {
  title: string;
  price: number | null;
}

export interface ICatalogCardData extends ICardData {
  category: string;
  image: string;
}

export interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export interface IPreviewCardData extends ICatalogCardData {
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export interface IBasketCardData extends ICardData {
  index: number;
}

export interface IBasketViewData {
  items: HTMLElement[];
  total: number;
}

export interface IFormState {
  valid: boolean;
  errors: string;
}

export interface IFormFieldChange<T> {
  field: keyof T;
  value: string;
}

export interface IOrderFormData {
  payment: TPayment | null;
  address: string;
}

export interface IContactsFormData {
  email: string;
  phone: string;
}

export interface ISuccessData {
  total: number;
}

export interface ISuccessActions {
  onClick?: (event: MouseEvent) => void;
}

export interface ICardEvent {
  id: string;
}