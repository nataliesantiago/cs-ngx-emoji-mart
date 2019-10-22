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
                if (response.success) {
                    resolve(response.states);
                } else {
                    reject(response.error);
                }
            })
        });
    }

    createState(state): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.post('estado-experto/crear-estado', {state: state}).subscribe(response => {
                if (response.success) {
                    resolve(response.state);
                } else {
                    reject(response.error);
                }
            })
        });
    }

    updateState(state): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.post('estado-experto/actualizar-estado', {state: state}).subscribe(response => {
                if (response.success) {
                    resolve(response.state);
                } else {
                    reject(response.error);
                }
            })
        });
    }
    
    deleteState(id_usuario_modificador, idtbl_estado_experto): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.post('estado-experto/eliminar-estado', {id_usuario_modificador: id_usuario_modificador, idtbl_estado_experto: idtbl_estado_experto}).subscribe(response => {
                if (response.success) {
                    resolve(response.state);
                } else {
                    reject(response.error);
                }
            })
        });
    }

    createLogState(state): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.post('estado-experto/crear-log-estado', {state: state}).subscribe(response => {
                if (response.success) {
                    resolve(response.state);
                } else {
                    reject(response.error);
                }
            })
        });
    }

}
