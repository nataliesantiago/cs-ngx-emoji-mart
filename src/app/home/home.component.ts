import { Component, ChangeDetectorRef, OnInit, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../services/home.service';
import { ResponseSearch } from '../models/response-search';

//speech recognizion
import { SpeechRecognizerService } from './web-speech/shared/services/speech-recognizer.service';

import { SpeechNotification } from './web-speech/shared/model/speech-notification';
import { SpeechError } from './web-speech/shared/model/speech-error';
import { ActionContext } from './web-speech/shared/model/strategy/action-context';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public def = new FormControl(''); // Model del autocomplete
  searchText: string; // ngModel del autocomplete
  defaultSelectedNgAutocomplete: string;
  file: File; // guardar archivo para buscar
  myForm: FormControl; // form del autocomplete
  keyword = 'title'; // reconoce el atributo del json para el autocomplete
  filteredOptions: Observable<any[]>; // guardar el resultado de las busquedas
  dataImage = [];
  textopredictivo: any = [
  ]; // guardar el texto predictivo de la api
  preguntasArray = [
    { id: 1, consulta: 'Como crear mi cuenta corriente' },
    { id: 2, consulta: 'Credito para mi casa nueva' },
    { id: 3, consulta: 'Beneficios del banco' },
    { id: 4, consulta: 'Davivienda desde tu celular' },
    { id: 5, consulta: 'Cuenta de ahorro para pensionados' },
    { id: 6, consulta: 'Puntos de atención' }
  ];
  busquedasArray = [
    { id: 1, busqueda: '¿Cuánto es el monto que puedo transferir desde mi cuenta Davivienda a Daviplata?' },
    { id: 2, busqueda: '¿Si soy cliente Davivienda, cuál es mi clave virtual o dónde la asigno?' },
    { id: 3, busqueda: '¿Cómo puedo presentar una queja o reclamo en Davivienda?' },
    { id: 4, busqueda: '¿como pedir un credito?' },
    { id: 5, busqueda: 'Adelanto de dinero desde mi app' }
  ];
  textError = 'no hay resultados'; // label del autocomplete

  /**web speech start */
  finalTranscript = ''; //valor final de el resultado del speech
  recognizing = false; //flag 
  notification: string;
  languages: string[] = ['en-US', 'es-CO'];
  currentLanguage = this.languages[1];
  actionContext: ActionContext = new ActionContext();


  /**
   * Inicia el stream de sonido para reconocimento de voz
   * @param event current window
   */
  startButton(event) {
    if (this.recognizing) {
      this.speechRecognizer.stop();
      return;
    }

    this.speechRecognizer.start(event.timeStamp);
  }

  /**
   * Actualiza el lenguaje actual para el reconocimiento de voz
   * @param language lenguaje de reconocimiento (['en-US', 'es-CO'])
   */
  onSelectLanguage(language: string) {
    this.currentLanguage = language;
    this.speechRecognizer.setLanguage(this.currentLanguage);
  }

  /**
   * Function de configuracion de eventos, se ejecuta al iniciar el reconomiento de voz para asignar los trigers
   * de cada evento del api
   */
  private initRecognition() {
    this.speechRecognizer.setLanguage(this.currentLanguage);

    /** 
    * Promise : se ejecuta al iniciar el reconocimiento de voz
    */
    this.speechRecognizer.onStart()
      .subscribe(data => {
        let element = document.getElementById('microphone-icon')
        element.className = 'animated infinite heartBeat delay-1s fa fa-microphone microfono tooltip-container'
        this.recognizing = true;
        document.getElementById('voice-search').innerHTML = "Estoy Escuchando ..."
        //this.detectChanges();
      });

    /** 
    * Promise : se ejecuta al terminar el reconocmiento de voz
    */
    this.speechRecognizer.onEnd()
      .subscribe(data => {
        this.recognizing = false;
        let element = document.getElementById('microphone-icon').className = 'fa fa-microphone microfono tooltip-container'
        this.updateiconVoiceSearch("voice-search", "Búsqueda por voz");
        //this.detectChanges();
        this.notification = null;
      });

      /**
       * Promise : se ejecuta cuando el api detecta un resultado desde el servicio del
       * reconocimiento
       */
    this.speechRecognizer.onResult()
      .subscribe((data: SpeechNotification) => {
        const message = data.content.trim();
        if (data.info === 'final_transcript' && message.length > 0) {
          this.searchText = `${message}`;
          this.def = new FormControl(this.searchText);
          this.nzone.run(() => this.stopRecognizer());
          this.finalTranscript = `${this.finalTranscript}\n${message}`;
          this.actionContext.processMessage(message, this.currentLanguage);
          this.actionContext.runAction(message, this.currentLanguage);
        }
      });

      /**
       * Promise : se ejecuta para actualizar la bandeja de errores generados por el servicio 
       * de reconocimiento
       */
    this.speechRecognizer.onError()
      .subscribe(data => {
        switch (data.error) {
          case SpeechError.BLOCKED:
          case SpeechError.NOT_ALLOWED:
            this.notification = `Your browser is not authorized to access your microphone. Verify that your browser has access to your microphone and try again.
            `;
            break;
          case SpeechError.NO_SPEECH:
            this.notification = `No speech has been detected. Please try again.`;
            break;
          case SpeechError.NO_MICROPHONE:
            this.notification = `Microphone is not available. Plese verify the connection of your microphone and try again.`;
            break;
          default:
            this.notification = null;
            break;
        }
        this.recognizing = false;
        //this.detectChanges();
      });
  }

  /**
     * @param  {} event captura el evento del input file
     *  Captura el file en un formdata para enviarlo al servicio y asigna el valor retornado de  la api
     * al input de busqueda para realizar el metodo de buscar()
  */
  onFileSelected(event) {
    if (event.target.files.length > 0) {
       this.file =  event.target.files[0];
       const formData = new FormData();
       formData.append('file', this.file);
       this.homeService.searchFile(formData).subscribe((data) => {
         debugger;
        this.dataImage = data.data;
       }
     );
    }
  }
  selectLabel(val: string, pos: number) {
    this.searchText = this.searchText + ' ' + val;
    this.dataImage.splice(pos, 1);
    this.def = new FormControl(' ' + this.searchText);
  }
  /**
   * Promise : ejecuta una espera por cierta cantidad de tiempo especificada en milisegundos
   * @param ms tiempo de espera en milisegundos
   */
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Detiene el reconocimiento de voz y el stream de audio actual y envia el resultado a la busqueda 
   */
  stopRecognizer() {
    this.speechRecognizer.stop();
    (async () => {
      await this.delay(1500);
      this.buscar();
    })();
  }

  /**
   * Actualiza el mensaje de ayuda para el icono de reconocimiento de voz por medio del id del elemento 
   * @param id id del elemento
   * @param val valor para el elemento seleccionado
   */
  updateiconVoiceSearch(id, val) {
    document.getElementById(id).innerHTML = val
  }

  /**
   * detecta cambios en el reconocimiento de voz como la seleccion de lenguaje
   */
  detectChanges() {
    this.changeDetector.detectChanges();
  }

  /**web speech end */

  constructor(
    private router: Router,
    private homeService: HomeService,
    public responseSearch: ResponseSearch,
    private changeDetector: ChangeDetectorRef,
    private speechRecognizer: SpeechRecognizerService,
    private nzone: NgZone
  ) {
    this.searchText = '';
  }
  /**
    * @param  {} item item del json del autocomplete
    * asignar a la variable title a searchText
  */
  selectEvent(item) {
    this.searchText = item.title; 
  }
  /**
    * @param  {} val valor del item seleccionado
    * metodo de change del autocomplete
  */
  onChangeSearch(val: string) {
    this.searchText = val;
    this.homeService.autocompleteText(val).subscribe((data) =>
      this.textopredictivo = data.data
    );
  }
  ngOnInit(): void {
    /**speech recognizion */
    this.currentLanguage = this.languages[0];
    this.speechRecognizer.initialize(this.currentLanguage);
    this.initRecognition();
    this.notification = null;
    /**speech recognizion */
  }

  buscar() {
    //console.log('Esta es la busqueda ' + this.searchText);
    if (this.searchText === null && this.searchText === undefined) {
      this.searchText = '';
    }
    this.responseSearch.setResultados(this.textopredictivo);
    //console.log('Este es el array', this.responseSearch.getResultados());
    this.router.navigate(['/search/' + this.searchText]);
  }
  buscar2(){
    this.nzone.run(() => this.buscar());
  }
}