import { Component } from "../Base/Component"; 
import { IEvents } from "../Base/Events"; 
import { ensureElement } from "../../utils/utils"; 
import { IModalData } from "../../types"; 

export class Modal extends Component<IModalData> { 
  protected contentElement: HTMLElement; 
  protected closeButton: HTMLButtonElement; 
  
  constructor( 
    protected events: IEvents, 
    container: HTMLElement, 
  ) { 
    super(container); 
    
    this.contentElement = ensureElement<HTMLElement>( 
      ".modal__content", 
      this.container, 
    ); 
    
    this.closeButton = ensureElement<HTMLButtonElement>( 
      ".modal__close", 
      this.container, 
    ); 
    
    this.closeButton.addEventListener("click", () => { 
      this.close(); 
    }); 
    
    this.container.addEventListener("click", (event) => { 
      if (event.target === this.container) { 
        this.close(); 
      } 
    }); 
  } 
  
  set content(value: HTMLElement) { 
    this.contentElement.replaceChildren(value); 
  } 
  
  open(): void { 
    this.container.classList.add("modal_active"); 
    this.events.emit("modal:open"); // Событие для внешних эффектов
  } 
  
  close(): void { 
    this.container.classList.remove("modal_active"); 
    this.contentElement.replaceChildren(); 
    this.events.emit("modal:close"); // Событие для внешних эффектов
  } 
}