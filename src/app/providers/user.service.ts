import { Injectable, Inject } from '@angular/core';
import { AjaxService } from './ajax.service';
import { User } from '../../schemas/user.schema';

import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from '@angular/fire/auth';
import * as io from "socket.io-client";
declare let gapi: any;
import * as firebase from "firebase";
import * as uuid from 'uuid/v4';
import { ThrowStmt } from '@angular/compiler';
import { xhrFilasExperto } from '../../schemas/xhr.schema';
import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { SonidosService } from './sonidos.service';
import { NotificacionService } from './notificacion.service';

@Injectable()
export class UserService {

    user: User;
    notificaciones_usuario = [];
    notificaciones_sin_leer: number = 0;
    subjectNotificaciones = new Subject<any>();
    observableNotificaciones = this.subjectNotificaciones.asObservable();
    id_calendario: string;
    public socket: io.SocketIOClient.Socket;
    public subjectUsuario = new Subject<any>();
    public observableUsuario = this.subjectUsuario.asObservable();
    subjectEstadoExperto = new Subject<any>();
    public observableEstadoExperto = this.subjectEstadoExperto.asObservable();
    planeaciones_creadas = [];
    SCOKET_IP;
    conectado_socket = false;
    dataBase;
    ref;
    este;
    mensajes_nlp = [];
    cantidad_mensajes_sin_leer_nlp = 0;
    respuesta_nlp;
    cant_mensajes_actuales = 0;
    cant_notificaciones_sin_leer = 0;
    primera_vez_notificacion = true;
    public panelNotificacionesSubject = new Subject<any>();
    public observablePanelNotificaciones = this.panelNotificacionesSubject.asObservable();

    constructor(private ajax: AjaxService, private fireStore: AngularFirestore, private firebaseAuth: AngularFireAuth, private afMessaging: AngularFireMessaging, private soundService: SonidosService) {

        this.ajax.sethost(environment.URL_BACK); // Desarrollo
        //this.ajax.sethost('https://davivienda-comunidades-col-dev.appspot.com/api/');
        window.onbeforeunload = () => {
            if (this.user && this.user.getIdRol() == 2) {
                this.setActivoExperto(false);
            }
        };
        window.onunload = () => {
            if (this.user && this.user.getIdRol() == 2) {
                this.setActivoExperto(false);
            }
        };


    }



    isMobile() {
        var check = false;

        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
        return check;
    }

    joinRoomSocket(email) {
        //this.socket.emit('join-room', { email: email });
        var config = {
            apiKey: "AIzaSyB8YQqLDtom0dWM9LJsX8uNAGrS4LZXlcE",
            authDomain: "maci-dev.firebaseapp.com",
            databaseURL: "https://maci-dev.firebaseio.com",
            projectId: "maci-dev",
            storageBucket: "maci-dev.appspot.com",
            messagingSenderId: "696877102697"
        };
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        let messaging = firebase.messaging();
        messaging.onMessage((payload: any) => {

            if (this.planeaciones_creadas.indexOf(payload.data.id_planeacion) == (-1)) {
                this.planeaciones_creadas.push(payload.data.id_planeacion);

            }

            // ...
        });
        messaging.requestPermission()
            .then(() => {

                // TODO(developer): Retrieve an Instance ID token for use with FCM.
                // ...
                messaging.getToken()
                    .then((currentToken) => {
                        if (currentToken) {
                            //sendTokenToServer(currentToken);
                            //updateUIForPushEnabled(currentToken);
                            this.enviarToeknServidor(currentToken);
                        } else {
                            // Show permission request.

                            // Show permission UI.
                            //updateUIForPushPermissionRequired();
                            //setTokenSentToServer(false);
                        }
                    })
                    .catch(function (err) {

                        //showToken('Error retrieving Instance ID token. ', err);
                        // setTokenSentToServer(false);
                    });
                messaging.onTokenRefresh(() => {
                    messaging.getToken()
                        .then((refreshedToken) => {

                            this.enviarToeknServidor(refreshedToken);
                            // Indicate that the new Instance ID token has not yet been sent to the
                            // app server.
                            // setTokenSentToServer(false);
                            // Send Instance ID token to app server.
                            //sendTokenToServer(refreshedToken);
                            // ...
                        })
                        .catch(function (err) {

                            //showToken('Unable to retrieve refreshed token ', err);
                        });
                });



            })
            .catch(function (err) {

            });

    }

