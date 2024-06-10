import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MetricConverterService {
  dpiWeb: number = 96;
  dpiPrint: number = 300;

  constructor() { }

  cmToPixel(cm: number): number {
    return Math.round(cm * this.dpiWeb / 2.54);
  }
}
