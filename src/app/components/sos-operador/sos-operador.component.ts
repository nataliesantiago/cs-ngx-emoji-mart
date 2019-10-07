import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChatService } from '../../providers/chat.service';
import { UserService } from '../../providers/user.service';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
const moment = _rollupMoment || _moment;
import { Emergencia } from '../../../schemas/interfaces';
import { User } from '../../../schemas/user.schema';



@Component({
  selector: 'app-sos-operador',
  templateUrl: './sos-operador.component.html',
  styleUrls: ['./sos-operador.component.scss']
})
export class SosOperadorComponent implements OnInit {
  puede_cerrar_sos = false;
  user;
  emergencia: Emergencia;
  cliente: User;
  motivo: string;
  constructor(private dialogRef: MatDialogRef<SosOperadorComponent>, private chatService: ChatService, private userService: UserService, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.user = this.userService.getUsuario();
    this.chatService.getEmergencia(this.data.id_emergencia).then((e: Emergencia) => {
      this.emergencia = e;
      setInterval(() => {
        let diff = moment().diff(moment(e.fecha_emergencia), 'seconds');
        if (diff > 120) {
          this.puede_cerrar_sos = true;
        }
      }, 1000)
      this.userService.getInfoUsuario(e.id_usuario_emergencia).then(u => {
        this.cliente = u;
      })
    });
  }

  ngOnInit() {

  }
  cerrarEmergencia() {
    this.chatService.cerrarEmergenciaOperador(this.emergencia.idtbl_consultas_sos, this.motivo).then(() => {
      this.dialogRef.close({ cerrar: true });
    });
  }
}
