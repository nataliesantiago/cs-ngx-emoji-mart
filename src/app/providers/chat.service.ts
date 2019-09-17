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
import { ExtensionArchivoChat, IntencionChat } from '../../schemas/interfaces';
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
  flac_encoder;
  chats_cliente: Array<Conversacion> = [];
  configuraciones_chat: any;
  extensiones_archivos = [];
  flac_ok: any;
  flacLength: any;
  flacBuffers: any;
  constructor(private ajax: AjaxService, private userService: UserService, private fireStore: AngularFirestore, private emojiService: EmojiService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      this.user = u;
    });
    this.getConfiguracionesChat();
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
  adjuntarArchivosServidor(file: File, es_nota?): Promise<any> {
    return new Promise((resolve, re) => {
      let tmp = file.name.split('.');
      let extension = tmp[tmp.length - 1];
      let extension_valida = false;
      if (!es_nota) {
        let mensaje;
        this.configuraciones_chat.extensiones.forEach((e: ExtensionArchivoChat) => {
          if (e.extension.toLowerCase() == extension.toLowerCase()) {

            if (file.size < (e.megabytes_maximos * 1024 * 1024)) {
              extension_valida = true;

            } else {
              mensaje = 'Los archivos .' + e.extension + ' deben tener un máximo de ' + e.megabytes_maximos + 'mb';

            }
          }
        });

        if (!extension_valida) {
          if (!mensaje) {
            mensaje = 'Solo se permiten archivos con las sextensiones: ' + this.extensiones_archivos.join(', ');;
          }
          re(mensaje);
        } else {
          const fd = new FormData();
          fd.append('archivo', file);
          this.ajax.postData('chat/adjuntarArchivo', fd).subscribe(d => {
            if (d.success) {
              resolve(d.archivo);
            } else {
              re();
            }
          });
        }
      } else {
        const fd = new FormData();
        fd.append('archivo', file);
        this.ajax.postData('chat/adjuntarArchivo', fd).subscribe(d => {
          if (d.success) {
            resolve(d.archivo);
          } else {
            re();
          }
        });
      }
    })
  }

  /**
   * @description Carga desde el servidor las configuracionesa asociadas al chat
   * @returns Promise
   */
  getConfiguracionesChat(recarga?: boolean): Promise<any> {

    return new Promise((resolve, reject) => {
      if (recarga) {
        this.ajax.get('chat/getConfiguraciones', {}).subscribe(d => {
          if (d.success) {
            this.configuraciones_chat = d;
            delete this.configuraciones_chat.success;
            this.extensiones_archivos = [];
            this.configuraciones_chat.extensiones.forEach(e => {
              this.extensiones_archivos.push(e.extension);
            });
            resolve(this.configuraciones_chat);
          }
        });
      } else
        if (this.configuraciones_chat) {
          resolve(this.configuraciones_chat);
        } else {
          this.ajax.get('chat/getConfiguraciones', {}).subscribe(d => {
            if (d.success) {
              this.configuraciones_chat = d;
              delete this.configuraciones_chat.success;
              this.extensiones_archivos = [];
              this.configuraciones_chat.extensiones.forEach(e => {
                this.extensiones_archivos.push(e.extension);
              });
              resolve(this.configuraciones_chat);
            }
          });
        }
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
  /**
   * @description Envia la notificación de escribiendo en una conversación
   * @param  {Conversacion} c
   */
  usuarioEscribiendoConversacion(c: Conversacion, tipo?: number) {
    if (!tipo) {
      tipo = 1;
    }
    if (c.timeout_escribiendo) {
      window.clearTimeout(c.timeout_escribiendo);
    }
    this.fireStore.doc('conversaciones/' + c.codigo + '/usuarios_escribiendo/' + this.user.getId()).set({ escribiendo: true, nombre: this.user.nombre, fecha: new Date(), tipo: tipo });
    c.timeout_escribiendo = setTimeout(() => {
      this.fireStore.doc('conversaciones/' + c.codigo + '/usuarios_escribiendo/' + this.user.getId()).delete();
    }, 4000);
  }
  /**
   * @description Retira la notificacion de escribiendo en una conversación segun el id del usuario
   * @param  {Conversacion} c
   * @param  {number} id Id del usuario
   */
  usuarioDejaEscribir(c: Conversacion, id: number) {

    this.fireStore.doc('conversaciones/' + c.codigo + '/usuarios_escribiendo/' + id).delete();

  }
  /**
   * @description Segun el texto introducido por el usuario busca el emoji correspondiente
   * @param  {string} texto
   * @returns string
   */
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
  /**
   * @description Agrega una nueva extensión en el chat para que se puedan ajuntar archivos de ese tipo
   * @param  {ExtensionArchivoChat} d
   * @returns Promise
   */
  crearExtensionArchivo(d: ExtensionArchivoChat): Promise<any> {
    return new Promise((res, rejec) => {
      this.ajax.post('chat/extensionesAdjuntos/crear', d).subscribe(data => {
        if (data.success) {
          res(data.id);
        } else {
          rejec();
        }
      })
    });

  }
  /**
   * @description Edita una extensión creada anteriormente
   * @param  {ExtensionArchivoChat} d
   * @returns Promise
   */
  editarExtension(d: ExtensionArchivoChat): Promise<any> {
    return new Promise((res, rejec) => {
      this.ajax.post('chat/extensionesAdjuntos/actualizar', d).subscribe(data => {
        if (data.success) {
          res(data.id);
        } else {
          rejec();
        }
      })
    });
  }

  /**
   * @description Obtiene las categorias de experticia del servidor
   * @returns Promise
   */
  getCategoriasExperticia(): Promise<any> {
    return new Promise((resolve, rej) => {
      this.ajax.get('chat/getCategoriasExperticia', {}).subscribe(d => {
        if (d.success) {
          resolve(d.categorias_experticia);
        } else {
          rej();
        }
      })
    });
  }

  /**
   * @description Agrega una intencion a la categoría de experticia
   * @param  {IntencionChat} i
   * @returns Promise
   */
  crearIntencionChat(i: IntencionChat): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/admin/intenciones/crear', i).subscribe(d => {
        if (d.success) {
          resolve();
        } else {
          reject();
        }
      })
    })
  }

  /**
   * @description Obtiene las categorias de experticia del servidor
   * @returns Promise
   */
  getIntencionesCategoriasExperticia(id_categoria): Promise<any> {
    return new Promise((resolve, rej) => {
      this.ajax.get('chat/getIntencionesCategoriasExperticia', { id_categoria: id_categoria }).subscribe(d => {
        if (d.success) {
          resolve(d.intenciones);
        } else {
          rej();
        }
      })
    });
  }

  /**
    * @description Elimina una intencion en la categoría de experticia
    * @param  {IntencionChat} i
    * @returns Promise
    */
  eliminarIntencionChat(i: IntencionChat): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/admin/intenciones/eliminar', i).subscribe(d => {
        if (d.success) {
          resolve();
        } else {
          reject();
        }
      })
    })
  }
  /**
   * @description Obtiene todos los expertos de la herramienta
   * @returns Promise
   */
  getExpertos(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/getExpertos', {}).subscribe(d => {
        if (d.success) {
          resolve(d.expertos);
        }
      })
    });
  }
  /**
   * @description Obtienes la conversacion segun el usuario actual y otro experto
   * @param  {number} id_experto EL otro experto con el cual se intenta abrior el chat
   * @returns Promise
   */
  getConversacionExperto(id_experto: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/getConversacionExperto', { id_usuario: this.user.getId(), id_experto: id_experto }).subscribe(d => {
        if (d.success) {
          resolve(d.codigo);
        }
      })
    });
  }
  /**
   * @description Transifiere un cliente a un operador o a una fila
   * @param  {Conversacion} c
   * @param  {number} id_transferencia
   * @param  {number} id_tipo
   * @returns Promise
   */
  transferirChat(c: Conversacion, id_transferencia: number, id_tipo: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fireStore.doc('expertos/' + this.user.getId() + '/chats/' + c.codigo).delete();
      this.ajax.post('chat/conversacion/transferir', { id_experto: this.user.getId(), id_conversacion: c.idtbl_conversacion, id_cliente: c.cliente.idtbl_usuario, codigo: c.codigo, id_tipo: id_tipo, coidgo_chat: c.codigo_chat, id_transferencia: id_transferencia }).subscribe(d => {
        if (d.success) {
          resolve();
        } else {
          reject();
        }
      })
    });
  }
  /**
   * @description trae el snapshot de un documento en firebase
   * @param  {string} url
   * @returns Promise
   */
  getDocumentoFirebase(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/getFirebaseDoc', { doc: url }).subscribe(d => {
        if (d.success) {
          resolve(d.doc);
        }
      })
    });
  }
  /**
   * @description trae el snapshot de una coleccion en firebase
   * @param  {string} url
   * @returns Promise
   */
  getCollectionFirebase(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/getFirebaseCollection', { doc: url }).subscribe(d => {
        if (d.success) {
          resolve(d.collection);
        }
      })
    });
  }


  /**
   * @description CIerra uan conversacion en la base de datos y en firebase
   * @param  {Conversacion} c
   * @returns Promise
   */
  cerrarConversacion(c: Conversacion, id_estado: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/conversacion/cerrar', { id_conversacion: c.idtbl_conversacion, codigo: c.codigo, id_usuario: this.user.getId(), id_estado: id_estado }).subscribe(d => {
        if (d.success) {
          resolve();
        }
      })
    });
  }
}
