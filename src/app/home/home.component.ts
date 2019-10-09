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
import { SpeechRecognizerService } from "./web-speech/shared/services/speech-recognizer.service";

import { SpeechNotification } from "./web-speech/shared/model/speech-notification";
import { SpeechError } from "./web-speech/shared/model/speech-error";
import { ActionContext } from "./web-speech/shared/model/strategy/action-context";
import { AutenticationService } from "../services/autenticacion.service";
import { AjaxService } from '../providers/ajax.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { UserService } from '../providers/user.service';
import { environment } from '../../environments/environment';
import { User } from '../../schemas/user.schema';
import { LookFeelService } from '../providers/look-feel.service';


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

  texto_home = "";
  nuevos_contenidos = [];
  usuario;
  correo_usuario = "";
  validacion_pais_usuario = [];
  url: String = "";
  metodo = 1;
  public def = new FormControl(""); // Model del autocomplete
  searchText: string; // ngModel del autocomplete
  defaultSelectedNgAutocomplete: string;
  file: File; // guardar archivo para buscar
  myForm: FormControl; // form del autocomplete
  keyword = "title"; // reconoce el atributo del json para el autocomplete
  filteredOptions: Observable<any[]>; // guardar el resultado de las busquedas
  dataImage = [];
  textopredictivo: any = []; // guardar el texto predictivo de la api
  preguntasArray = [
    { id: 1, consulta: "Como crear mi cuenta corriente" },
    { id: 2, consulta: "Credito para mi casa nueva" },
    { id: 3, consulta: "Beneficios del banco" },
    { id: 4, consulta: "Davivienda desde tu celular" },
    { id: 5, consulta: "Cuenta de ahorro para pensionados" }
  ];
  busquedasArray = [
    { id: 1, busqueda: "¿Cuánto es el monto que puedo transferir?" },
    { id: 2, busqueda: "¿ cuál es mi clave virtual ?" },
    { id: 3, busqueda: "¿Cómo puedo presentar una queja o reclamo?" },
    { id: 4, busqueda: "¿como pedir un credito?" },
    { id: 5, busqueda: "Adelanto de dinero desde mi app" }
  ];
  textError = "no hay resultados"; // label del autocomplete

  /**web speech start */
  finalTranscript = ""; //valor final de el resultado del speech
  recognizing = false; //flag
  notification: string;
  languages: string[] = ["en-US", "es-CO"];
  currentLanguage = this.languages[1];
  actionContext: ActionContext = new ActionContext();
  ambiente = environment.ambiente;
  user: User;

  url_logo = "https://storage.cloud.google.com/archivos-estaticos-aplicacion-cam/logo.png";

  initRecognition() {
    this.speechRecognizer.setLanguage(this.currentLanguage);
    this.speechRecognizer.onStart().subscribe(data => {
      let element = document.getElementById("microphone-icon");
      element.className =
        "animated infinite heartBeat delay-1s fa fa-microphone microfono tooltip-container";
      this.recognizing = true;
      document.getElementById("voice-search").innerHTML =
        "Estoy Escuchando ...";
      this.notification = "I'm listening...";
      this.detectChanges();
    });

    this.speechRecognizer.onEnd().subscribe(data => {
      this.recognizing = false;
      let element = (document.getElementById("microphone-icon").className =
        "fa fa-microphone microfono tooltip-container");
      this.updateiconVoiceSearch("voice-search", "Búsqueda por voz");
      this.detectChanges();
      this.notification = null;
    });

    this.speechRecognizer.onResult().subscribe((data: SpeechNotification) => {
      const message = data.content.trim();
      if (data.info === "final_transcript" && message.length > 0) {
        this.def = new FormControl(" " + `${message}`);
        this.searchText = `${message}`;
        //--sleep ??
        (async () => {
          await this.delay(1500);
          this.stopRecognizer();
        })();
        this.finalTranscript = `${this.finalTranscript}\n${message}`;
        this.actionContext.processMessage(message, this.currentLanguage);
        this.detectChanges();
        this.actionContext.runAction(message, this.currentLanguage);

      }
    });

    this.speechRecognizer.onError().subscribe(data => {
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
  }

  updateiconVoiceSearch(id, val) {
    document.getElementById(id).innerHTML = val;
  }

  detectChanges() {
    this.changeDetector.detectChanges();
  }

  /**web speech end */

  constructor(
    private router: Router, private homeService: HomeService, public responseSearch: ResponseSearch, 
    private changeDetector: ChangeDetectorRef, private speechRecognizer: SpeechRecognizerService, private nzone: NgZone, private autenticationService: AutenticationService, 
    private ajax: AjaxService, private userService: UserService, private look_service: LookFeelService) {
    this.user = this.userService.getUsuario();
    if (this.user) {
      this.init();
    }
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
        this.init();
      }
    });
    this.searchText = "";
    this.responseSearch.setActiveMostrarBarra(false);


  }
  init() {
    this.ajax.get('administracion/obtener-texto-home', {}).subscribe(p => {
      if (p.success) {

        this.texto_home = p.item[0].valor;

      }
    });
    this.correo_usuario = this.user.getCorreo();
    this.validacion_pais_usuario = this.correo_usuario.split(".");
    this.correo_usuario = this.validacion_pais_usuario[(this.validacion_pais_usuario.length - 1)];
    this.ajax.get('preguntas/obtener-home', {}).subscribe(p => {
      if (p.success) {

        this.nuevos_contenidos = p.preguntas;

      }
    });

    this.look_service.getSpecificSetting('url_logo').then((result) => {
      this.url_logo = result[0].valor;  
      this.changeDetector.detectChanges();
    });
  }

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
     * @param  {} event captura el evento del input file
     *  Captura el file en un formdata para enviarlo al servicio y asigna el valor retornado de  la api
     * al input de busqueda para realizar el metodo de buscar()
  */
  onFileSelected(event) {
    this.metodo = 2;
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", this.file);
      this.homeService.searchFile(formData).subscribe(data => {
        debugger;
        this.dataImage = data.data.parrafos;
        this.url = data.data.url;
      });
    }
  }
  selectLabel(val: string, pos: number) {
    this.searchText = this.searchText + " " + val;
    this.dataImage.splice(pos, 1);
    this.def = new FormControl(" " + this.searchText);
  }


  /**web speech end */

  /**
    * @param  {} item item del json del autocomplete
    * asignar a la variable title a searchText
  */
  selectEvent(item) {
    this.metodo = 1;
    this.searchText = item.title;
  }
  /**
   * @param  {} val valor del item seleccionado
   * metodo de change del autocomplete
   */
  onChangeSearch(val: string) {
    this.searchText = val;
    this.homeService
      .autocompleteText(val)
      .subscribe(data => (this.textopredictivo = data.data));
  }
  ngOnInit(): void {
    /**speech recognizion */
    this.currentLanguage = this.languages[0];
    this.speechRecognizer.initialize(this.currentLanguage);
    this.initRecognition();
    this.notification = null;

    /**speech recognizion */
  }

  buscar(metodo) {
    if (this.searchText === null && this.searchText === undefined) {
      this.searchText = "";
    }
    this.responseSearch.setResultados(this.textopredictivo);
    var date = new Date();
    var fecha =
      date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    let obj = {
      idUsuario: 1,
      textoBusqueda: this.searchText,
      idTipoBusqueda: metodo,
      fechaBusqueda: fecha,
      url: this.url
    };
    this.router.navigate(['/search/' + this.searchText]);
    //this.homeService.guardarBusqueda(obj).subscribe(data =>{});
    this.nzone.run(() => this.stopRecognizer());
    this.stopRecognizer();

  }
  buscar2() {
    this.nzone.run(() => this.buscar(this.metodo));
  }
}
