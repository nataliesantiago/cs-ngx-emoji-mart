import { Component } from '@angular/core';
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
  constructor(private userService: UserService, private chatService: ChatService, private dialog: MatDialog, private fireStore: AngularFirestore, private snackBar: MatSnackBar, private sonidosService: SonidosService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe((u: User) => {

      if (u) {
        this.user = u;
        this.profileImage = u.url_foto;
        if (this.user.getIdRol() == 2) {
          this.cambiarEstadoExperto({ value: 1 });
        }
      }
    });
    if (this.userService.getUsuario()) {
      this.profileImage = this.userService.getUsuario().url_foto;
      if (this.user.getIdRol() == 2) {
        this.cambiarEstadoExperto({ value: 1 });
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

  cambiarEstadoExperto(e) {
    if (this.intervalo) {
      window.clearInterval(this.intervalo);
    }
    let activo = (e.value == 1) ? true : false;
    this.userService.setActivoExperto(activo);
    if (activo) {
      this.intervalo = setInterval(() => {
        this.userService.setActivoExperto(true);
      }, 10000);
    }

    this.listenEmergenciaExperto();
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
          this.user.estado_experto = 2;
          this.cambiarEstadoExperto({ value: 2 })
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




}
