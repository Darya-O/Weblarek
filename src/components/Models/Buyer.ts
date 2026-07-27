import type { BuyerValidationErrors, IBuyer, TPayment } from '../../types/index';

export class Buyer {
  private payment: TPayment | null = null;
  private email: string = '';
  private phone: string = '';
  private address: string = '';

setData(data: Partial<IBuyer>): void {
  if ('payment' in data) {
    this.payment = data.payment ?? null;
  }
  if ('email' in data) {
    this.email = data.email ?? '';
  }
  if ('phone' in data) {
    this.phone = data.phone ?? '';
  }
  if ('address' in data) {
    this.address = data.address ?? '';
  }
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
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};

    if (this.payment === null) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this.email || this.email.trim() === '') {
      errors.email = 'Укажите email';
    }
    if (!this.phone || this.phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }
    if (!this.address || this.address.trim() === '') {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }
}