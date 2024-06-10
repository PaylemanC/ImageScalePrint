import { Injectable, EventEmitter } from '@angular/core';
import { fabric } from 'fabric';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  imageLoaded: EventEmitter<fabric.Image> = new EventEmitter<fabric.Image>();
  imageData: EventEmitter<string> = new EventEmitter<string>();

  deleteImg: HTMLImageElement = new Image();
  deleteIcon = "./assets/icons/delete.svg";
  cloneImg: HTMLImageElement = new Image();
  cloneIcon = "./assets/icons/clone.svg";
  alignCenterImg: HTMLImageElement = new Image();
  alignCenterIcon = "./assets/icons/align-center.svg";
  iconSize: number = 30;

  constructor() { }

  loadImage(file: File, maxWidth: number, maxHeight: number) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const imgUrl = event.target.result;
      fabric.Image.fromURL(imgUrl, (image) => {
        const scaleFactor = Math.min(maxWidth / image.width!, maxHeight / image.height!);
        image.scale(scaleFactor);
        image.set({
          transparentCorners: false,
          borderColor: '#1f1f1f',
          cornerColor: 'grey',
          cornerStrokeColor: '#1f1f1f',
          cornerSize: 10
        })

        const offSet = 17;

        let deleteControl = new fabric.Control({
          x: 0.5,
          y: -0.5,
          offsetX: -offSet,
          offsetY: offSet,
          cursorStyle: 'pointer',
          mouseUpHandler: this.deleteObject.bind(this),
          render: this.renderIcon.bind(this, this.deleteImg),
          sizeY: this.iconSize,
          sizeX: this.iconSize
        });
        this.deleteImg.src = this.deleteIcon;
        image.controls['deleteControl'] = deleteControl;

        let cloneControl = new fabric.Control({
          x: -0.5,
          y: -0.5,
          offsetX: offSet,
          offsetY: offSet,
          cursorStyle: 'pointer',
          mouseUpHandler: this.cloneObject.bind(this),
          render: this.renderIcon.bind(this, this.cloneImg),
          sizeY: this.iconSize,
          sizeX: this.iconSize
        })
        this.cloneImg.src = this.cloneIcon;
        image.controls['cloneControl'] = cloneControl;

        let alignCenterControl = new fabric.Control({
          x: 0,
          y: 0.5,
          offsetX: 0,
          offsetY: -offSet,
          cursorStyle: 'pointer',
          mouseUpHandler: this.alignObjectToCenter.bind(this),
          render: this.renderIcon.bind(this, this.alignCenterImg),
          sizeY: this.iconSize,
          sizeX: this.iconSize
        });
        this.alignCenterImg.src = this.alignCenterIcon;
        image.controls['alignCenterControl'] = alignCenterControl;

        this.imageLoaded.emit(image);
      });
    };
    reader.readAsDataURL(file);
  }

  setImageData(image: string) {
    this.imageData.emit(image);
  }

  deleteObject(eventData: any, transform: any): any {
    const target = transform.target;
    const canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
  }

  cloneObject(eventData: any, transform: any): any {
    const target = transform.target;
    const canvas = target.canvas;
    target.clone((cloned: fabric.Object) => {
      cloned.set({
        left: target.left! + 10,
        top: target.top! + 10,
        borderColor: '#1f1f1f',
        cornerColor: 'white',
        cornerStrokeColor: '#1f1f1f',
        cornerSize: 10,
        lockScalingX: target.lockScalingX,
        lockScalingY: target.lockScalingY
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
    });
  }

  alignObjectToCenter(eventData: any, transform: any): any {
    const target = transform.target;
    const canvas = target.canvas;
    const newCenterX = canvas.width! / 2;
    const newCenterY = canvas.height! / 2;

    const deltaX = newCenterX - target.left! - target.width! / 2;
    const deltaY = newCenterY - target.top! - target.height! / 2;

    target.set({
      left: target.left! + deltaX,
      top: target.top! + deltaY
    });

    target.setCoords();
    canvas.requestRenderAll();
  }

  renderIcon(img: HTMLImageElement, ctx: CanvasRenderingContext2D, left: number, top: number, fabricObject: fabric.Object) {
    const size = this.iconSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  setControlVisibility(image: fabric.Image, controlKey: string, visible: boolean) {
    const control = image.controls[controlKey];
    if (control) {
      control.visible = visible;
      image.setCoords();
    }
  }
}
