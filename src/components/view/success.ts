import { Component } from "../Base/Component";
import { ensureElement } from "../../utils/utils";
import { ISuccessData, ISuccessActions } from "../../types";
export class Success extends Component<ISuccessData> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;
  constructor(container: HTMLElement, actions?: ISuccessActions) {
    super(container);
    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    if (actions?.onClick) {
      this.closeButton.addEventListener("click", actions.onClick);
    }
  }
  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}