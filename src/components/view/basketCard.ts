import { Card } from "./card";
import { ensureElement } from "../../utils/utils";
import { IBasketCardData, ICardActions } from "../../types";

export class BasketCard extends Card<IBasketCardData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );
    if (actions?.onClick) {
      this.deleteButton.addEventListener("click", actions.onClick);
    }
  }
  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}