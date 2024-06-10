import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    UploadImageComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
