import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../services/home.service';
import { ResponseSearch } from '../models/response-search';

import Swal from 'sweetalert2';
import { QuillModule } from 'ngx-quill';


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
  searchText: string;
  defaultSelectedNgAutocomplete: string;
  def = new FormControl(this.defaultSelectedNgAutocomplete);
  myForm: FormControl;
  filteredOptions: Observable<any[]>;
  textopredictivo: any = [
  ];
  preguntasArray = [
    { id: 1, consulta: 'Como crear mi cuenta corriente' },
    { id: 2, consulta: 'Credito para mi casa nueva' },
    { id: 3, consulta: 'Beneficios del banco' },
    { id: 4, consulta: 'Davivienda desde tu celular' },
    { id: 5, consulta: 'Cuenta de ahorro para pensionados' }
  ];
  busquedasArray = [
    { id: 1, busqueda: '¿Cuánto es el monto que puedo transferir?' },
    { id: 2, busqueda: '¿ cuál es mi clave virtual ?' },
    { id: 3, busqueda: '¿Cómo puedo presentar una queja o reclamo?' },
    { id: 4, busqueda: '¿como pedir un credito?' },
    { id: 5, busqueda: 'Adelanto de dinero desde mi app' }
  ];


  /**web speech start */
  finalTranscript = '';
  recognizing = false;
  notification: string;
  languages: string[] = ['en-US', 'es-CO'];
  currentLanguage = this.languages[1];
  actionContext: ActionContext = new ActionContext();


  startButton(event) {
    if (this.recognizing) {
      this.speechRecognizer.stop();
      return;
    }

    this.speechRecognizer.start(event.timeStamp);
  }

  onSelectLanguage(language: string) {
    this.currentLanguage = language;
    this.speechRecognizer.setLanguage(this.currentLanguage);
  }

  private initRecognition() {
    this.speechRecognizer.setLanguage(this.currentLanguage);
    this.speechRecognizer.onStart()
      .subscribe(data => {
        let element = document.getElementById('microphone-icon')
        element.className = 'animated infinite heartBeat delay-1s fa fa-microphone microfono tooltip-container'
        this.recognizing = true;
        document.getElementById('voice-search').innerHTML = "Estoy Escuchando ..."
        this.notification = 'I\'m listening...';
        this.detectChanges();
      });

    this.speechRecognizer.onEnd()
      .subscribe(data => {
        this.recognizing = false;
        let element = document.getElementById('microphone-icon').className = 'fa fa-microphone microfono tooltip-container'
        this.updateiconVoiceSearch("voice-search", "Búsqueda por voz");
        this.detectChanges();
        this.notification = null;
      });

    this.speechRecognizer.onResult()
      .subscribe((data: SpeechNotification) => {
        const message = data.content.trim();
        if (data.info === 'final_transcript' && message.length > 0) {
          this.def = new FormControl(" " + `${message}`);
          this.searchText = `${message}`;
          //--sleep ??
          (async () => {
            await this.delay(1500);
            this.stopRecognizer()
          })();
          this.finalTranscript = `${this.finalTranscript}\n${message}`;
          this.actionContext.processMessage(message, this.currentLanguage);
          this.detectChanges();
          this.actionContext.runAction(message, this.currentLanguage);

          console.log(this.finalTranscript)
          console.log(`${message}`)
        }
      });

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
        this.detectChanges();
      });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stopRecognizer() {
    this.speechRecognizer.stop();
    this.buscar();
  }

  updateiconVoiceSearch(id, val) {
    document.getElementById(id).innerHTML = val
  }

  detectChanges() {
    this.changeDetector.detectChanges();
  }

  /**web speech end */

  constructor(
    private router: Router,
    private homeService: HomeService,
    public responseSearch: ResponseSearch,
    private changeDetector: ChangeDetectorRef,
    private speechRecognizer: SpeechRecognizerService
  ) {
    this.searchText = '';
  }
  keyword = 'title';
  selectEvent(item) {
    // do something with selected item
    this.searchText = item.title;
  }

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
    console.log('Esta es la busqueda ' + this.searchText);
    if (this.searchText === null && this.searchText === undefined) {
      this.searchText = '';
    }
    this.responseSearch.setResultados(this.textopredictivo);
    console.log('Este es el array', this.responseSearch.getResultados());
    this.router.navigate(['/search/' + this.searchText]);
  }
}

Swal.fire({
  title: '<h2>¿Deseas buscar un experto?</h2>',
  html:
  `Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, unde ex explicabo`,
  showCloseButton: true,
  showCancelButton: true,
  confirmButtonText:
    'Si',
  confirmButtonAriaLabel: 'Si',
  cancelButtonText:
    'No',
  cancelButtonAriaLabel: 'No',
})
