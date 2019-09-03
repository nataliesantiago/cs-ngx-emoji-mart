import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { Mensaje } from '../schemas/mensaje.schema';
const moment = _rollupMoment || _moment;
@Pipe({ name: 'mensajeCliente' })
export class MensajeClientePipe implements PipeTransform {
    transform(value: Array<Mensaje>): Mensaje {
        return value.pop(); 
    }
}