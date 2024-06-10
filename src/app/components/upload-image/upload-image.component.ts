import { Component, EventEmitter, Output, Input } from '@angular/core';
import { fabric } from 'fabric';
import { ImageService } from 'src/app/services/image.service';
import { MetricConverterService } from 'src/app/services/metric-converter.service';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent {
  canvas: fabric.Canvas | undefined = undefined;
  image: string = '';
  private _height: number = 0;
  private _width: number = 0;

  @Input() orientationA4: string = '';
  @Input() borders: string = '';
  sizeX: number = 21;
  sizeY: number = 29.7;

  measureBtnDisabled: boolean = true;
  uploadBtnDisabled: boolean = true;
  finishBtnDisabled: boolean = true;
  @Output() close = new EventEmitter<void>();

  constructor(private imageService: ImageService, private metricConverterService: MetricConverterService) {}

  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas-img', {
      width: 0,
      height: 0,
      backgroundColor: 'transparent'
    });
  }

  applyMeasure() {
    if (this.canvas) {
      this.canvas.setDimensions({
        width: this.metricConverterService.cmToPixel(this._width),
        height: this.metricConverterService.cmToPixel(this._height)
      });

      this.imageService.imageLoaded.subscribe((image) => {
        this.canvas?.add(image);
      });

      this.uploadBtnDisabled = false;
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (this.canvas!!.getObjects().length > 0) {
        this.canvas?.clear();
      }
      const maxWidth = this.metricConverterService.cmToPixel(this._width);
      const maxHeight = this.metricConverterService.cmToPixel(this._height);
      this.imageService.loadImage(file, maxWidth, maxHeight);
      this.imageService.imageLoaded.subscribe((image: fabric.Image) => {
        this.imageService.setControlVisibility(image, 'deleteControl', false);
        this.imageService.setControlVisibility(image, 'cloneControl', false);
        this.imageService.setControlVisibility(image, 'alignCenterControl', false);
      });
      this.finishBtnDisabled = false;
    }
  }

  openFileSelector() {
    const fileInput = document.getElementById('upload-image-btn') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  private createImage() {
    const image = this.canvas!.toDataURL({
      format: 'png',
      multiplier: 1,
      quality: 1
    });
    return image;
  }

  insertImage() {
    this.image = this.createImage();
    this.imageService.setImageData(this.image);
    this.close.emit();
  }

  downloadImage() {
    this.image = this.createImage();

    const link = document.createElement('a');
    link.href = this.image;
    link.download = 'image.png';
    link.click();
  }

  private updateMeasureBtnDisabled() {
    let maxWidth: number;
    let maxHeight: number;
    let border: number = 1;

    if (this.orientationA4 === 'horizontal') {
      maxWidth = this.sizeY;
      maxHeight = this.sizeX;
    } else  {
      maxWidth = this.sizeX;
      maxHeight = this.sizeY;
    }
    if (this.borders === 'con bordes') {
      maxWidth -= border;
      maxHeight -= border;
    }

    this.measureBtnDisabled = this._width <= 0 || this._height <= 0 || this._width > maxWidth || this._height > maxHeight;
  }

  private getImageFromCanvas(): fabric.Image | null {
    const objects = this.canvas?.getObjects();
    if (!objects || objects.length === 0) return null;

    const image = objects.find(obj => obj instanceof fabric.Image) as fabric.Image;
    return image || null;
  }

  fillImage() {
    if (this.canvas) {
      const image = this.getImageFromCanvas();
      if (!image) return;

      const canvasWidth = this.canvas.width!;
      const canvasHeight = this.canvas.height!;
      const additional = this.metricConverterService.cmToPixel(0.2);
      const scaleFactor = Math.max(canvasWidth / image.width!, canvasHeight / image.height!);

      const newWidth = image.width! * scaleFactor;
      const newHeight = image.height! * scaleFactor;
      const deltaX = (canvasWidth - newWidth) / 2;
      const deltaY = (canvasHeight - newHeight) / 2;

      image.set({
        scaleX: scaleFactor,
        scaleY: scaleFactor,
        left: deltaX,
        top: deltaY
      });

      this.canvas.renderAll();
    }
  }

  fitImage() {
    if (this.canvas) {
      const image = this.getImageFromCanvas();
      if (!image) return;

      const canvasWidth = this.canvas.width!;
      const canvasHeight = this.canvas.height!;

      const scaleX = canvasWidth / image.width!;
      const scaleY = canvasHeight / image.height!;

      const deltaX = (canvasWidth - (image.width! * scaleX)) / 2;
      const deltaY = (canvasHeight - (image.height! * scaleY)) / 2;

      image.set({
        scaleX: scaleX,
        scaleY: scaleY,
        left: deltaX,
        top: deltaY
      });

      this.canvas.renderAll();
    }
  }

  centerImage() {
    if (this.canvas) {
      const image = this.getImageFromCanvas();
      if (!image) return;

      const canvasWidth = this.canvas.width!;
      const canvasHeight = this.canvas.height!;

      const deltaX = (canvasWidth - image.width! * image.scaleX!) / 2;
      const deltaY = (canvasHeight - image.height! * image.scaleY!) / 2;

      image.set({
        left: deltaX,
        top: deltaY
      });

      this.canvas.renderAll();
    }
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
    this.updateMeasureBtnDisabled();
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
    this.updateMeasureBtnDisabled();
  }
}
