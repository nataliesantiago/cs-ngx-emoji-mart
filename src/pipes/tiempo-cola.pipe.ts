import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { Conversacion } from '../schemas/conversacion.schema';
import { UtilsService } from '../app/providers/utils.service';
import { Configuracion } from '../schemas/interfaces';
const moment = _rollupMoment || _moment;
@Pipe({
    name: 'tiempoCola',
    pure: false
})

export class TiempoColaPipe implements PipeTransform {
    timer: any;
    constructor(private utilsService: UtilsService) { }
    transform(conversaciones: Array<Conversacion>, args?: any): any {
        if (this.timer) {
            window.clearInterval(this.timer);
        }
        conversaciones.forEach(c => {
            if (c.id_estado_conversacion == 1) {
                this.utilsService.getConfiguraciones().then(c => {
                    let tiempo_cola = c.configuraciones.find((c: Configuracion) => {
                        return c.idtbl_configuracion == 6;
                    });
                    this.timer = setInterval(() => {
                        let duration = moment().diff(moment(c.fecha_creacion), 'seconds');
                        console.log(duration);
                        if (duration > (tiempo_cola * 60)) {
                            c.tiempo_cola = true;
                        }
                    }, 1000);
                });
            }
        });


        return conversaciones;
    }
}