    initFirebase(): Promise<any> {
        return new Promise((res, rej) => {
            this.firebaseAuth.auth.signInWithEmailAndPassword(this.user.getEmail(), this.user.pass_firebase).then(() => {
                this.requestPermission();
                res();
            }).catch(error => {
                // Handle Errors here.
                console.log('Invalid login firebase');
                rej();
            });
        });

    }



    validarUsuario(primer_login: boolean) {
        let t = localStorage.getItem('token');
        return this.ajax.post('user/validar', { primer_login: primer_login, token: t });
    }

    getModulosUsuario(u: User) {
        return this.ajax.get('user/modulos', { usuario: u });
    }

    cambiarVista() {

    }

    irPendiente() {

    }

    irLogin() {

    }

    setUsuario(u: User): Promise<any> {
        return new Promise((resolve, reject) => {
            this.user = u;
            //localStorage.setItem('user', JSON.stringify(u));
            if (u) {
                //this.initializeSocket();
                this.initFirebase().then(() => {
                    resolve();
                    this.subjectUsuario.next(u);
                });
            }
        });

    }



    getUsuario(): User {
        return this.user;
    }

    logOut() {

        delete this.ref;
        delete this.user;
        this.subjectUsuario.next(null);
        window.localStorage.removeItem('tk');

    }



    isLogedIn() {
        return true;
    }

    enviarToeknServidor(token) {
        this.ajax.post('usuario/firebase/actualiza-token', { id_usuario: this.user.idtbl_usuario, token: token }).subscribe(data => {

        });
    }

    loadProfile(token) {
        this.ajax.get('user/profile/get', { token: token }).subscribe(d => {
            let user = new User(d.profile.email, token, d.profile.nombre);
            user.url_foto = d.profile.foto;
            this.setUsuario(user);
        })
    }

    setProfile(profile, token) {
        let user = new User(profile.email, token, profile.nombre);
        user.url_foto = profile.foto;
        this.setUsuario(user);
    }


