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
        let tmp = busqueda.toLowerCase().split(' ');
        // plainText = plainText.replace(palabra, '<b>' + palabra + '</b>');
        let snippet = plainText.toLowerCase().split(' ');
        let snippet_bk = plainText.split(' ');
        tmp.forEach(palabra => {
            let np = this.utils.normalizeText(palabra);
            for (let index = 0; index < snippet.length; index++) {
                let p = snippet[index];
                let n = this.utils.normalizeText(p);
                if (n.indexOf(np) == (0) || np.indexOf(n) == (0)) {
                    snippet[index] = '<b> ' + snippet_bk[index] + ' </b>'
                } else {
                    snippet[index] = snippet_bk[index];
                }
            }
        });
        return snippet.join(' ');
    }
}