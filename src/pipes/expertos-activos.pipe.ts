import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { UserService } from '../app/providers/user.service';
import { ChatService } from '../app/providers/chat.service';
const moment = _rollupMoment || _moment;
@Pipe({
    name: 'expertosActivos'
})
export class ExpertosActivosePipe implements PipeTransform {
    constructor(private userService: UserService, private chatService: ChatService) { }
    async transform(expertos: Array<any>, args?: any): Promise<any> {
        return new Promise((resolve, reject) => {

            expertos.filter(async e => {
                if (e.idtbl_usuario == this.userService.getUsuario().getId()) {
                    return false;
                }
                if (!e.ultima_conexion) {
                    return false;
                }
                var duration = moment().unix() - e.ultima_conexion.seconds;
                let chats = await this.chatService.getCollectionFirebase('expertos/' + e.id_usuario + '/chats');

                // console.log(duration, e);
                return e.activo && duration < 11;
            });
        });
    }
}