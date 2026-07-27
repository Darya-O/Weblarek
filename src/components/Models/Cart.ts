import { IProduct } from '../../types/index';

/*Модель корзины.Хранит товары, выбранные пользователем.*/
export class Cart {
  private items: IProduct[] = [];  /*Товары в корзине.*/
  getItems(): IProduct[] {
    return this.items;
  } /* Возвращает копию массива товаров корзины.*/

  /* Добавляет товар в корзину. Один и тот же товар нельзя добавить повторно.*/
  addItem(product: IProduct): void {
    this.items.push(product);
  }

  /* Удаляет товар из корзины.*/
  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
  }

  /* Полностью очищает корзину.*/
  clear(): void {
    this.items = [];
  }

  /* Если цена товара равна null, такой товар добавляет к общей сумме 0.*/
  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      const price = item.price ?? 0;
      return total + price;
    }, 0);
  }

  /* Возвращает количество товаров в корзине. */
  getItemCount(): number {
    return this.items.length;
  }

  /* Проверяет, находится ли товар в корзине.*/
  hasItem(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}