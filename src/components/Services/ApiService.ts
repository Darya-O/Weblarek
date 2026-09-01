import { IProduct } from "../../types/index";
import { IOrderResult } from "../../types/index";
import { IOrder } from "../../types/index";
import { IApi } from "../../types/index";

export class ApiService {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>("/product/");
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>("/order/", order);
  }
}