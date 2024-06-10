import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ImageScalePrint';

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
}
