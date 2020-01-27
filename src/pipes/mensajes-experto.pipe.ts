import { Pipe, PipeTransform } from '@angular/core';
import { Mensaje } from '../schemas/mensaje.schema';

import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { UserService } from '../app/providers/user.service';
import { User } from '../schemas/user.schema';
const moment = _rollupMoment || _moment;
@Pipe({
  name: 'mensajesExperto',
  pure: false
})
export class MensajesExpertoPipe implements PipeTransform {
  user;
  expertos;
  constructor(private userService: UserService) {
    this.user = this.userService.getUsuario();
  }
  transform(mensajes: Array<Mensaje>, args?: Array<any>): any {

    this.expertos = args[1];
    if (mensajes)
      this.passByMensajes(args[0], mensajes, 0);
    //// console.log(mensajes);
    return mensajes;
  }

  async passByMensajes(tipo, mensajes: Array<Mensaje>, index: number, mensaje_anterior?: Mensaje) {
    if (tipo == 3) {
      let m = mensajes[index];
      if (m) {
        m.muestra_hora = true;
        index++;
        if (mensaje_anterior && m.id_usuario == mensaje_anterior.id_usuario) {
          let a = moment(mensaje_anterior.fecha_mensaje);
          let b = moment(m.fecha_mensaje);
          let minutes = a.diff(b, 'minutes');

          if (minutes == 0) {
            mensaje_anterior.muestra_hora = false;
            delete mensaje_anterior.user;
          }
        }
        this.passByMensajes(tipo, mensajes, index, m);
      }
    } else {
      let m = mensajes[index];
      if (m) {

        m.muestra_hora = true;
        if (m.id_usuario != this.user.getId()) {
          let experto = this.expertos.find((e: User) => {
            return e.idtbl_usuario == m.id_usuario;
          });
          if (experto) {
            m.user = experto;
            index++;
            if (mensaje_anterior && m.id_usuario == mensaje_anterior.id_usuario) {
              /*&& m.id_usuario == mensaje_anterior.id_usuario) {*/

              let a = moment(mensaje_anterior.fecha_mensaje);
              let b = moment(m.fecha_mensaje);
              let minutes = a.diff(b, 'minutes');
              if (minutes == 0) {
                mensaje_anterior.muestra_hora = false;
                delete mensaje_anterior.user;
              }
            }
            this.passByMensajes(tipo, mensajes, index, m);
          } else {
            // // console.log('buscando data idiota');
            let u = m.user = await this.userService.getInfoUsuario(m.id_usuario);
            this.expertos.push(u);
            index++;
            if (mensaje_anterior) {
              let a = moment(mensaje_anterior.fecha_mensaje);
              let b = moment(m.fecha_mensaje);
              let minutes = a.diff(b, 'minutes');

              if (minutes == 0) {
                mensaje_anterior.muestra_hora = false;
                delete mensaje_anterior.user;
              }
            }
            this.passByMensajes(tipo, mensajes, index, m);
          }
        } else {
          index++;
          if (mensaje_anterior && m.id_usuario == mensaje_anterior.id_usuario) {
            let a = moment(mensaje_anterior.fecha_mensaje);
            let b = moment(m.fecha_mensaje);
            let minutes = a.diff(b, 'minutes');

            if (minutes == 0) {
              mensaje_anterior.muestra_hora = false;
              delete mensaje_anterior.user;
            }
          }
          this.passByMensajes(tipo, mensajes, index, m);
        }
      }
    }
  }
}
