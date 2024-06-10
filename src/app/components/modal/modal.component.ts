import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
  <div class="modal" [style.display]="isOpenModal ? 'block' : 'none'">
    <div class="modal-content">
      <div class="modal-close--container">
        <button class="modal-close" (click)="closeModal()"></button>
      </div>
      <ng-content></ng-content>
    </div>
  </div>`,
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input() isOpenModal: boolean = false;
  @Output() modalClosed = new EventEmitter<void>();

  closeModal() {
    this.isOpenModal = false;
    this.modalClosed.emit();
  }
}
