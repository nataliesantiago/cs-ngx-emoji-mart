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
  @ViewChild('end') end: MatSidenav;

  color_toolbar = '';
  muestra_barra: boolean = false;
  reason = '';
  muetra_alarmas_nlp = false;
  
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
    this.user.observablePanelNotificaciones.subscribe(abrir => {
      if (abrir) {
        this.end.open();
        this.leerNotificaciones();
        this.actualizarNotificaciones();
      } else {
        this.end.close();
      }
    })
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

  actualizarNotificaciones() {
    this.notificacionService.obtenerNotificacionesAntiguas(this.id_usuario).then(r => {
      this.notificaciones_usuario = r;
    });

    this.user.observableNotificaciones.subscribe(() => {

      this.notificaciones_usuario_nuevas = this.user.notificaciones_usuario;
      this.notificaicones_sin_leer = this.user.notificaciones_sin_leer;
      
    });

  }

  init() {
    let t = this.usuario.modulos.find(m => {
      return m.idtbl_modulo == 27;
    })
    if (t) {
      this.muetra_alarmas_nlp = true;
    }
    
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

    this.user.actualizarMensajesNLP().then(r => {
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
   * detecta cambios en el reconocimiento de voz como la seleccion de lenguaje
   */
  detectChanges() {
    this.changeDetector.detectChanges();
  }


  ngOnInit(): void {
    /**speech recognizion */

    /**speech recognizion */
  }



  cerrarMenu() {
    this.sidenav.close();
  }

  consolaSupervisor(e) {
    this.user.leerMensajeNLP(e.idtbl_notificacion_mensaje_nlp).then(r => {
      this.user.actualizarMensajesNLP().then(r => {
        this.conversaciones_nlp = r;
        this.router.navigate(['/consola-supervisor/' + e.idtbl_conversacion]);
      });
    });
  }

}
