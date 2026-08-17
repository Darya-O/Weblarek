import { Component } from "../Base/Component";
import { IEvents } from "../Base/Events";
import { ensureElement } from "../../utils/utils";
import { IFormFieldChange, IFormState } from "../../types";

export abstract class Form<T> extends Component<T & IFormState> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  constructor(
    protected events: IEvents,
    protected readonly formContainer: HTMLFormElement,
  ) {
    super(formContainer);
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.formContainer,
    );
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.formContainer,
    );
    this.formContainer.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });
    this.formContainer.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit(`${this.formContainer.name}:submit`);
    });
  }
  protected onInputChange(field: keyof T, value: string): void {
    this.events.emit<IFormFieldChange<T>>(
      `${this.formContainer.name}.${String(field)}:change`,
      { field, value },
    );
  }
  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }
  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}