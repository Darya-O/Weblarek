import { Form } from "./form";
import { IEvents } from "../Base/Events";
import { ensureElement } from "../../utils/utils";
import { IContactsFormData } from "../../types";

export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);
    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );
  }
  set email(value: string) {
    this.emailInput.value = value;
  }
  set phone(value: string) {
    this.phoneInput.value = value;
  }
}