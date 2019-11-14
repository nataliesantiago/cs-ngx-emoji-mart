import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';

@Injectable({
    providedIn: 'root'
})

export class FiltrosService {

    constructor(private ajax: AjaxService) {
      
    }

    /**
     * obtiene todos los estados que puede tener una pregunta
     */
    getQuestionStates(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.get('estado-pregunta/obtener', {}).subscribe(d => {
                if (d.success) {
                  resolve(d.estados_pregunta);
                }
            });
        });
    }

    /**
     * obtiene todos los tipos de busqueda que se pueden realizar
     */
    getSearchType(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.get('user/obtener-tipos-busqueda', {}).subscribe(r => {
                if (r.success) {
                  resolve(r.item);
                }
            });
        });
    }

    /**
     * obtiene todos los tipos de encuestas 
     */
    getSurveyType(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.get('encuestas/obtener-tipo', { tipo: 1 }).subscribe(d => {
                if (d.success) {
                  resolve(d.tipo);
                }
              })
        });
    }

    /**
     * obtiene todos los estados de cierre que puede tener una conversacion
     */
    getConversationStates(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.get('historial-chats/obtener-estados-conversacion', { }).subscribe(d => {
                if (d.success) {
                  resolve(d.states);
                }
              })
        });
    }
}