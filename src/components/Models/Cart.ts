import { IEvents } from "../Base/Events";
import { IProduct } from "../../types/index";

export class Cart {
  protected items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    if (this.hasItem(product.id)) {
      return;
    }

    this.items.push(product);

    this.emitChanges();
  }

  removeItem(id: string): void {
    const previousLength = this.items.length;

    this.items = this.items.filter((item) => item.id !== id);

    if (this.items.length !== previousLength) {
      this.emitChanges();
    }
  }

  clear(): void {
    if (this.items.length === 0) {
      return;
    }

    this.items = [];

    this.emitChanges();
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

  protected emitChanges(): void {
    this.events.emit("basket:changed");
  }
}