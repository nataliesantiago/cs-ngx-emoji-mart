import { Injectable } from '@angular/core';

@Injectable()
export class ResponseSearch {
    _resultados: [];
    
    setResultados(val: any) {
        this._resultados = val;
    }

    getResultados(): any {
        return this._resultados;
    }
}
