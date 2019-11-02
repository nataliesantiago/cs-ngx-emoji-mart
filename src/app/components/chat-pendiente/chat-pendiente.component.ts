import { Component, OnInit } from '@angular/core';
import { UserService } from '../../providers/user.service';
import { ChatService } from '../../providers/chat.service';
import { User } from '../../../schemas/user.schema';
import { MatDialogRef } from '@angular/material';
import { MotivoCierreChat } from '../../../schemas/interfaces';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { UtilsService } from '../../providers/utils.service';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-chat-pendiente',
  templateUrl: './chat-pendiente.component.html',
  styleUrls: ['./chat-pendiente.component.scss']
})
export class ChatPendienteComponent implements OnInit {

  user: User;
  hora_recordatorio;
  id_motivo_cierre: number;
  array_horas = [];
  myControl = new FormControl();
  options = [];
  filteredOptions: Observable<string[]>;
  constructor(private dialogRef: MatDialogRef<ChatPendienteComponent>, private userService: UserService, private chatServivce: ChatService, private utilsService: UtilsService) {
    this.user = this.userService.getUsuario();
    let codigo = 1200;
    let minutos = 0;
    let hora = moment(codigo, 'hmm').format('HH:mm');
    let tz = "am";
    this.array_horas.push(hora + tz);
    for (let i = 0; i < 95; i++) {
      minutos = minutos + 15;
      let envio = codigo + minutos;
      if (minutos == 60) {
        minutos = 0;
        codigo = codigo + 100;
        if (codigo == 1300) {
          codigo = 100;
        }
        if (codigo == 1200) {
          tz = "pm";
        }
        envio = codigo;
      }
      hora = moment(envio, 'hmm').format('HH:mm');
      this.array_horas.push(hora + ' ' + tz);
    }
    
  }

  ngOnInit() {

    this.options = this.array_horas;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    
  }

  private _filter(value: any): string[] {
    
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);

  }

  seleccionarHora(e){
    this.hora_recordatorio = e;    
  }

  cerrar(enviar: boolean) {
    if (enviar) {
      this.dialogRef.close({ hora_recordatorio: this.hora_recordatorio });
    } else {
      this.dialogRef.close();
    }
  }

  //conversacion - {{id_conversacion}} - {{nombre_cliente}}

}
