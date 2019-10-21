import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { UserService } from './user.service';
import { ShortCut, MensajeAutomatico } from '../../schemas/interfaces';

@Injectable({
    providedIn: 'root'
})
export class MensajeAutomaticoService {
    
    user;

    constructor(private ajax: AjaxService, private userService: UserService) {
        this.user = this.userService.getUsuario();
        this.userService.observableUsuario.subscribe(u => {
            this.user = u;
        });
    }

    createMessage(message: MensajeAutomatico): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.post('mensaje-automatico/guardar-mensaje', {message: message}).subscribe(response => {
                if (response.success) {
                    resolve(response.message);
                } else {
                    reject(response.error);
                }
            })
        });
    }

    getAllMessagesWithType(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.get('mensaje-automatico/obtener-mensajes-tipo', {}).subscribe(response => {
                if (response.success) {
                    resolve(response.messages);
                } else {
                    reject(response.error);
                }
            })
        });
    }

    getMessageType(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.get('mensaje-automatico/obtener-tipo', { }).subscribe(response => {
                if (response.success) {
                    resolve(response.message_type);
                } else {
                    reject();
                }
            })
        });
    }

    updateMessage(message: MensajeAutomatico): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.post('mensaje-automatico/editar-mensaje', {message: message}).subscribe(response => {
                if (response.success) {
                    resolve(response.message);
                } else {
                    reject(response.error);
                }
            })
        });
    }

    inactiveMessage(message_id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.post('mensaje-automatico/eliminar-mensaje', { user_id: this.user.getId(), message_id: message_id }).subscribe(d => {
                if (d.success) {
                    resolve(d.id);
                } else {
                    reject();
                }
            })
        });
    }

    activeMessage(message): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.post('mensaje-automatico/activar-mensaje', { message: message }).subscribe(d => {
                if (d.success) {
                    resolve(d.id);
                } else {
                    reject();
                }
            })
        });
    }

}
