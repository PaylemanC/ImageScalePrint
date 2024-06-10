import { Component } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  canvas: fabric.Canvas | undefined = undefined;
  title: string = 'Título';
  orientation: string = 'horizontal';
  borders: string = '';

  showModalImage: boolean = false;
  showModalTutorial: boolean = false;

  get isModalImageActive(): boolean {
    return this.showModalImage;
  }

  openModalImage() {
    this.showModalImage = true;
  }

  openModalTutorial() {
    this.showModalTutorial = true;
  }

  onModalImageClosed() {
    this.showModalImage = false;
  }

  onModalTutorialClosed() {
    this.showModalTutorial = false;
  }

  receiveCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  receiveOrientation(orientation: string) {
    this.orientation = orientation;
  }

  receiveBorders(option: string) {
    this.borders = option;
  }
}
