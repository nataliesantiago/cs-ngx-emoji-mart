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
        let snippet = plainText.split(' ');
        let busqueda_array = busqueda.split(' ');
        for (let i = 0; i < snippet.length; i++) {
            let pa = this.utils.normalizeText(snippet[i]).toLocaleLowerCase();
            busqueda_array.forEach(palabra => {
                palabra = this.utils.normalizeText(palabra).toLocaleLowerCase();
                if (pa == palabra) {
                    // console.log('encuentra ', snippet[i]);
                    snippet[i] = '<b> ' + snippet[i] + ' </b>'
                } else if (pa.includes(palabra) && palabra.length > 3) {
                    snippet[i] = '<b> ' + snippet[i] + ' </b>'
                } else if (palabra.includes(pa) && pa.length > 3) {
                    snippet[i] = '<b> ' + snippet[i] + ' </b>'
                }
            })
        }

        /*
        let tmp = busqueda.toLowerCase().split(' ');
        // plainText = plainText.replace(palabra, '<b>' + palabra + '</b>');
        let snippet = plainText.toLowerCase().split(' ');
        let snippet_bk = plainText.split(' ');
        tmp.forEach(palabra => {

            let np = this.utils.normalizeText(palabra);

            for (let index = 0; index < snippet.length; index++) {
                let p = snippet[index];
                let n = this.utils.normalizeText(p).toLocaleLowerCase();
                // console.log('palabra ', palabra, np, n);
                if (n.includes(np) || np.includes(n)) {
                    console.log('encuentra ', palabra);
                    snippet[index] = '<b> ' + snippet_bk[index] + ' </b>'
                } else {
                    //snippet[index] = snippet_bk[index];
                }
            }
        });
        */

        return snippet.join(' ');
    }
}