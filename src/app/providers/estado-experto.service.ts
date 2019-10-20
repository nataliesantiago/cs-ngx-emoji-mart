import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { UserService } from './user.service';
import { ShortCut, MensajeAutomatico } from '../../schemas/interfaces';

@Injectable({
    providedIn: 'root'
})
export class EstadoExpertoService {
    
    user;

    constructor(private ajax: AjaxService, private userService: UserService) {
        this.user = this.userService.getUsuario();
        this.userService.observableUsuario.subscribe(u => {
            this.user = u;
        });
    }

    getAllStates(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.get('estado-experto/obtener-estados', {}).subscribe(response => {
                console.log(response);
                
                if (response.success) {
                    resolve(response.states);
                } else {
                    reject(response.error);
                }
            })
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

    
    

}
