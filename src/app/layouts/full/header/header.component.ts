import { Component, Inject } from '@angular/core';
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

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {

  profileImage = '../../../../assets/images/users/profle.svg';
  estados_operador = [{ id: 1, nombre: 'Activo' }, { id: 2, nombre: 'Inactivo' }];
  user: User;
  intervalo: any;
  puede_cerrar_sos = false;
  creando_emergencia = false;
  escuchando_emergencia = false;
  emergencia_actual = false;
  is_dark_mode;
  modo_nocturno;

  constructor(private userService: UserService, private chatService: ChatService, private dialog: MatDialog, private fireStore: AngularFirestore,
    private snackBar: MatSnackBar, private sonidosService: SonidosService, @Inject(DOCUMENT) private _document: HTMLDocument) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe((u: User) => {
      if (u) {
        console.log(u)
        this.user = u;
        this.profileImage = u.url_foto;
        this.init();
      }
    });


    if (this.user) {
      this.profileImage = this.userService.getUsuario().url_foto;
      this.init();

      if (this.user.getModoNocturno() == 0 || this.user.getModoNocturno() == null) {
        this.is_dark_mode = 0;
      } else {
        this.is_dark_mode = this.user.getModoNocturno();
      }

    }
    this.chatService.getEmergenciaUsuario().then(emergencia => {
      // console.log(emergencia);
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

  init() {
    this.chatService.getEstadosExperto().then(estados => {
      this.estados_operador = estados;
      if (this.user.getIdRol() == 2) {
        this.cambiarEstadoExperto({ value: 1 });
      }
      if (this.user.getIdRol() == 3) {
        this.user.estado_experto = 1;
        this.cambiarEstadoExperto({ value: this.user.estado_experto });
      }
    });
  }

  cambiarEstadoExperto(e) {
    //debugger;
    if (this.intervalo) {
      //window.clearInterval(this.intervalo);
      let activo = (e.value == 1) ? true : false;
      this.userService.setActivoExperto(activo);
    } else {
      let activo = (e.value == 1) ? true : false;
      this.userService.setActivoExperto(activo);
      this.intervalo = setInterval(() => {
        let activo = (this.user.estado_experto == 1) ? true : false;
        this.userService.setActivoExperto(activo);

      }, 10000);

      if (this.user.getIdRol() == 2) {
        this.listenEmergenciaExperto();
      }
    }
    this.userService.setActivoExpertoGlobal(e.value);
  }

  listenEmergenciaExperto() {
    if (!this.escuchando_emergencia) {
      this.escuchando_emergencia = true;
      this.fireStore.doc('expertos/' + this.user.getId() + '/emergencia/1').valueChanges().subscribe((d: any) => {
        // console.log(d);
        if (d) {
          this.emergencia_actual = true;
          this.sonidosService.sonar(3);
          this.mostrarSnack(d);
          this.user.estado_experto = 7;
          this.cambiarEstadoExperto({ value: this.user.estado_experto })
        } else {
          this.emergencia_actual = false;
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
    } else {
      this._document.body.classList.remove('dark-theme');
      this.modo_nocturno = 0;
    }
    this.userService.actualizarModoNocturno(this.modo_nocturno).then(result => {
    });
  }


}
