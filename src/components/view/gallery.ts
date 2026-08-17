import { Component } from "../Base/Component";
import { IGalleryData } from "../../types";

export class Gallery extends Component<IGalleryData> {
  protected catalogElement: HTMLElement;
  constructor(container: HTMLElement) {
    super(container);
    this.catalogElement = this.container;
  }
  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}