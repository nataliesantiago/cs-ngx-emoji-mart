<<<<<<< HEAD
//-core
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//-messages core
import { SpeechNotification } from '../model/speech-notification';
import { SpeechError } from '../model/speech-error';
//-services
=======
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SpeechNotification } from '../model/speech-notification';
import { SpeechError } from '../model/speech-error';

>>>>>>> andres-spring-uno
import { AppWindow } from '../model/app-window';
const { webkitSpeechRecognition }: AppWindow = <AppWindow>window;

@Injectable()
export class SpeechRecognizerService {

<<<<<<< HEAD
  recognition: any; //recognizion instance
=======
  recognition: any;
>>>>>>> andres-spring-uno
  startTimestamp;
  ignoreOnEnd: boolean;
  language: string;

  constructor() { }

<<<<<<< HEAD
  /**
   * Constructor para configurar el sistema de reconocimiento
   * @param language lenguaje de reconocimiento
   */
=======
>>>>>>> andres-spring-uno
  initialize(language: string): void {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = language;
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
  }

<<<<<<< HEAD
  /**
   * Especifica el lenguaje principal de reconocimiento
   * @param language 
   */
=======
>>>>>>> andres-spring-uno
  setLanguage(language: string) {
    this.recognition.lang = language;
  }

<<<<<<< HEAD
  /**
   * Inicia el sistema de reconocimiento y abre el stream de voz
   * @param timestamp 
   */
=======
>>>>>>> andres-spring-uno
  start(timestamp) {
    this.startTimestamp = timestamp;
    this.recognition.start();
  }

<<<<<<< HEAD
  /**
   * Triger event : se ejecuta cuando el sistema de reconocimiento abre el stream de voz
   */
=======
>>>>>>> andres-spring-uno
  onStart(): Observable<SpeechNotification> {
    if (!this.recognition) {
      this.initialize(this.language);
    }

    return new Observable(observer => {
      this.recognition.onstart = () => {
        observer.next({
          info: 'info_speak_now'
        });
      };
    });
  }

<<<<<<< HEAD
  /**
   * Triger event : se ejecuta cuando el sistema de reconocimiento cierra el stream de voz
   */
=======
>>>>>>> andres-spring-uno
  onEnd(): Observable<SpeechNotification> {
    return new Observable(observer => {
      this.recognition.onend = () => {
        if (this.ignoreOnEnd) {
          return;
        }

        observer.next({
          info: 'info_start'
        });
      };
    });
  }

<<<<<<< HEAD
  /**
   * Triger event : se ejecuta cuando el sistema de reconocimiento obtiene un resultado del
   * stream de voz
   */
=======
>>>>>>> andres-spring-uno
  onResult(): Observable<SpeechNotification> {
    return new Observable(observer => {
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        observer.next({
          info: 'final_transcript',
          content: finalTranscript
        });
        observer.next({
          info: 'interim_transcript',
          content: interimTranscript
        });
      };
    });
  }

<<<<<<< HEAD
  /**
   * Triger event : se ejecuta cuando el sistema de reconocimiento encuentra un error en el stream de voz
   */
=======
>>>>>>> andres-spring-uno
  onError(): Observable<SpeechNotification> {
    return new Observable(observer => {
      this.recognition.onerror = (event) => {
        let result: SpeechError;
        if (event.error === 'no-speech') {
          result = SpeechError.NO_SPEECH;
          this.ignoreOnEnd = true;
        }
        if (event.error === 'audio-capture') {
          result = SpeechError.NO_MICROPHONE;
          this.ignoreOnEnd = true;
        }
        if (event.error === 'not-allowed') {
          if (event.timeStamp - this.startTimestamp < 100) {
            result = SpeechError.BLOCKED;
          } else {
            result = SpeechError.NOT_ALLOWED;
          }

          this.ignoreOnEnd = true;
        }
        observer.next({
          error: result
        });
      };
    });
  }

<<<<<<< HEAD
  /**
   * Detiene el stream de voz del sistema de reconocimiento 
   */
=======
>>>>>>> andres-spring-uno
  stop() {
    this.recognition.stop();
  }
}
