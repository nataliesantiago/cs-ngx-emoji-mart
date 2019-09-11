import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { UserService } from '../app/providers/user.service';
const moment = _rollupMoment || _moment;
@Pipe({
    name: 'expertosActivos'
})
export class ExpertosActivosePipe implements PipeTransform {
    constructor(private userService: UserService) { }
    transform(expertos: Array<any>, args?: any): any {


        return expertos.filter(e => {
            if (e.idtbl_usuario == this.userService.getUsuario().getId()) {
                return false;
            }
            if (!e.ultima_conexion) {
                return false;
            }
            var duration = moment().unix() - e.ultima_conexion.seconds;
            // console.log(duration, e);
            return e.activo && duration < 11;
        });
    }
}