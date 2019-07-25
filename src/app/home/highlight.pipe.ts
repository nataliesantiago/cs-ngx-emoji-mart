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
        for (let i = 0; i < arrayPalabras.length; i++) {
            list = list.replace(
                arrayPalabras[i], `<span style='font-weight:bold'>${arrayPalabras[i]}</span>` );
        }

        return this._sanitizer.bypassSecurityTrustHtml(list);
    }
}
