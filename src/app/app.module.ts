import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { ModalComponent } from './components/modal/modal.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    UploadImageComponent,
    ModalComponent,
    TutorialComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
