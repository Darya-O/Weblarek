import { Component } from "../Base/Component";
import { IEvents } from "../Base/Events";
import { ensureElement } from "../../utils/utils";
import { IHeaderData } from "../../types";

export class Header extends Component<IHeaderData> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );

    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}