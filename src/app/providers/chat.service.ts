import { Injectable, Inject } from '@angular/core';
import { AjaxService } from './ajax.service';
import { Subject } from 'rxjs/Subject';
import { NgZone } from '@angular/core/';
import * as io from "socket.io-client";
declare let gapi: any;
import * as firebase from "firebase";
import * as uuid from 'uuid/v4';
import { User } from '../../schemas/user.schema';
import { UserService } from './user.service';
import { Conversacion } from '../../schemas/conversacion.schema';
import { reject } from 'q';
import { xhr, xhrConversaciones } from '../../schemas/xhr.schema';
import { emojis, EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { Mensaje } from '../../schemas/mensaje.schema';
import { AngularFirestore } from '@angular/fire/firestore';
import { resolve } from 'url';
const moment = _rollupMoment || _moment;

@Injectable()
export class ChatService {

  user: User;
  id_calendario: string;
  public socket: io.SocketIOClient.Socket;
  public subjectUsuario = new Subject<any>();
  public observableUsuario = this.subjectUsuario.asObservable();
  planeaciones_creadas = [];

  public subjectConversacion = new Subject<any>();
  public nuevasConversaciones = this.subjectConversacion.asObservable();

  chats_cliente: Array<Conversacion> = [];

  constructor(private ajax: AjaxService, private userService: UserService, private fireStore: AngularFirestore, private emojiService: EmojiService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      this.user = u;
    });
  }
  /**
   * @description Se encarga de buscar las conversaciones activas del cliente y las aloja en memoria ram para futuras consultas
   * @returns Promise
   */
  getConversacionesCLiente(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.user) {
        this.ajax.get('chat/conversacion/get', { id_usuario: this.user.getId() }).subscribe((d: xhrConversaciones) => {
          if (d.success) {
            this.chats_cliente = d.conversaciones;
            resolve(d.conversaciones);
          } else {
            reject();
          }
        });
      }
    })
  }
  /**
   * @description Asigna el experto al chat y abre la ventana de conversación
   * @param  {number} id_usuario
   * @param  {number} id_conversacion
   * @param  {string} codigo
   * @returns Promise
   */
  asignarUsuarioExperto(id_usuario: number, id_conversacion: number, codigo: string): Promise<User> {
    return new Promise((r, re) => {
      this.ajax.post('chat/conversacion/asignarExperto', { id_usuario: id_usuario, id_conversacion: id_conversacion, codigo }).subscribe(d => {
        if (d.success) {
          r(d.usuario);
        }
      });
    })
  }

  /**
   * @description Envía los mensajes desde el front hacia el back y el firestore
   * @param  {Mensaje} mensaje
   * @returns Promise
   */
  enviarMensaje(mensaje: Mensaje): Promise<any> {
    return new Promise((r, re) => {
      this.ajax.post('chat/conversacion/enviarMensaje', mensaje).subscribe(d => {
        if (d.success) {
          r(true);
        } else {
          reject();
        }
      });
    })
  }
  /**
   * @description Actualiza a estado 3 todos los mensajes recbidos de forma asyncrona
   * @param  {Array<Mensaje>} mensajes
   */
  cambiaEstadoMensajes(mensaje: Mensaje, c: Conversacion) {
    mensaje.estado = 3;
    this.fireStore.collection('conversaciones/' + c.codigo + '/mensajes').doc(mensaje.id).set(mensaje);
  }
  /**
   * @description Esta función se encarga de subir los archivos al servidor que se adjuntan en el chat
   * @param  {File} file
   * @returns Promise
   */
  adjuntarArchivosServidor(file: File): Promise<any> {
    return new Promise((resolve, re) => {
      const fd = new FormData();
      fd.append('archivo', file);
      this.ajax.postData('chat/adjuntarArchivo', fd).subscribe(d => {
        if (d.success) {
          resolve(d.archivo);
        } else {
          re();
        }
      })
    })
  }

  /**
   * @description Carga desde el servidor las configuracionesa asociadas al chat
   * @returns Promise
   */
  getConfiguracionesChat(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/getConfiguraciones', {}).subscribe(d => {
        if (d.success) {
          resolve(d.configuraciones);
        }
      })

    })
  }
  /**
   * @description Crea una conversación de un cliente segun una categoria(producto) y si tiene una busqueda asociada, dadon que ambos parámetros son opcionales funciona y bsuca todos los expertos disponibles en caso de que ningun parametro sea enviado
   * @param  {number} categoria?
   * @param  {number} id_busqueda?
   */
  crearConversacion(categoria?: number, id_busqueda?: number) {
    this.subjectConversacion.next({ id_producto: categoria, id_busqueda: id_busqueda });
  }

  usuarioEscribiendoConversacion(c: Conversacion) {
    if (c.timeout_escribiendo) {
      window.clearTimeout(c.timeout_escribiendo);
    }
    this.fireStore.doc('conversaciones/' + c.codigo + '/usuarios_escribiendo/' + this.user.getId()).set({ escribiendo: true, nombre: this.user.nombre, fecha: new Date() });
    c.timeout_escribiendo = setTimeout(() => {
      this.fireStore.doc('conversaciones/' + c.codigo + '/usuarios_escribiendo/' + this.user.getId()).delete();
    }, 4000);
  }

  usuarioDejaEscribir(c: Conversacion, id: number) {

    this.fireStore.doc('conversaciones/' + c.codigo + '/usuarios_escribiendo/' + id).delete();

  }

  findEmojiData(texto: string): string {
    if (texto) {
      let tmp = texto.split(' ');
      tmp.forEach((t, i) => {
        let a = this.emojiService.emojis.find(e => {
          return (e.text != "" && e.text == t);
        });
        if (a) {
          tmp[i] = '' + a.native;
        }
      });
      return tmp.join(' ');
    } else {
      return '';
    }
  }

}
