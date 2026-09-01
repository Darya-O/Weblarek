import { IBuyer, TFormErrors } from "../../types/index";
import { IEvents } from "../Base/Events";

export class Buyer {
  protected payment: IBuyer["payment"] = "";
  protected email = "";
  protected phone = "";
  protected address = "";
  constructor(protected events: IEvents) {}
  setData(data: Partial<IBuyer>): void {
    Object.assign(this, data);
    this.events.emit("buyer:changed");
  }
  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }
  clear(): void {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events.emit("buyer:changed");
  }
  validate(): TFormErrors {
    const errors: TFormErrors = {};
    if (!this.payment) {
      errors.payment = "Не выбран способ оплаты";
    }
    if (!this.email.trim()) {
      errors.email = "Укажите email";
    }
    if (!this.phone.trim()) {
      errors.phone = "Укажите телефон";
    }
    if (!this.address.trim()) {
      errors.address = "Укажите адрес";
    }
    return errors;
  }
}