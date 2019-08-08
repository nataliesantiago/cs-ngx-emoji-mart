import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

constructor(private _sanitizer: DomSanitizer) { }

    transform(list: any, searchText: string) {
        if (!list) { return []; }
        if (!searchText) { return list; }
        const arrayPalabras = searchText.split(' ');
        debugger;
        for (let i = 0; i < arrayPalabras.length; i++) {
            let format = this.formatCaracter(list);
            format.toLowerCase();

            format = format.replace(
                arrayPalabras[i].toLowerCase(), `<span style='font-weight:bold'>${arrayPalabras[i].toLowerCase()}</span>` );

            for (let j = 0; j < list.split('').length; j++) {
                
            }
        }

        return this._sanitizer.bypassSecurityTrustHtml(list);
    }
    formatCaracter(str): string {
        const from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
            to   = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc',
            mapping = {};

        for (let i = 0, j = from.length; i < j; i++ ) {
            mapping[ from.charAt( i ) ] = to.charAt( i );
        }
        const ret = [];
        for ( let i = 0, j = str.length; i < j; i++ ) {
            const c = str.charAt( i );
            if ( mapping.hasOwnProperty( str.charAt( i ) ) ) {
                ret.push( mapping[ c ] );
            } else {
                ret.push( c );
            }
        }
        return ret.join( '' );
    }
}
