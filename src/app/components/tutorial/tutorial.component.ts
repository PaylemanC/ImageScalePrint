import { Component, Input } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent {
  slides: Tutorial[] = [
    {
      image: './assets/images/printing_slide_1.png',
      title: '1. Configuración básica de tu PDF',
      content: 'Empieza añadiendo un <strong>título</strong> para tu PDF, elige si al imprimir debe ir <strong>CON o SIN bordes</strong>, y selecciona la <strong>orientación</strong> de la hoja. <br>Nota: Asegúrate de definir estas configuraciones antes de insertar tus imágenes, estos detalles se reflejarán el título del archivo descargado.'
    },
    {
      image: './assets/images/printing_slide_2.png',
      content: 'Haz click en el botón <b>"Subir imagen"</b> ubicado en la parte inferior para empezar a configurar las imágenes que quieres insertar en tu PDF.'
    },
    {
      image: './assets/images/printing_slide_3.png',
      title: '2. Configuración preliminar de tu imagen',
      content: 'Primero, <strong>define el tamaño de tu imagen en centímetros</strong>; haz click en <em>"Aceptar medidas"</em> para aplicar los cambios. <br><br>Luego, <strong>sube tu imagen y ajústala</strong>; ¡Asegúrate de que <u>cubra toda el área</u>, no podrás cambiar las medidas una vez insertada en la hoja A4! También puedes usar el <b>ajuste automático</b> o subir otra imagen con el botón <em>"Cambiar imagen"</em><br><br> Finalmente, haz clic en <em>"Aceptar e insertar"</em> para <strong>añadir la imagen a tu hoja A4; o descárgala</strong> con <em>"Descargar imagen"</em>.'
    },
    {
      image: './assets/images/printing_slide_4.png',
      title: '3. Acomoda tus imágenes en la hoja',
      content: 'Puedes <u>mover, rotar, clonar y eliminar</u> imágenes. Añade tantas imágenes como necesites. <br>Nota: NO puedes cambiar el tamaño de las imágenes ya insertadas en esta hoja.'
    },
    {
      image: './assets/images/printing_slide_5.png',
      title: '3. Descarga tu PDF',
      content: 'Cuando hayas terminado, haz click en el botón <b>"Descargar PDF"</b> ubicado en la parte inferior para obtener tu archivo final listo para imprimir.'
    }
  ];

  currentIndex = 0;

  prevSlide() {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.slides.length - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex < this.slides.length - 1) ? this.currentIndex + 1 : 0;
  }
}
