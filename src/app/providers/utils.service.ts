import { Injectable } from "@angular/core";
import { AjaxService } from "./ajax.service";


@Injectable()
export class UtilsService {
    configuraciones: Array<any>;
    constructor(private ajax: AjaxService) {
        this.getConfiguraciones();
    }


    normalizeText(str: string): string {
        var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
            to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
            mapping = {};

        for (var i = 0, j = from.length; i < j; i++)
            mapping[from.charAt(i)] = to.charAt(i);


        var ret = [];
        for (var i = 0, j = str.length; i < j; i++) {
            var c = str.charAt(i);
            if (mapping.hasOwnProperty(str.charAt(i)))
                ret.push(mapping[c]);
            else
                ret.push(c);
        }
        return ret.join('');

    }

    getUnique(arr: Array<any>, comp: string): Array<any> {

        const unique = arr
            .map(e => e[comp])

            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)

            // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);

        return unique;
    }

    /**
   * @description Carga desde el servidor las configuracionesa asociadas al chat
   * @returns Promise
   */
    getConfiguraciones(recarga?: boolean): Promise<any> {

        return new Promise((resolve, reject) => {
            if (recarga) {
                this.ajax.get('administracion/obtener', {}).subscribe(d => {
                    if (d.success) {
                        this.configuraciones = d.items;
                        resolve(this.configuraciones);
                    }
                });
            } else
                if (this.configuraciones) {
                    resolve(this.configuraciones);
                } else {
                    this.ajax.get('administracion/obtener', {}).subscribe(d => {
                        if (d.success) {
                            this.configuraciones = d.items;
                            resolve(this.configuraciones);
                        }
                    });
                }
        })
    }


}