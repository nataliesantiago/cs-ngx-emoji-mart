import { Injectable } from '@angular/core';

@Injectable()
export class ResponseSearch {
    _resultados: [];

    _mostrar: boolean = false;

    _mostrarBarra: boolean = false;

    _historial = [
        { id: 1, time: '2018-08-11 17:25:30.0', busqueda: 'Hola juan', tipoBusqueda: 'texto', url: 'www.notiene.com' },
        { id: 2, time: '2018-08-12 17:25:30.0', busqueda: 'Hola camilo', tipoBusqueda: 'voz', url: 'www.notiene.com' },
        { id: 3, time: '2018-08-13 17:25:30.0', busqueda: 'Peras', tipoBusqueda: 'imagen', url: 'www.notiene.com' },
        { id: 4, time: '2018-08-13 17:40:30.0', busqueda: 'manzanas', tipoBusqueda: 'voz', url: 'www.notiene.com' },
        { id: 5, time: '2018-08-14 17:25:30.0', busqueda: 'frutas', tipoBusqueda: 'imagen', url: 'www.notiene.com' },
        { id: 6, time: '2018-08-15 17:25:30.0', busqueda: 'botellas', tipoBusqueda: 'texto', url: 'www.notiene.com' },
        { id: 7, time: '2018-08-16 17:25:30.0', busqueda: 'ron', tipoBusqueda: 'voz', url: 'www.notiene.com' },
        { id: 8, time: '2018-08-17 17:25:30.0', busqueda: 'aguardiente', tipoBusqueda: 'imagen', url: 'www.notiene.com' },
        { id: 9, time: '2018-08-18 17:25:30.0', busqueda: 'wisky', tipoBusqueda: 'texto', url: 'www.notiene.com' },
        { id: 10, time: '2018-08-19 17:25:30.0', busqueda: 'vodka', tipoBusqueda: 'voz', url: 'www.notiene.com' },
    ];

    setResultados(val: any) {
        this._resultados = val;
    }

    getResultados(): any {
        return this._resultados;
    }

    setActive(val: boolean) {
        this._mostrar = val;
    }

    isActive() {
        return this._mostrar;
    }

    setActiveMostrarBarra(val: boolean) {
        this._mostrarBarra = val;
    }

    isActiveMostrarBarra() {
        return this._mostrarBarra;
    }
}
