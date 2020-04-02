import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { UserService } from '../app/providers/user.service';
import { ChatService } from '../app/providers/chat.service';
import { AjaxService } from '../app/providers/ajax.service';
const moment = _rollupMoment || _moment;
@Pipe({
    name: 'expertosActivos'
})
export class ExpertosActivosePipe implements PipeTransform {
    constructor(private userService: UserService, private chatService: ChatService, private ajax: AjaxService) { }
    transform(expertos: Array<any>, args?: any): any {

        let pais = this.ajax.pais;
        let tz = 'America/Bogota';
        if (pais != 'col' && pais != 'pan') {
            tz = 'America/Tegucigalpa';
        }
        // console.log(tz);
        return expertos.filter(e => {
            if (e.idtbl_usuario == this.userService.getUsuario().getId()) {
                return false;
            }
            if (!e.ultima_conexion) {
                return false;
            }
            var duration = moment().tz(tz).unix() - e.ultima_conexion.seconds;
            // // console.log(duration, e);
            return e.activo && duration < 30;
        });
    }
}