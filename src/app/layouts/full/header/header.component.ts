import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { UserService } from '../../../providers/user.service';
import { User } from '../../../../schemas/user.schema';
import { ChatService } from '../../../providers/chat.service';
import swal from 'sweetalert2';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Experto } from '../../../../schemas/xhr.schema';
import { SosComponent } from '../../../components/sos/sos.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { SosOperadorComponent } from '../../../components/sos-operador/sos-operador.component';
import { SonidosService } from '../../../providers/sonidos.service';
import { DOCUMENT } from '@angular/platform-browser';
import { EstadoExpertoService } from '../../../providers/estado-experto.service';
import { LookFeelService } from '../../../providers/look-feel.service';
import { LogEstadoExperto } from '../../../../schemas/interfaces';
import { environment } from '../../../../environments/environment';
import { AjaxService } from '../../../providers/ajax.service';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {

  profileImage = '../../../../assets/images/users/profle.svg';
  estados_operador;
  user: User;
  intervalo: any;
  puede_cerrar_sos = false;
  creando_emergencia = false;
  escuchando_emergencia = false;
  emergencia_actual = false;
  is_dark_mode;
  modo_nocturno;
  state: LogEstadoExperto = { id_usuario_experto: null, id_estado_experto_actual: null, id_estado_experto_nuevo: null, estado_ingreso: null };
  muestra_boton_sos: boolean;
  paisActual = "";
  correo_usuario = "";
  validacion_pais_usuario = [];
  ambiente = environment.ambiente;
  perfil_usuario;

  constructor(private userService: UserService, private chatService: ChatService, private dialog: MatDialog, private fireStore: AngularFirestore,
    private snackBar: MatSnackBar, private sonidosService: SonidosService, @Inject(DOCUMENT) private _document: HTMLDocument,
    private estadoExpertoService: EstadoExpertoService, private look_service: LookFeelService, private ajax: AjaxService, private changeDetector: ChangeDetectorRef, private router: Router) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe((u: User) => {
      if (u) {
        this.user = u;
        this.paisActual = this.user.pais;
        this.perfil_usuario = this.user.id_rol;
        this.profileImage = u.url_foto;
        this.init();
      }
    });


    if (this.user) {
      this.profileImage = this.userService.getUsuario().url_foto;
      this.paisActual = this.user.pais;
      this.perfil_usuario = this.user.id_rol;
      this.init();

      if (this.user.getModoNocturno() == 0 || this.user.getModoNocturno() == null) {
        this.is_dark_mode = 0;
      } else {
        this.is_dark_mode = this.user.getModoNocturno();
      }

    }


    this.getAllStates();
  }

  init() {

    if (this.user.boton_sos_perfil && this.user.boton_sos_rol) {
      this.muestra_boton_sos = true;
    }
    if (this.user.getIdRol() == 2 || this.user.getIdRol() == 3) {
      this.chatService.getEstadosExperto().then(estados => {
        this.estados_operador = estados;
        if (this.user.getIdRol() == 2) {
          this.cambiarEstadoExperto({ value: 1 });
          this.user.estado_actual = 1;
        }
        if (this.user.getIdRol() == 3) {
          this.user.estado_actual = 1;

          this.cambiarEstadoExperto({ value: this.user.estado_actual });
        }
      });
    }
    this.chatService.getEmergenciaUsuario().then(emergencia => {
      // // console.log(emergencia);
      if (emergencia) {
        let exito = (emergencia.id_usuario_operador) ? true : false;
        this.dialog.open(SosComponent, { disableClose: true, data: { exito: exito } }).afterClosed().subscribe((result) => {
          this.creando_emergencia = false;
          if (result && result.success) {

          }
        });
      }
    });
  }

  cambiarEstadoExperto(e) {
    //debugger;    

    let actual = this.user.estado_actual;
    this.user.estado_actual = e.value;
    if (this.intervalo) {
      //window.clearInterval(this.intervalo);
      let activo = (e.value == 1) ? true : false;
      this.userService.setActivoExperto(activo, this.user.estado_actual, this.emergencia_actual);
    } else {
      let activo = (e.value == 1) ? true : false;
      if (activo) {
        this.createLogState(1, 1, 1);
      }
      this.userService.setActivoExperto(activo, this.user.estado_actual, this.emergencia_actual);
      this.intervalo = setInterval(() => {
        let activo = (this.user.estado_actual == 1) ? true : false;
        console.log('estado', activo, this.user.estado_actual);
        this.userService.setActivoExperto(activo, this.user.estado_actual, this.emergencia_actual);
      }, 5000);

      if (this.user.getIdRol() == 2) {
        this.listenEmergenciaExperto();
      }
    }
    this.userService.setActivoExpertoGlobal(e.value);
    if (actual != null) {
      this.createLogState(actual, e.value, null);
    }
    this.user.setEstadoExpertoActual(e.value);
  }

  listenEmergenciaExperto() {
    if (!this.escuchando_emergencia) {
      this.escuchando_emergencia = true;
      this.fireStore.doc('paises/' + this.user.pais + '/' + 'expertos/' + this.user.getId() + '/emergencia/1').valueChanges().subscribe((d: any) => {
        // // console.log(d);
        if (d) {
          this.emergencia_actual = true;
          this.sonidosService.sonar(3);
          this.mostrarSnack(d);
          this.user.estado_actual = 7;
          this.cambiarEstadoExperto({ value: this.user.estado_actual })
        } else {
          this.emergencia_actual = false;
          this.user.estado_actual = 1;
          this.cambiarEstadoExperto({ value: this.user.estado_actual })
        }
      });
    }
  }

  mostrarSnack(d: any) {
    this.snackBar.open('Emergencia en curso', 'Abrir', { duration: 100000 * 1000000, panelClass: 'snack-emergencia', verticalPosition: 'top' }).onAction().subscribe(() => {
      this.dialog.open(SosOperadorComponent, { data: { id_emergencia: d.id_emergencia } }).afterClosed().subscribe(result => {
        if (result && result.cerrar) {
          this.snackBar.dismiss();
        } else {
          this.mostrarSnack(d);
        }
      });
    })
  }

  public config: PerfectScrollbarConfigInterface = {};
  // This is for Notifications
  notifications: Object[] = [

  ];

  // This is for Mymessages
  mymessages: Object[] = [
  ];
  abrirChat() {
    this.chatService.crearConversacion();
  }

  emergenciaSOS() {
    this.creando_emergencia = true;
    this.chatService.crearSOS().then(exito => {
      this.dialog.open(SosComponent, { disableClose: true, data: { exito: exito } }).afterClosed().subscribe((result) => {
        this.creando_emergencia = false;
        if (result && result.success) {

        }
      });
    });
  }

  cambioModoNocturno(event) {
    if (event.target.checked) {
      this._document.body.classList.add('dark-theme');
      this.modo_nocturno = 1;
      this.look_service.getSpecificSetting('color_barra_oscuro').then((result) => {
        if (result && result[0] && result[0].valor) {
          this._document.getElementById('toolbar_conecta').style.backgroundColor = result[0].valor;
          if (this._document.getElementById('color_toolbar')) {
            this._document.getElementById('color_toolbar').style.backgroundColor = result[0].valor;
          }
        }
      });
    } else {
      this._document.body.classList.remove('dark-theme');
      this.modo_nocturno = 0;
      this.look_service.getSpecificSetting('color_barra_superior').then((result) => {
        if (result && result[0] && result[0].valor) {
          this._document.getElementById('toolbar_conecta').style.backgroundColor = result[0].valor;
          if (this._document.getElementById('color_toolbar')) {
            this._document.getElementById('color_toolbar').style.backgroundColor = result[0].valor;
          }
        }
      });
    }
    this.userService.actualizarModoNocturno(this.modo_nocturno).then(result => {
    });
  }

  getAllStates() {
    this.estadoExpertoService.getAllStates().then(result => {

      this.estados_operador = result;
    });
  }

  createLogState(id_estado_actual: number, id_estado_nuevo: number, estado_ingreso?: number) {
    this.state.id_usuario_experto = this.user.getId();
    this.state.id_estado_experto_actual = id_estado_actual;
    this.state.id_estado_experto_nuevo = id_estado_nuevo;
    this.state.estado_ingreso = estado_ingreso
    this.estadoExpertoService.createLogState(this.state).then(result => {
    });
  }

  cambiarPais(pais) {
    this.user.pais = pais;
    this.ajax.pais = pais;
    localStorage.setItem('pais', pais);
    this.changeDetector.detectChanges();
    this.userService.actualizarSuperAdminCam(this.user.codigo_firebase, this.user.pass_firebase).then(d => {
      if (d.success) {
        this.user.setId(d.profile.idtbl_usuario);
        this.router.navigate(['/home']);
      }
    });
  }

}
