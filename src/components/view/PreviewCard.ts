import { Card } from "./card";
import { IEvents } from "../Base/Events";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";
import { IPreviewCardData, CategoryKey } from "../../types";

export class PreviewCard extends Card<IPreviewCardData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected actionButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );

    this.actionButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.actionButton.addEventListener("click", () => {
      this.events.emit("card:action");
    });
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    Object.values(categoryMap).forEach((className) => {
      this.categoryElement.classList.remove(className);
    });

    const categoryClass = categoryMap[value as CategoryKey];

    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.actionButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.actionButton.disabled = value;
  }
}