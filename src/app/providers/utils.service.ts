import { Injectable } from "@angular/core";
import { AjaxService } from "./ajax.service";
import { Configuracion } from "../../schemas/interfaces";
import { text } from "@angular/core/src/render3";
import { UserService } from "./user.service";
import { User } from "../../schemas/user.schema";
import { environment } from '../../environments/environment';
import { AngularFirestore } from "@angular/fire/firestore";

declare let gapi: any;
declare let google: any;

@Injectable()
export class UtilsService {
    configuraciones: Array<any>;
    palabras_clave_pregunta = ['quien', 'quien', 'que', 'donde', 'cuando', 'como', 'cual', 'cuanto', 'cuantas'];
    user: User;
    developerKey = environment.APIKEY;
    clientId = environment.CLIENT_ID;
    appId = environment.APPID;
    scope = ['https://www.googleapis.com/auth/drive.file'];
    pickerApiLoaded = false;
    oauthToken;
    public sendkey: string = environment.enckey;
    constructor(private ajax: AjaxService, private userService: UserService, private fireStore: AngularFirestore) {
        this.user = this.userService.getUsuario();
        this.userService.observableUsuario.subscribe(u => {
            this.user = u;
            if (u) {
                
                this.getConfiguraciones();
            }
        });
        if (this.user) {
            
            this.getConfiguraciones();
        }
       

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

        return new Promise(async (resolve, reject) => {

           

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


    /**
     * @description Esta función se encarga de buscar una configuración según su ID
     * @param  {number} id
     * @returns Configuracion
     */
    buscarConfiguracion(id: number | string): Configuracion {
        return this.configuraciones.find((c: Configuracion) => {
            return c.idtbl_configuracion === id || c.nombre === id;
        });
    }
    /**
     * @param  {Array<any>} options
     * @param  {string} value
     * @param  {string} option
     * @returns string
     */
    filter(options: Array<any>, value: string, option: string): string[] {
        //console.log(options, value);
        if (value && typeof value == 'string') {
            const filterValue = value.toLowerCase();
            return options.filter(fila => fila[option].toLowerCase().indexOf(filterValue) != (-1));
        } else {
            return options;
        }

    }

    /**
     * @description Codifica caracteres html en codigos raros
     * @param {string} str Input text
     * @return {string} Filtered text
     */
    htmlencode(str): string {

        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /**
     * @description Decodifica caracteres en codigo html
     * @param  {string} str
     * @returns string
     */
    htmldecode(str): string {

        var txt = document.createElement('textarea');
        txt.innerHTML = str;
        return txt.value;
    }
    /**
     * @description Determina si un texto es una pregunta
     * @param  {string} texto
     * @returns Promise
     */
    async identificarPreguntaTexto(texto: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!texto) {
                reject('Texto no válido');
            } else {
                if (texto.indexOf('?') != -1) {
                    resolve(true);
                } else {
                    let tmp = texto.split(' ');
                    for (let index = 0; index < tmp.length; index++) {
                        const palabra = tmp[index];
                        tmp[index] = this.normalizeText(palabra);
                    }
                    texto = tmp.join(' ');
                    for (let p of this.palabras_clave_pregunta) {
                        if (texto.indexOf(p) != -1) {
                            resolve(true);
                            return;
                        }
                    }
                    resolve(false);
                }
            }
        });
    }

    loadPicker(resolve) {
        //gapi.load('auth', { 'callback': this.onAuthApiLoad });
        gapi.load('picker', { 'callback': () => { this.onPickerApiLoad(resolve) } });
    }

    onPickerApiLoad(resolve) {

        this.pickerApiLoaded = true;
        this.createPicker(resolve);
    }


    abrirPickerDrive(): Promise<any> {
        return new Promise(resolve => {
            this.ajax.post('user/getAccessToken', { token: this.user.token_acceso }).subscribe(d => {
                if (d.success) {
                    this.oauthToken = d.token;
                    console.log(this.oauthToken);
                    if (this.pickerApiLoaded) {
                        this.createPicker(resolve);
                    } else {
                        this.loadPicker(resolve);
                    }
                }
            })
        });

    }

    // Create and render a Picker object for searching images.
    createPicker(resolve) {
        if (this.pickerApiLoaded && this.oauthToken) {

            var view = new google.picker.View(google.picker.ViewId.DOCS);
            //view.setMimeTypes("*");
            var picker = new google.picker.PickerBuilder()
                .enableFeature(google.picker.Feature.NAV_HIDDEN)
                .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
                .setAppId(this.appId)
                .setOAuthToken(this.oauthToken)
                .addView(view)
                .addView(new google.picker.DocsUploadView())
                .setDeveloperKey(this.developerKey)
                .setCallback((data) => { this.pickerCallback(data, resolve) })
                .build();
            picker.setVisible(true);
        }
    }

    // A simple callback implementation.
    pickerCallback(data, resolve) {
        if (data.action == google.picker.Action.PICKED) {

            resolve(data.docs[0]);
        }
    }


    /**
     * @description Se encarga de traer la llave de crifrado desde firebase
     * @returns Promise
     */
    async getCipherKey(): Promise<any> {
        return new Promise((res, rej) => {
            this.fireStore.doc('paises/parametros').valueChanges().subscribe((d: any) => {
                //console.log(d);
                res(d.sendkey);
            })
        });
    }

}