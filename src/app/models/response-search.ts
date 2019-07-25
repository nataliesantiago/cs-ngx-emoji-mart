export class ResponseSearch {
    _resultados: [];

    /* private _resultados = [
        {
            id: 1, categoria: 'aperturas', origen: 'drive', titulo: "Como crear mi cuenta corriente", descripcion: 'Abrir una cuenta bancaria no es una operaci�n complicada. Bien en las propias sucursales, bien a trav�s de internet, contratar estos productos b�sicos en las finanzas personales es realmente sencillo aunque, es cierto que deberemos seguir unos pasos para realizar la contrataci�n de manera correcta. Las cuentas bancarias son el instrumento de uso cotidiano m�s proximo al usuario de a pie.Se trata de productos con los que mantenemos una relaci�n constante y que no deben ser contratados a la ligera.', imagen: 'assets/davivienda.png'
        },
        { id: 2, categoria: 'creditos', origen: 'word', titulo: "Credito para mi casa nueva", descripcion: 'Hogares colombianos que deseen adquirir una vivienda urbana nueva en Colombia y que cumplan con las siguientes caracter�sticas', imagen: null },
    ]; */

    setResultados(val: any) {
        this._resultados = val;
    }

    getResultados(): any {
        return this._resultados;
    }
}