    getFilasExperto(): Promise<any> {
        return new Promise((resolve, reject) => {


            this.ajax.get('user/experto/getFilas', { id_usuario: this.user.getId() }).subscribe((d: xhrFilasExperto) => {
                if (d.success) {
                    this.user.filas = d.filas;
                    this.user.filas.forEach(f => {
                        let r = this.fireStore.collection('expertos').doc('' + this.user.getId()).ref;
                        this.fireStore.collection('categorias_experticia/' + f.id_categoria_experticia + '/expertos').doc('' + this.user.getId()).set({ experto: r });
                    });
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    setActivoExperto(activo) {
        this.user.experto_activo = activo;
        //console.log(activo)
        this.fireStore.collection('expertos').doc('' + this.user.getId()).set({ activo: activo, fecha: new Date() });
    }

    setActivoExpertoGlobal(estado: number) {
        this.user.estado_experto = estado;
        this.subjectEstadoExperto.next(estado);
        //console.log(activo)
        //this.fireStore.collection('expertos').doc('' + this.user.getId()).set({ activo: activo, fecha: new Date() });
    }

    getInfoUsuario(id): Promise<User> {
        return new Promise((r, re) => {
            this.ajax.get('user/getInfo', { id_usuario: id }).subscribe(d => {
                if (d.success) {
                    r(d.usuario);
                }
            });
        })
    }

    requestPermission() {
        this.afMessaging.requestPermission
            .pipe(mergeMapTo(this.afMessaging.tokenChanges))
            .subscribe(
                (token) => {
                    this.listen();
                    this.ajax.post('user/setFirebaseToken', { token: token, user: this.user }).subscribe(d => {
                        if (d.success) {

                        }
                    });

                },
                (error) => { console.error("Error de firebase mesagging", error); },
            );
    }

    listen() {
        // console.log(this.user.getIdRol());

        this.actualizarTodo();

        if (this.respuesta_nlp && this.respuesta_nlp[1]) {
            this.cant_mensajes_actuales = this.respuesta_nlp[1].length;
        }
        if (this.notificaciones_sin_leer) {
            this.cant_notificaciones_sin_leer = this.notificaciones_sin_leer;
        }

        this.afMessaging.messages
            .subscribe((message) => {
                this.actualizarTodo();
            });
        document.addEventListener('visibilitychange', (() => {
            this.actualizarTodo();
        }))
    }


    actualizarTodo() {
        this.actualizarMensajesNLP().then(() => {
            this.actualizarNotificaciones().then(r => {
                if (this.cant_mensajes_actuales < this.respuesta_nlp[1].length || this.cant_notificaciones_sin_leer < this.notificaciones_sin_leer) {
                    if (!this.primera_vez_notificacion) {
                        this.soundService.sonar(4);
                    }
                }
                this.cant_mensajes_actuales = this.respuesta_nlp[1].length;
                this.cant_notificaciones_sin_leer = this.notificaciones_sin_leer;
                this.primera_vez_notificacion = false;
                this.subjectNotificaciones.next();
            });
        });
    }


    actualizarMensajesNLP(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.get('chat/obtenerConversacionesNLP').subscribe(d => {
                this.respuesta_nlp = d.conversaciones;
                resolve(d.conversaciones);
            });
        });
    }

    obtenerNotificacionesUsuario(id_usuario: number): Promise<any> {
        return new Promise((resolve, reject) => {

            this.ajax.get('notificacion/obtener-notificaciones-usuario', { id_usuario: id_usuario }).subscribe(d => {
                if (d.success) {
                    this.notificaciones_usuario = d.notificaciones[0];
                    this.notificaciones_sin_leer = d.notificaciones[1].length;
                    this.subjectNotificaciones.next(1);
                    resolve(d.notificaciones);
                } else {
                    reject();
                }
            });

        })
    }


    actualizarNotificaciones(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.obtenerNotificacionesUsuario(this.user.idtbl_usuario).then(r => {
                resolve(r);
            })
        })
    }


    obtenerListaEmpleados(): Promise<any> {
        return new Promise((resolve, reject) => {

            this.ajax.get('user/obtener-todos', {}).subscribe(d => {
                if (d.success) {
                    resolve(d.usuario);
                } else {
                    reject();
                }
            });

        })
    }

    /**
     * funcion para actualizar el modo nocturno dependiendo el usuario
     * @param valor 
     */
    actualizarModoNocturno(valor) {
        return new Promise((resolve, reject) => {
            this.ajax.post('user/editar-modo-nocturno', { valor: valor, id_usuario: this.user.getId() }).subscribe(d => {
                if (d.success) {
                    resolve(d.setting)
                } else {
                    reject();
                }
            });
        });
    }


    getAllUsers() {
        return new Promise((resolve, reject) => {
            this.ajax.get('user/obtener-usuarios').subscribe(p => {
                if (p.success) {
                    resolve(p.usuarios);
                } else {
                    reject();
                }
            })
        });
    }


    getUsuarioEditar(id_usuario) {
        return new Promise((resolve, reject) => {
            this.ajax.get('user/obtener-usuario-editar', { id_usuario: id_usuario }).subscribe(p => {
                if (p.success) {
                    resolve(p.usuario);
                } else {
                    reject();
                }
            })
        })
    }

    getPerfilesUsuario() {
        return new Promise((resolve, reject) => {
            this.ajax.get('user/obtener-perfiles').subscribe(p => {
                if (p.success) {
                    resolve(p.perfiles);
                } else {
                    reject();
                }
            })
        })
    }

    getRolesUsuario() {
        return new Promise((resolve, reject) => {
            this.ajax.get('user/obtener-roles').subscribe(p => {
                if (p.success) {
                    resolve(p.roles);
                } else {
                    reject();
                }
            })
        })
    }

    editarUsuario(datos_usuario: any, id_usuario_editar: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.post('user/editar-usuario', { datos_usuario: datos_usuario, id_usuario_editar: id_usuario_editar }).subscribe(p => {
                if (p.success) {
                    resolve(p.roles);
                } else {
                    reject();
                }
            })
        });
    }

    sendEmailChat(info_correo): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.post('email/enviar-correo', { info_correo }).subscribe(d => {
                //console.log(d);
                //console.log(d);
                if (d) {
                    resolve(d);
                }
            })
        });
    }

    leerMensajeNLP(id_mensaje): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.post('chat/leerMensajeNLP', { id_mensaje: id_mensaje }).subscribe(d => {
                this.mensajes_nlp = d.conversaciones;
                resolve(d.conversaciones);
            });
        })
    }


    enviarPesos(usuarios, peso_todos): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ajax.post('user/editar-pesos', { usuarios: usuarios, peso_todos: peso_todos }).subscribe(d => {
                resolve(d);
            });
        });
    }

    obtenerHistorialBusquedas(id_usuario: number): Promise<any>{
        return new Promise((resolve, reject) => {
            this.ajax.get('user/obtener-historial-busquedas', { id_usuario: id_usuario }).subscribe(d => {
                resolve(d.busquedas);
            })
        })
    }

}
