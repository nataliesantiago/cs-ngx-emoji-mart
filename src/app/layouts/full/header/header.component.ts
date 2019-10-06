import { Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { UserService } from '../../../providers/user.service';
import { User } from '../../../../schemas/user.schema';
import { ChatService } from '../../../providers/chat.service';
import swal from 'sweetalert2';
import { MatDialog } from '@angular/material';
import { Experto } from '../../../../schemas/xhr.schema';
import { SosComponent } from '../../../components/sos/sos.component';
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
  constructor(private userService: UserService, private chatService: ChatService, private dialog: MatDialog) {
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
