import { Injectable } from '@angular/core';

@Injectable()
export class SpeechSynthesizerService {

<<<<<<< HEAD
  message: any; //contenedor de mensaje de comunicaion entre el servicio y los componentes
=======
  message: any;
>>>>>>> andres-spring-uno

  constructor() {
    this.initSynthesis();
  }

<<<<<<< HEAD
  /**
   * configuracion principal para la synthesis de el reconocimiento de voz
   */
=======
>>>>>>> andres-spring-uno
  initSynthesis(): void {
    this.message = new SpeechSynthesisUtterance();
    this.message.volume = 1;
    this.message.rate = 1;
    this.message.pitch = 0.2;
  }

<<<<<<< HEAD
  /**
   * Envia paquetes de mensajeria a los componentes que implementan al servicio de reconocimiento
   * @param message mensaje a enviar
   * @param language lenguaje de codificacion 
   */
=======
>>>>>>> andres-spring-uno
  speak(message: string, language: string): void {
    this.message.lang = language;
    this.message.text = message;
    speechSynthesis.speak(this.message);
  }
}
