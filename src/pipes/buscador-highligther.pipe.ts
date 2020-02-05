import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from '../app/providers/utils.service';



@Pipe({ name: 'buscadorhightlight' })
export class BuscadorHightlighter implements PipeTransform {
    constructor(protected sanitizer: DomSanitizer, private utils: UtilsService) { }
    transform(link: string, busqueda: string): string {
        return this.linkify(link, busqueda);
    }

    private linkify(plainText: string, busqueda: string): string {
        if (!plainText) {
            return '';
        }
        let tmp = busqueda.split(' ');
        // plainText = plainText.replace(palabra, '<b>' + palabra + '</b>');
        let snippet = plainText.split(' ');
        tmp.forEach(palabra => {
            let np = this.utils.normalizeText(palabra);
            for (let index = 0; index < snippet.length; index++) {
                let p = snippet[index];
                let n = this.utils.normalizeText(p);
                if (n.indexOf(np) == (0) || np.indexOf(n) == (0)) {
                    snippet[index] = '<b> ' + p + ' </b>'
                }
            }
        });
        return snippet.join(' ');
    }
}