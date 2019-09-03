import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GibberishAES from 'dz-gibberish-aes/dist/gibberish-aes-1.0.0.js';
import { Subject } from 'rxjs/Rx';

/**
 * @description Clase que encapsula todas las peticiones http y otorga la posibilidad de encriptar la data
 */
@Injectable()
export class AjaxService {

    host: string = environment.URL_BACK; // URL base del API
    private modoDebug: boolean = false; // Definir si hace logs o no
    private enckey: string = "p2=5DT^lvk7/JbvCP^J_!o#*~I[TH"; // Clave de encriptado/desencriptado 
    private usingEnc = false; // Para configurar si se debe o no encriptar toda la data
    private token: string; // Token del usuario que va en todas las peticiones
    private csrftk: string;
    constructor(private $http: HttpClient) {
        this.$http = $http;
        let t = window.localStorage.getItem('tk');
        if (t) {
            this.token = window.localStorage.getItem('tk');
        }
    }

    /**
     * @description Almacena el token a nivel de aplicacion para utilizarlo en las peticiones http
     * @param {string} tk - El token de la sesión unica
     */
    setcsrf(tk: string) {
        this.csrftk = tk;
    }


    /**
     * @description Obtiene el token de la sesión
     * @returns {string} token
     */
    getcsrf() {
        return this.csrftk;
    }

    /** 
     * @description Se encarga de definir la URL base para todas las peticiones http
     * @param  {string} value - URL base
     */
    sethost(value: string) {
        this.host = value;
    }


    /**
     * @description Almacena el token del usuario a nivel de aplicación
     * @param  {string} t - Token del usuario
     */
    setToken(t: string) {
        this.token = btoa(GibberishAES.enc(t, this.enckey));
        window.localStorage.setItem('tk', this.token);
    }
    /**
     * @description Decide si se activa o no el modo debug
     * @param  {boolean} value
     */
    setDebbug(value: boolean) {
        this.modoDebug = value;
    }
    /**
     * @description Llave de encriptacion global
     * @param  {string} value
     */
    setKey(value: string) {
        this.enckey = value;
    }

    /**
     * @description Método para establecer si se debe usar la encriptación true,false
     * @param  {boolean} use
     */
    setUseEnc(use: boolean) {
        this.usingEnc = use;
    }


    /**
     * @description Encapsula todas las peticiones GET de la aplicación
     * @param  {string} ruta Endpoint especifico
     * @param  {any} params - Payload de la petición
     * @returns {Observable<any>} Observable 
     */
    get(ruta: string, params?: any): Observable<any> {
        if (!params) {
            params = {};
        }
        let parametros: HttpParams = new HttpParams();

        if (this.modoDebug) {
            
        }
        params.access_token = this.token;
        parametros = parametros.append('data', (JSON.stringify(params)));
        parametros = parametros.append('encrypt', '0');
        parametros = parametros.append('csrftk', this.csrftk);
        let obs: Observable<any> = this.$http.get(this.host + ruta, { params: parametros });

        return obs;

    }

    /**
     * @description Encapsula todas las peticiones POST de la aplicación
     * @param  {string} ruta - Endpoint especifico
     * @param  {any} params - Payload de la petición
     * @returns {Observable<any>} Observable 
     */
    post(ruta: string, params: any): Observable</*Comment*/any> {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        if (this.modoDebug) {
            
        }
        let data: any = {};
        data.encrypt = this.usingEnc;
        params.access_token = this.token;
        data.csrftk = this.csrftk;
        data.data = params;
        let obs = this.$http.post(this.host + ruta, (data), { headers: headers }).catch((error: any) => Observable.throw(error || 'Error procesando la solicitud'));

        return obs;

    }

    /**
     * @description Encapsula todas las peticiones POST de la aplicación
     * @param  {string} ruta - Endpoint especifico
     * @param  {any} params - Payload de la petición
     * @returns {Observable<any>} Observable 
     */
    postData(ruta: string, params: FormData): Observable</*Comment*/any> {
        let headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data' });

        if (this.modoDebug) {
            
        }
        let data: any = {};
        data.encrypt = this.usingEnc;
        params.append('access_token', this.token);
        data.csrftk = this.csrftk;
        data.data = params;
        params.append('data', data);
        let obs = this.$http.post(this.host + ruta, params).catch((error: any) => Observable.throw(error || 'Error procesando la solicitud'));
        return obs;

    }
    /**
     * @description Encripta datos segun una clave en AES256
     * @param  {string} message
     * @param  {string} password
     */
    encrypt(message: string, password: string) {
        let cipher: string = GibberishAES.enc(message, password);
        return cipher;
    }
    /**
     * @description Descencripta datos según una clave en AES256
     * @param  {string} cipherTextJson
     * @param  {string} password
     */
    decrypt(cipherTextJson: string, password: string) {
        let text: string = GibberishAES.decrypt(cipherTextJson, password);
        return text;
    }

}
