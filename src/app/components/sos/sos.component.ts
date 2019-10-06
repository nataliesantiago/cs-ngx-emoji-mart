import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ChatService } from '../../providers/chat.service';
import { UserService } from '../../providers/user.service';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
const moment = _rollupMoment || _moment;
import { Emergencia } from '../../../schemas/interfaces';

interface sosData {
  exito: boolean;

}

@Component({
  selector: 'app-sos',
  templateUrl: './sos.component.html',
  styleUrls: ['./sos.component.scss']
})
export class SosComponent implements OnInit {
  puede_cerrar_sos = false;
  user;
  emergencia: Emergencia;
  constructor(private dialogRef: MatDialogRef<SosComponent>, private chatService: ChatService, private userService: UserService, @Inject(MAT_DIALOG_DATA) private data: sosData) {
    this.user = this.userService.getUsuario();
  }

  ngOnInit() {
    if (!this.data.exito) {
      this.puede_cerrar_sos = true;
    } else {
      this.chatService.getEmergenciaUsuario().then(emergencia => {
        // console.log(emergencia);
        this.emergencia = emergencia;
        setInterval(() => {
          let diff = moment().diff(moment(emergencia.fecha_emergencia), 'seconds');
          if (diff > 120) {
            this.puede_cerrar_sos = true;
          }
        }, 1000)
      });
    }
  }
  cerrarEmergencia() {
    this.chatService.cerrarEmergenciaUsuario(this.emergencia.idtbl_consultas_sos).then(() => {
      this.dialogRef.close();
    });
  }
}
