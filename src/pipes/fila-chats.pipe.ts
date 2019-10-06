import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { Conversacion } from '../schemas/conversacion.schema';
import { UtilsService } from '../app/providers/utils.service';
import { Configuracion } from '../schemas/interfaces';
const moment = _rollupMoment || _moment;
@Pipe({
    name: 'filaChats',
    pure: false
})

export class FilaChatsPipe implements PipeTransform {
    timer: any;
    constructor(private utilsService: UtilsService) { }
    transform(conversaciones: Array<Conversacion>, args?: any): any {
        /*let setUnico: Set<Conversacion> = new Set(conversaciones);
        conversaciones = Array.from(setUnico);*/
        conversaciones = this.utilsService.getUnique(conversaciones, 'codigo');
        //console.log(conversaciones);
        return conversaciones;
    }
}