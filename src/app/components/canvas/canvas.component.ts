import { Component, Output, EventEmitter } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { fabric } from 'fabric';
import { MetricConverterService } from 'src/app/services/metric-converter.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  canvas: fabric.Canvas | undefined = undefined;

  orientation: string = 'horizontal';
  @Output() orientationA4 = new EventEmitter<string>();
  width: number = this.metricConverterService.cmToPixel(21);
  height: number = this.metricConverterService.cmToPixel(29.7);

  borders: string = 'con bordes'
  @Output() bordersA4 = new EventEmitter<string>();

  @Output() pdfCanvas = new EventEmitter<fabric.Canvas>();

  constructor(
    private imageService: ImageService,
    private metricConverterService: MetricConverterService
  ) {
    this.imageService.imageData.subscribe((imageData: string) => {
      if (imageData) {
        fabric.Image.fromURL(imageData, (img) => {
          this.setImagePosition(img);
          this.canvas?.add(img);

          this.canvas?.forEachObject((obj) => {
            obj.lockScalingX = true;
            obj.lockScalingY = true;
            obj.set({
              borderColor: '#1f1f1f',
              cornerColor: 'grey',
              cornerStrokeColor: '#1f1f1f',
              cornerSize: 10
            })

            if (obj instanceof fabric.Image) {
              this.imageService.setControlVisibility(obj, 'deleteControl', true);
              this.imageService.setControlVisibility(obj, 'cloneControl', true);
              this.imageService.setControlVisibility(obj, 'alignCenterControl', true);
            }

            this.restrictObjectMovement();
          });
        });
      }
    });
  }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas-a4', {
      width: this.Width,
      height: this.Height,
      backgroundColor: 'white'
    });
    this.restrictObjectMovement();
    this.drawBorders();

    this.pdfCanvas.emit(this.canvas);
    this.orientationA4.emit(this.orientation);
    this.bordersA4.emit(this.borders);
  }

  get Width() {
    return this.orientation === 'vertical' ? this.metricConverterService.cmToPixel(21) : this.metricConverterService.cmToPixel(29.7);
  }

  get Height() {
    return this.orientation === 'vertical' ? this.metricConverterService.cmToPixel(29.7) : this.metricConverterService.cmToPixel(21);
  }

  applyOrientation() {
    this.canvas?.setDimensions({
      width: this.Width,
      height: this.Height
    });
    this.drawBorders();
  }

  onOrientationChange(event: any) {
    this.orientation = event.target.value;
    this.applyOrientation();
    this.orientationA4.emit(this.orientation);
  }

  onChangeBorders(event: any) {
    this.borders = event.target.value;
    this.drawBorders();
    this.bordersA4.emit(this.borders);
  }

  drawBorders() {
    if (this.canvas) {
      this.canvas.getObjects('line').forEach((obj) => this.canvas?.remove(obj));
      const margin = this.metricConverterService.cmToPixel(0.5);

      if (this.borders === 'con bordes') {
         const lines = [
          new fabric.Line([margin, margin, this.Width - margin, margin], {
            stroke: 'grey',
            strokeDashArray: [5, 5],
            selectable: false
          }),
          new fabric.Line([margin, margin, margin, this.Height - margin], {
            stroke: 'grey',
            strokeDashArray: [5, 5],
            selectable: false
          }),
          new fabric.Line([this.Width - margin, margin, this.Width - margin, this.Height - margin], {
            stroke: 'grey',
            strokeDashArray: [5, 5],
            selectable: false
          }),
          new fabric.Line([margin, this.Height - margin, this.Width - margin, this.Height - margin], {
            stroke: 'grey',
            strokeDashArray: [5, 5],
            selectable: false
          })
        ];
        lines.forEach(line => this.canvas?.add(line));
      }
    }
  }

  restrictObjectMovement() {
    this.canvas?.on('object:moving', (e) => {
      const obj = e.target;
      if (!obj) return;

      const objWidth = obj.width! * obj.scaleX!;
      const objHeight = obj.height! * obj.scaleY!;

      let minX = 0;
      let minY = 0;
      let maxX = this.Width;
      let maxY = this.Height;

      if (this.borders === 'con bordes') {
        const margin = this.metricConverterService.cmToPixel(0.5);
        minX = margin;
        minY = margin;
        maxX = this.Width - margin;
        maxY = this.Height - margin;
      }

      if (obj.left! < minX) {
        obj.left = minX;
      }
      if (obj.top! < minY) {
        obj.top = minY;
      }
      if (obj.left! + objWidth > maxX) {
        obj.left = maxX - objWidth;
      }
      if (obj.top! + objHeight > maxY) {
        obj.top = maxY - objHeight;
      }
    });
  }

  setImagePosition(img: fabric.Image) {
    let margin = 0;
    if (this.borders === 'con bordes') {
      margin = this.metricConverterService.cmToPixel(0.5);
    }
    img.left = margin;
    img.top = margin;
  }
}
