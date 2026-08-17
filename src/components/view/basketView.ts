import { Component } from "../Base/Component";
import { IEvents } from "../Base/Events";
import { ensureElement } from "../../utils/utils";
import { IBasketViewData } from "../../types";

export class BasketView extends Component<IBasketViewData> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;
  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.orderButton.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }
  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
    this.orderButton.disabled = items.length === 0;
  }
  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}