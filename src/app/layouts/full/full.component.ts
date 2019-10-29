import * as $ from 'jquery';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ChangeDetectorRef, Component, NgZone, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { Observable } from 'rxjs';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HomeService } from '../../services/home.service';
import { ResponseSearch } from '../../models/response-search';
import { SpeechRecognizerService } from '../../home/web-speech/shared/services/speech-recognizer.service';
import { SpeechNotification } from '../../home/web-speech/shared/model/speech-notification';
import { SpeechError } from '../../home/web-speech/shared/model/speech-error';
import { ActionContext } from '../../home/web-speech/shared/model/strategy/action-context';
import { MatSidenav } from '@angular/material';
import { UserService } from '../../providers/user.service';
import { NotificacionService } from '../../providers/notificacion.service';
import { LookFeelService } from '../../providers/look-feel.service';
import { User } from '../../../schemas/user.schema';

/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: ['full.component.scss']
})
export class FullComponent implements OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  dir = 'ltr';
  green: boolean;
  blue: boolean;
  dark: boolean;
  minisidebar: boolean;
  boxed: boolean;
  danger: boolean;
  showHide: boolean;
  sidebarOpened;
  usuario: User;
  id_usuario;
  notificaciones_usuario = [];
  notificaicones_sin_leer;
  notificaciones_usuario_nuevas = [];
  conversaciones_nlp = [];
  mensajes_sin_leer_nlp;

  public config: PerfectScrollbarConfigInterface = {};
  private _mobileQueryListener: () => void;
  url: String = '';
  metodo = 1;
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

  /**web speech start */
  finalTranscript = ''; //valor final de el resultado del speech
  recognizing = false; //flag 
  notification: string;
  languages: string[] = ['en-US', 'es-CO'];
  currentLanguage = this.languages[1];
  actionContext: ActionContext = new ActionContext();
  textError = 'no hay resultados'; // label del autocomplete
  @ViewChild('snav') sidenav: MatSidenav;

  color_toolbar = '';
  muestra_barra: boolean = false;
  reason = '';
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private router: Router,
    private homeService: HomeService,
    public responseSearch: ResponseSearch,
    private changeDetector: ChangeDetectorRef,
    private speechRecognizer: SpeechRecognizerService,
    private nzone: NgZone,
    private user: UserService,
    private notificacionService: NotificacionService,
    private look_service: LookFeelService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.searchText = '';
    this.usuario = this.user.getUsuario();
    if (this.usuario) {
      this.id_usuario = this.usuario.idtbl_usuario;
      this.init();
    }
    this.user.observableUsuario.subscribe(u => {
      this.usuario = u;
      this.id_usuario = u.idtbl_usuario;
      if (this.usuario) {
        this.init();
      }
    });
   /* this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        if (val.url.indexOf('/search/') == 0) {
          // console.log('estoy en donde quiero');
          this.muestra_barra = true;
        } else {
          this.muestra_barra == false;
        }
      }
    });*/
  }

  init() {
    if (this.usuario.getModoNocturno() == 0 || this.usuario.getModoNocturno() == null) {
      this.look_service.getSpecificSetting('color_barra_superior').then((result) => {
        if (result && result[0] && result[0].valor) {
          this.color_toolbar = result[0].valor;
        }
      });
    } else {
      this.look_service.getSpecificSetting('color_barra_oscuro').then((result) => {
        if (result && result[0] && result[0].valor) {
          this.color_toolbar = result[0].valor;
        }
      });
    }

    this.notificacionService.obtenerNotificacionesAntiguas(this.id_usuario).then(r => {
      this.notificaciones_usuario = r;      
    });

    this.user.actualizarMensajesNLP().then( r => {
      this.conversaciones_nlp = r;      
    });

    this.user.observableNotificaciones.subscribe(() => {

      this.notificaciones_usuario_nuevas = this.user.notificaciones_usuario;
      this.notificaicones_sin_leer = this.user.notificaciones_sin_leer;      
      this.conversaciones_nlp = this.user.respuesta_nlp;
      //this.mensajes_sin_leer_nlp = this.user.cantidad_mensajes_sin_leer_nlp;
    });
  }

  leerNotificaciones() {

    this.notificaicones_sin_leer = 0;

    this.notificacionService.leerNotificaciones(this.id_usuario).then(() => { })

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() {
    // This is for the topbar search
    (<any>$('.srh-btn, .cl-srh-btn')).on('click', function () {
      (<any>$('.app-search')).toggle(200);
    });
    // This is for the megamenu
  }
  close(reason: string) {
    this.reason = reason;

    this.sidenav.close();
  }
  irHome() {
    this.router.navigate(['home']);
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
    this.metodo = 2;
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', this.file);
      this.homeService.searchFile(formData).subscribe((data) => {
        debugger;
        this.dataImage = data.data.parrafos;
        this.url = data.data.url;
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
      this.buscar(3);
    })();
  }

  /**
   * Actualiza el mensaje de ayuda para el icono de reconocimiento de voz por medio del id del elemento 
   * @param id id del elemento
   * @param val valor para el elemento seleccionado
   */
  updateiconVoiceSearch(id, val) {
    document.getElementById(id).innerHTML = val;
  }

  /**
   * detecta cambios en el reconocimiento de voz como la seleccion de lenguaje
   */
  detectChanges() {
    this.changeDetector.detectChanges();
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

  buscar(metodo) {

    if (this.searchText === null && this.searchText === undefined) {
      this.searchText = '';
    }
    this.responseSearch.setResultados(this.textopredictivo);

    let obj = {
      "idUsuario": 1,
      "textoBusqueda": this.searchText,
      "idTipoBusqueda": metodo,
      "fechaBusqueda": "2012-11-04",
      "url": this.url
    };
    this.homeService.guardarBusqueda(obj).subscribe(data => { });
    this.router.navigate(['/search/' + this.searchText]);
  }
  buscar2() {
    this.nzone.run(() => this.buscar(this.metodo));
  }

  cerrarMenu() {
    this.sidenav.close();
  }

  consolaSupervisor(e){
    console.log(e.idtbl_notificacion_mensaje_nlp);
    this.user.leerMensajeNLP(e.idtbl_notificacion_mensaje_nlp).then( r => {
      this.user.actualizarMensajesNLP().then( r => {
        this.conversaciones_nlp = r;        
        this.router.navigate(['/consola-supervisor']);
      });
    });    
  }

}
