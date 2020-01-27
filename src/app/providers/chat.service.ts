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
import { xhr, xhrConversaciones, Experto } from '../../schemas/xhr.schema';
import { emojis, EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { Mensaje } from '../../schemas/mensaje.schema';
import { AngularFirestore } from '@angular/fire/firestore';
import { resolve } from 'url';
import { ExtensionArchivoChat, IntencionChat, Emergencia } from '../../schemas/interfaces';
import { UtilsService } from './utils.service';
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
  sugerencia_activa = false;
  texto_mensajes_sugeridos: string;
  constructor(private ajax: AjaxService, private userService: UserService, private fireStore: AngularFirestore, private emojiService: EmojiService, private utilsService: UtilsService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
      this.user = u;
      if (u) {
        
        this.getConfiguracionesChat();
      }
    });
    if (this.user) {
      
      this.getConfiguracionesChat();
    }
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
  * @description Se encarga de buscar las conversaciones activas del cliente y las aloja en memoria ram para futuras consultas
  * @returns Promise
  */
  getConversacionesExperto(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.user) {
        this.ajax.get('chat/conversacion/experto/get', { id_usuario: this.user.getId() }).subscribe((d: xhrConversaciones) => {
          if (d.success) {
            resolve(d.conversaciones);
          } else {
            reject();
          }
        });
      }
    })
  }
  /**
   * @description Devuelve si el experto está disponible en este momento
   * @returns Promise
   */
  getDisponibilidadExperto(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.user) {
        this.ajax.get('chat/getDisponibilidadExperto', { id_usuario: this.user.getId() }).subscribe((d: any) => {
          if (d.success) {
            resolve(d.disponible);
          } else {
            //reject();
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
   * @description Se obtiene el limite de carateres que se pueden envíar en el chat
   * @returns Promise
   */
  obtenerLimiteTexto(): Promise<any> {
    return new Promise((r, re) => {
      this.ajax.get('administracion/obtener-limite-texto', {}).subscribe(p => {
        if (p.success) {
          r(p.item[0].valor);
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
    this.fireStore.collection('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo + '/mensajes').doc(mensaje.id).set(mensaje);
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
    if (this.user.id_rol != 2 && this.user.id_rol != 3) {
      this.subjectConversacion.next({ id_producto: categoria, id_busqueda: id_busqueda });
    }
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
    this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo + '/usuarios_escribiendo/' + this.user.getId()).set({ escribiendo: true, nombre: this.user.nombre, fecha: new Date(), tipo: tipo });
    c.timeout_escribiendo = setTimeout(() => {
      this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo + '/usuarios_escribiendo/' + this.user.getId()).delete();
    }, 4000);
  }
  /**
   * @description Retira la notificacion de escribiendo en una conversación segun el id del usuario
   * @param  {Conversacion} c
   * @param  {number} id Id del usuario
   */
  usuarioDejaEscribir(c: Conversacion, id: number) {

    this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo + '/usuarios_escribiendo/' + id).delete();

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
   * @description Obtiene todos los expertos de la herramienta
   * @returns Promise
   */
  getColegasChat(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/getColegas', {}).subscribe(d => {
        if (d.success) {
          resolve(d.colegas);
        }
      })
    });
  }

  /**
   * @description Obtiene todos los expertos de la herramienta
   * @returns Promise
   */
  getExpertosTransferencia(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/getExpertosTransferencia', {}).subscribe(d => {
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
          resolve(d);
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

      this.ajax.post('chat/conversacion/transferir', { id_experto: this.user.getId(), id_conversacion: c.idtbl_conversacion, id_cliente: c.cliente.idtbl_usuario, codigo: c.codigo, id_tipo: id_tipo, coidgo_chat: c.codigo_chat, id_transferencia: id_transferencia }).subscribe(d => {
        if (d.success) {
          //this.fireStore.doc('paises/' + this.user.pais + '/' + 'expertos/' + this.user.getId() + '/chats/' + c.codigo).delete();
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
  cerrarConversacion(c: Conversacion, id_estado: number, motivo?: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (c.llamada_activa) {
        this.finalizarVideollamada(c);
      }
      this.ajax.post('chat/conversacion/cerrar', { id_conversacion: c.idtbl_conversacion, codigo: c.codigo, id_usuario: this.user.getId(), id_estado: id_estado, motivo: motivo }).subscribe(d => {
        if (d.success) {
          resolve();
        }
      })
    });
  }

  /**
   * @description CIerra uan conversacion en la base de datos y en firebase
   * @param  {Conversacion} c
   * @returns Promise
   */
  cerrarConversacionUsuario(c: Conversacion, id_estado: number, motivo?: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (c.llamada_activa) {
        this.finalizarVideollamada(c);
      }
      this.ajax.post('chat/conversacion/cerrar-conversacion-usuario', { id_conversacion: c.idtbl_conversacion, codigo: c.codigo, id_usuario: this.user.getId(), id_estado: id_estado, motivo: motivo }).subscribe(d => {
        if (d.success) {
          resolve();
        }
      })
    });
  }

  /**
   * @description Crea un guión para ser usado por el chat del experto
   * @param  {string} texto
   * @returns Promise
   */
  crearGuionChat(texto: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/guion/crear', { texto: texto, id_usuario: this.user.getId() }).subscribe(d => {
        if (d.success) {
          resolve(d.id);
        }
      })
    });
  }

  /**
   * @description Obtiene todos los guiones
   * @returns Promise
   */
  getGuiones(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/getGuiones', {}).subscribe(d => {
        if (d.success) {
          resolve(d.guiones);
        }
      })
    });
  }

  /**
   * @description Actualiza un guion especifico
   * @param  {string} texto
   * @returns Promise
   */
  actualizarGuionChat(texto: string, id_guion: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/guion/editar', { texto: texto, id_usuario: this.user.getId(), id_guion: id_guion }).subscribe(d => {
        if (d.success) {
          resolve(d.id);
        }
      })
    });
  }

  /**
   * @description Actualiza un guion especifico
   * @returns Promise
   */
  desactivarGuionChat(id_guion: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/guion/eliminar', { id_usuario: this.user.getId(), id_guion: id_guion }).subscribe(d => {

        if (d.success) {
          resolve(d.id);
        }
      })
    });
  }


  crearSOS(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/obtenerFilas', {}).subscribe(d => {
        if (d.success) {
          this.procesaFilas(d.filas, resolve);
        }
      });
    });

  }

  procesaFilas(filas: Array<any>, resolve: Function) {
    let expertos = [];
    let finaliza = true;

    filas.forEach((ce, index) => {

      expertos = expertos.concat(ce.expertos);

    });
    this.asignarAsesor(expertos, resolve);
  }

  asignarAsesor(expertos: Array<any>, resolve: Function) {
    let final_expertos = [];
    expertos.forEach(async (e, index) => {
      let data = await this.getDocumentoFirebase('paises/' + this.user.pais + '/expertos/' + e.id_usuario);
      if (!data) {
        data = { activo: false };
      }
      let ex = { idtbl_usuario: e.id_usuario, chats: [], activo: data.activo, ultima_conexion: data.fecha };
      ex.chats = await this.getCollectionFirebase('paises/' + this.user.pais + '/expertos/' + e.id_usuario + '/chats');
      final_expertos.push(ex);
      if (index == expertos.length - 1) {
        this.procesaChats(final_expertos, resolve);
      }
    });

  }


  procesaChats(expertos, resolve: Function) {
    expertos = this.utilsService.getUnique(expertos, 'idtbl_usuario');
    let asignado = 0;
    let todos_expertos = expertos;
    expertos = expertos.filter(e => {
      if (!e.ultima_conexion) {
        return false;
      }
      var duration = moment().unix() - e.ultima_conexion._seconds;
      return e.activo && duration < 11;
    });
    expertos.sort((a, b) => {
      if (!a.chats && !b.chats) {
        return 0;
      } else if (!a.chats) {
        return 1;
      } else if (!b.chats) {
        return -1;
      } else {
        return a.chats.length < b.chats.length ? 1 : -1;
      }
    });
    let experto: Experto = expertos.pop();
    if (experto) {
      this.ajax.post('chat/sos/crear', { id_usuario: this.user.getId(), id_operador: experto.idtbl_usuario }).subscribe(d => {
        resolve(d.success);
        this.getEmergenciaUsuario().then((e: Emergencia) => {
          this.fireStore.doc('paises/' + this.user.pais + '/' + 'expertos/' + experto.idtbl_usuario + '/emergencia/1').set({ id_emergencia: e.idtbl_consultas_sos });
        })

      })
    } else {
      this.ajax.post('chat/sos/crear', { id_usuario: this.user.getId() }).subscribe(d => {
        resolve(false);
      })
    }

    //resolve(experto);
    /*if (!experto) {
      todos_expertos.sort((a, b) => {
        if (!a.chats && !b.chats) {
          return 0;
        } else if (!a.chats) {
          return 1;
        } else if (!b.chats) {
          return -1;
        } else {
          return a.chats.length < b.chats.length ? 1 : -1;
        }
      });
      let experto: Experto = todos_expertos.pop();
      // console.log(experto);
    }*/
  }

  getEmergenciaUsuario(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/sos/getEmergenciaUsuario', { id_usuario: this.userService.getUsuario().getId() }).subscribe(d => {
        if (d.success) {
          resolve(d.emergencia);
        }
      })
    });
  }

  cerrarEmergenciaUsuario(id_emergencia: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/sos/cerrarEmergenciaUsuario', { id_emergencia: id_emergencia }).subscribe(d => {
        if (d.success) {
          resolve();

        }
      })
    });
  }

  cerrarEmergenciaOperador(id_emergencia: number, motivo: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/sos/cerrarEmergenciaOperador', { id_emergencia: id_emergencia, motivo: motivo }).subscribe(d => {
        if (d.success) {
          resolve();
          this.fireStore.doc('paises/' + this.user.pais + '/' + 'expertos/' + this.user.getId() + '/emergencia/1').delete();
        }
      })
    });
  }

  getEmergencia(id_emergencia: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/sos/getEmergencia', { id_emergencia: id_emergencia }).subscribe(d => {
        if (d.success) {
          resolve(d.emergencia);
        }
      })
    });
  }

  /**
   * @description
   * @param  {Conversacion} c
   * @returns Promise
   */
  iniciarVideollamada(c: Conversacion): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/videollamada/crear', { id_conversacion: c.idtbl_conversacion, id_usuario: this.user.getId(), correo_cliente: c.cliente.correo, token: this.user.token_acceso }).subscribe(d => {
        if (d.success) {
          c.id_llamada = d.id;
          resolve(d.url);
        }
      })
    });
  }

  /**
   * @description Finaliza videollamada
   * @param  {Conversacion} c
   * @returns Promise
   */
  finalizarVideollamada(c: Conversacion): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/videollamada/finalizar', { id_llamada: c.id_llamada, codigo: c.codigo, id_experto_actual: c.id_experto_actual, id_conversacion: c.idtbl_conversacion }).subscribe(d => {
        if (d.success) {
          resolve();
        }
      })
    });
  }

  /**
   * @description Obtiene los motivos de cirre disponibles para el experto
   * @returns Promise
   */
  buscarMotivosCierreChat(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/obtenerMotivosCierre', { id_usuario: this.userService.getUsuario().getId() }).subscribe(d => {
        if (d.success) {
          resolve(d.motivos);
        }
      })
    });
  }

  /**
   * @description Buca un experto disnponible para asignarlo al chat
   * @returns Promise
   */
  getExpertoDisponible(filas: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/getExpertoDisponible', { filas: filas }).subscribe(d => {
        if (d.success) {
          resolve(d.experto);
        }
      })
    });
  }

  /**
  * @description Obtiene las filas de una conversacion
  * @param {Conversacion} c
  * @returns Promise
  */
  getFilasConversacion(c: Conversacion): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/conversacion/getFilas', { id_conversacion: c.idtbl_conversacion }).subscribe(d => {
        if (d.success) {
          c.filas = d.filas;
          resolve();
        }
      })
    });
  }


  /**
  * @description Obtiene los estados del experto
  * @returns Promise
  */
  getEstadosExperto(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/getEstadosExperto', {}).subscribe(d => {
        if (d.success) {
          resolve(d.estados);
        } else {
          reject();
        }
      })
    });
  }

  ///sugerencia-nlp/aceptar

  /**
 * @description Acepta la sugerencia del sistema para crear una pregunta a partir de los mensajes de un chat segun los sentimientos de cada mensaje
 * @returns Promise
 */
  aceptarSugerenciaNlp(c: Conversacion): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/sugerencia-nlp/aceptar', { id_conversacion: c.idtbl_conversacion }).subscribe(d => {
        if (d.success) {
          resolve();
        }
      })
    })
  }

  /**
   * obtiene los mensajes automaticos de busqueda de expertos
   * @param id_tipo_mensaje_automatico 
   */
  getMensajeBuscandoExperto(id_tipo_mensaje_automatico): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/obtener-mensaje-buscando', { id_usuario: this.userService.getUsuario().getId(), id_tipo_mensaje_automatico: id_tipo_mensaje_automatico }).subscribe(result => {
        if (result.success) {
          resolve(result.mensaje);
        }
      })
    });
  }

  /**
   * obtiene los mensajes automaticos de busqueda de expertos
   * @param id_tipo_mensaje_automatico 
   */
  getMensajesGenerales(id_conversacion, id_tipo_mensaje_automatico): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/obtener-mensaje-general', { id_conversacion: id_conversacion, id_tipo_mensaje_automatico: id_tipo_mensaje_automatico }).subscribe(result => {
        if (result.success) {
          resolve(result.mensaje);
        }
      })
    });
  }

  conversacionPendiente(c: Conversacion, estado: number, hora_recordatorio?: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this.ajax.post('chat/recordatorio/crear', { id_conversacion: c.idtbl_conversacion, codigo: c.codigo, id_usuario: this.user.getId(), correo_cliente: c.cliente.correo, nombre_cliente: c.cliente.nombre, token: this.user.token_acceso, hora_recordatorio: hora_recordatorio, id_estado: estado }).subscribe(d => {
        if (d.success) {

          resolve();
        }
      })
    })
  }

  buscarHistorialClienteUsuario(id_cliente: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('chat/obtenerHistorialClienteExperto', { id_cliente: id_cliente, id_experto: this.user.getId() }).subscribe(result => {
        if (result.success) {
          resolve(result.conversaciones);
        } else {
          reject();
        }
      })
    });
  }

  /**
   * obtiene las conversaciones activas de un usuario
   */
  getConversacionActivaUsuario(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/obtener-conversaciones-activas-usuario', { id_usuario: this.user.getId() }).subscribe(result => {
        if (result.success) {
          resolve(result);
        } else {
          reject();
        }
      })
    });
  }

  /**
   * elimina el evento del calendario de una conversacion pendiente
   * @param idtbl_conversacion 
   */
  eliminarRecordatorioPendiente(idtbl_conversacion): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/recordatorio/eliminar', { id_conversacion: idtbl_conversacion }).subscribe(d => {
        if (d.success) {
          resolve(d);
        }
      });
    });
  }

  /**
   * genera el archivo pdf con los mensajes de una conversacion
   * @param idtbl_conversacion 
   */
  generarPdf(idtbl_conversacion): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/descargar-pdf', { id_conversacion: idtbl_conversacion }).subscribe(d => {
        if (d.success) {
          resolve(d);
        }
      });
    });
  }

  /**
   * @description Se obtiene el limite de carateres que se pueden envíar en el chat
   * @returns Promise
   */
  obtenerTextoBuscandoExperto(): Promise<any> {
    return new Promise((r, re) => {
      this.ajax.get('administracion/obtener-texto-buscando-experto', {}).subscribe(p => {
        if (p.success) {
          let valor = '';
          if (p.item.length > 0) {
            valor = p.item[0].valor;
          }
          r(valor);
        }
      });
    })
  }

  /**
   * obtiene la encuesta de tipo experto
   */
  obtenerEncuestaExperto() {
    return new Promise((resolve, reject) => {
      this.ajax.get('encuestas/obtener-encuesta-tipo', { id_tipo: 2 }).subscribe(d => {
        if (d.success) {
          resolve(d);
        }
      });
    });
  }

  /**
   * obtiene los usuarios dependiendo una categoria de experticia
   */
  obtenerUsuarioPorCategoria(id_categoria) {
    return new Promise((resolve, reject) => {
      this.ajax.post('chat/obtener-usuario-por-categoria', { id_categoria: id_categoria }).subscribe(d => {
        if (d.success) {
          resolve(d.usuarios);
        }
      });
    });
  }

}
