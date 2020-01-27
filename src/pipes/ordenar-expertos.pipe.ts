import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { Experto } from '../schemas/xhr.schema';
import { Conversacion } from '../schemas/conversacion.schema';
const moment = _rollupMoment || _moment;

@Pipe({
    name: 'ordenarExpertos',
    pure: false
})
export class OrdenarExpertosPipe implements PipeTransform {
    // adding a default value in case you don't want to pass the format then 'yyyy-MM-dd' will be used
    transform(expertos: Array<Experto>): Array<Experto> {
        if (expertos) {
            expertos = expertos.sort((a: Experto, b: Experto) => {
                if (a.conversacion_experto && b.conversacion_experto && a.conversacion_experto.ultimo_mensaje && b.conversacion_experto.ultimo_mensaje) {
                    if (a.conversacion_experto.ultimo_mensaje.fecha_mensaje > b.conversacion_experto.ultimo_mensaje.fecha_mensaje) {
                        return -1;
                    } else if (a.conversacion_experto.ultimo_mensaje.fecha_mensaje < b.conversacion_experto.ultimo_mensaje.fecha_mensaje) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else if (a.conversacion_experto && a.conversacion_experto.ultimo_mensaje && (!b.conversacion_experto || !b.conversacion_experto.ultimo_mensaje)) {
                    return -1;
                } else if (b.conversacion_experto && b.conversacion_experto.ultimo_mensaje && (!a.conversacion_experto || !a.conversacion_experto.ultimo_mensaje)) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
        // // console.log(expertos);
        return expertos;
    }
}