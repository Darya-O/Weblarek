import { Card } from "./card";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";
import { ICatalogCardData, ICardActions, CategoryKey } from "../../types";

export class CatalogCard extends Card<ICatalogCardData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
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

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }
}