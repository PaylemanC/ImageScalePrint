import { Component, ChangeDetectorRef } from '@angular/core';
import { fabric } from 'fabric';
import { jsPDF } from 'jspdf';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private toastr: ToastrService, private cdr: ChangeDetectorRef) {}

  async downloadPDF() {
    this.toastr.info('Espere un momento por favor.', 'Descarga en proceso.', {
      tapToDismiss: false,
      positionClass: 'toast-bottom-right',
      newestOnTop: false
    })

    this.cdr.detectChanges();

    try {
      const pdfOrientation = this.orientation === 'horizontal' ? 'l' : 'p';
      const pdf = new jsPDF(pdfOrientation, 'mm', 'a4');

      const dashedLines: fabric.Line[] = [];
      this.canvas?.getObjects().forEach(obj => {
        if (obj instanceof fabric.Line && obj.strokeDashArray?.[0] === 5) {
          dashedLines.push(obj);
        }
      });

      const clonedCanvas = fabric.util.object.clone(this.canvas!);
      clonedCanvas.getObjects().forEach((obj: any) => {
        if (obj instanceof fabric.Line) {
          clonedCanvas.remove(obj);
        }
      });

      const imageData = clonedCanvas.toDataURL({ format: 'jpeg', quality: 1.0 });
      const imgWidth = pdfOrientation === 'l' ? 297 : 210;
      const imgHeight = (clonedCanvas.height * imgWidth) / clonedCanvas.width;
      pdf.addImage(imageData, 'JPEG', 0, 0, imgWidth, imgHeight);

      if (this.title.trim() === '') {
        this.title = '(sin título)';
      }

      await pdf.save(`${this.title}, ${this.borders}, ${this.orientation}.pdf`);

      this.toastr.success('Tu archivo se descargará con éxito.', 'Descarga completada.', {
        tapToDismiss: true,
        positionClass: 'toast-bottom-right',
        newestOnTop: false
      })

      dashedLines.forEach(line => {
        this.canvas?.add(line);
      });
      this.canvas?.renderAll();

    } catch (error) {
      this.toastr.error('Ha ocurrido un error al intentar descargar tu archivo. Pruebe nuevamente en unos minutos', 'Error inesperado', {
        tapToDismiss: true,
        positionClass: 'toast-bottom-right',
        newestOnTop: false
      });
    }
  }

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
