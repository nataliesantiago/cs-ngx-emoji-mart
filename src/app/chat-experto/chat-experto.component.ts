import { Component, ChangeDetectorRef, ViewChild, ModuleWithComponentFactories, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../providers/user.service';
import { ChatService } from '../providers/chat.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../schemas/user.schema';
import { Conversacion } from '../../schemas/conversacion.schema';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { Mensaje } from '../../schemas/mensaje.schema';
import { Configuracion, ShortCut, InformacionCorreo, LogEstadoExperto } from '../../schemas/interfaces';
import { SonidosService } from '../providers/sonidos.service';
import swal from 'sweetalert2';
import { UtilsService } from '../providers/utils.service';
import { MatDialog } from '@angular/material';
import { TransferenciaChatComponent } from '../components/transferencia-chat/transferencia-chat.component';
import { ShortcutsService } from '../providers/shortcuts.service';
import { CerrarChatExpertoComponent } from '../components/cerrar-chat-experto/cerrar-chat-experto.component';
import { text } from '@angular/core/src/render3';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ChatPendienteComponent } from '../components/chat-pendiente/chat-pendiente.component';
import { DomSanitizer } from '@angular/platform-browser';
import { EstadoExpertoService } from '../providers/estado-experto.service';

const moment = _rollupMoment || _moment;

declare var StereoAudioRecorder: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat-experto.component.html',
  styleUrls: ['./chat-experto.component.scss']
})
export class ChatExpertoComponent {

  them;
  sidePanelOpened = true;
  texto_mensaje: string;
  // MESSAGE
  stream: any;
  selectedMessage: any;
  expertos: Array<User>;
  expertos_filtro: Array<User>;
  buscar_experto: string;
  user: User;
  ocultar_nuevos_mensajes = false;
  chats_experto = [];
  chats_cola = [];
  fila_chats = [];
  chat: Conversacion;
  obligaCambio = true;
  usuarios = [];
  @ViewChild('contenedor') componentRef?: PerfectScrollbarComponent;
  configuraciones = [];
  limite_texto_chat;
  shortcuts: Array<ShortCut>;
  @Input() esSupervisor: boolean;
  cantidad_mensajes_sin_leer = 0;
  @Output() mensajes_nuevos: EventEmitter<number> = new EventEmitter<number>();
  file_url;
  loading = false;
  state: LogEstadoExperto = {id_usuario_experto: null, id_estado_experto_actual: null, id_estado_experto_nuevo: null, estado_ingreso: null};

  constructor(private userService: UserService, private chatService: ChatService,
    private fireStore: AngularFirestore, private changeRef: ChangeDetectorRef,
    private ngZone: NgZone, private soundService: SonidosService, private utilService: UtilsService,
    private dialog: MatDialog, private shortcutsService: ShortcutsService, private router: Router, private sanitizer: DomSanitizer, private estadoExpertoService: EstadoExpertoService) {

    this.user = this.userService.getUsuario();
    if (this.user) {
      this.init();
    }
    this.userService.observableUsuario.subscribe(u => {
      this.user = u;
      if (this.user) {
        this.init();
      }
    });
    this.userService.observableEstadoExperto.subscribe((estado) => {
      if (estado == 1) {
        this.recibirChatAutomatico();
      }
    });
  }

  init() {
    this.chatService.obtenerLimiteTexto().then(valor => {
      this.limite_texto_chat = valor;
    });
    this.shortcutsService.getShortcutsUsuario().then(shortcuts => {
      this.shortcuts = shortcuts;
    })
    let paso_por_chats = false;
    this.chatService.getConfiguracionesChat().then(configs => {
      this.configuraciones = configs.configuraciones;
      this.userService.getFilasExperto().then(() => {
        this.userService.setActivoExpertoGlobal(1);
        this.insertarLogEstadoExperto();
        this.user.filas.forEach(f => {
          let fila = { chats: null, id: f.id_categoria_experticia, listener_conversacion: null };
          //this.chats_cola.push(fila)
          let cola = this.fireStore.collection('categorias_experticia/' + f.id_categoria_experticia + '/chats').snapshotChanges();
          cola.subscribe(chats => {

            let tmp = [];

            if (chats.length < 1) {
              if (fila.listener_conversacion) {
                fila.listener_conversacion.unsubscribe();
              }
              if (f.chats)
                f.chats.forEach((c: Conversacion) => {
                  if (c.interval_tiempo_cola) {
                    window.clearInterval(c.interval_tiempo_cola);
                  }
                });
              fila.chats = [];
              this.procesaFilas(fila);
            } else {
              this.soundService.sonar(2);
              chats.forEach((c: any, index) => {
                let refConversacion = c.payload.doc.id;
                this.chatService.getDocumentoFirebase('conversaciones/' + refConversacion).then(async datos => {
                  let c: Conversacion = datos;
                  c.codigo = refConversacion;
                  c.cliente = await this.userService.getInfoUsuario(c.id_usuario_creador) as User;
                  tmp.push(c);
                  this.utilService.getConfiguraciones().then(configs => {
                    let tiempo_cola = configs.find((c: Configuracion) => {
                      return c.idtbl_configuracion == 6;
                    });
                    c.interval_tiempo_cola = setInterval(() => {
                      let duration = moment().diff(moment(c.fecha_creacion), 'seconds');
                      if (duration > (tiempo_cola.valor * 60)) {
                        c.tiempo_cola = true;
                        window.clearInterval(c.interval_tiempo_cola);
                        delete c.interval_tiempo_cola;
                      }
                    }, 1000);
                  });

                  if (index == chats.length - 1) {
                    if (f.chats)
                      f.chats.forEach((c: Conversacion) => {
                        if (c.interval_tiempo_cola) {
                          window.clearInterval(c.interval_tiempo_cola);
                        }
                      });
                    fila.chats = tmp;

                    this.procesaFilas(fila);
                    if (paso_por_chats) {
                      if (this.user.experto_activo) {
                        this.recibirChatAutomatico();
                      }
                    }

                  }
                });
              });
            }
          })
        });
        let chats = this.fireStore.collection('expertos/' + this.user.getId() + '/chats').snapshotChanges();
        chats.subscribe(chat => {

          let temporal: Array<Conversacion> = [];

          this.chats_experto.forEach((c: Conversacion) => {
            c.listener_mensajes.unsubscribe();
          });
          if (chat.length > 0) {
            this.soundService.sonar(2);
          }
          if (chat.length < 1) {
            this.chats_experto = [];
          }
          chat.forEach((change: any, index) => {
            let codigo = change.payload.doc.id;
            this.chatService.getDocumentoFirebase('conversaciones/' + codigo).then((d: Conversacion) => {
              let c = d;
              c.codigo = codigo;
              this.userService.getInfoUsuario(c.id_usuario_creador).then((d: User) => {
                //// console.log(d);
                c.cliente = d;
                this.agregarListenerMensajes(c);
                this.agregaListenerConversacion(c);
                temporal.push(c);
                if (!this.chat) {
                  this.obligaCambio = false;
                  this.onSelect(c);
                }
                if (index == (chat.length - 1)) {
                  paso_por_chats = true;
                  this.chats_experto = temporal;
                  this.changeRef.detectChanges();
                }
              });
              this.chatService.buscarHistorialClienteUsuario(c.id_usuario_creador).then(historial => {
                c.historial = historial;
              })
            });
          });

        });
      });
    });
    this.chatService.getColegasChat().then(e => {
      this.expertos = this.expertos_filtro = e.filter(experto => {
        return experto.idtbl_usuario != this.user.getId();
      });
      this.expertos.forEach(e => {
        this.abrirConversacionExperto(e, true);
        this.fireStore.doc('expertos/' + e.idtbl_usuario).valueChanges().subscribe((experto: any) => {
          if (!experto || !experto.fecha) {
            e.activo_chat = false;
          } else {
            var duration = moment().unix() - experto.fecha.seconds;
            if (experto.activo && duration < 30) {
              e.activo_chat = true;
            } else {
              e.activo_chat = false;
            }
          }
        });
      });
    })
  }

  buscarTexto(c: Conversacion, e: KeyboardEvent, input: HTMLInputElement) {
    e.preventDefault();
    e.stopPropagation();

    if (!c.buscando_texto) {
      c.texto_busqueda_mensajes = new FormControl();
      c.buscando_texto = true;
      setTimeout(() => {
        // input.focus();
      }, 50);

      c.texto_busqueda_mensajes.valueChanges.subscribe(value => {
        if (value && value != '') {
          c.cant_coincidencias = 0;
          c.mensajes.forEach((m: Mensaje) => {
            if (m.texto.toLowerCase().indexOf(value.toLowerCase()) != -1) {
              console.log('Encontro mensaje', m.texto.toLowerCase());
              m.encontrado = true;
              c.cant_coincidencias++;
            } else {
              m.encontrado = false;
            }
          });
        } else {
          c.mensajes.forEach((m: Mensaje) => {
            m.encontrado = false;
          });
        }
      });
    } else {
      c.buscando_texto = false;
    }
  }

  insertarLogEstadoExperto() {
    if (this.user.getEstadoExpertoActual() != 1) {
      this.state.id_usuario_experto = this.user.getId();
      this.state.id_estado_experto_actual = this.user.getEstadoExpertoActual();
      this.state.id_estado_experto_nuevo = 1;
      this.estadoExpertoService.createLogState(this.state);
    }
  }

  recibirChatAutomatico() {
    let config = this.buscarConfiguracion(2);
    // console.log(config)
    this.chatService.getConversacionesExperto().then((conversaciones: Array<Conversacion>) => {
      if (config) {
        if (parseInt(config.valor) > conversaciones.length) {
          let chats = [];
          this.chats_cola.forEach(f => {
            chats = chats.concat(f.chats);
          });

          chats.sort((a, b) => {
            if (a.peso_chat > b.peso_chat) {
              return 1;
            } else if (a.peso_chat < b.peso_chat) {
              return -1;
            } else {

              return (new Date(a.fecha_creacion) < new Date(b.fecha_creacion)) ? 1 : -1;
            }
          });
          let c = chats.pop();

          if (c) {
            this.onSelectCola(c);
          }
        }
      }
    });

  }

  agregaListenerConversacion(c: Conversacion) {
    this.fireStore.doc('conversaciones/' + c.codigo).snapshotChanges().subscribe(datos => {
      let data = datos.payload.data() as Conversacion;
      if (data.id_experto_actual != this.user.getId()) {
        this.fireStore.doc('expertos/' + this.user.getId() + '/chats/' + data.codigo).delete();
      } else {
        c.id_estado_conversacion = data.id_estado_conversacion;
        c.llamada_activa = data.llamada_activa;
        c.url_llamada = data.url_llamada;
        c.conversacion_recomendada = data.conversacion_recomendada;
        if (c.id_estado_conversacion != 1 && c.id_estado_conversacion != 2 && c.id_estado_conversacion != 7) {

          if (!c.encuesta_realizada) {
            c.mostrar_encuesta = true;
          }
          if (this.user.experto_activo) {
            this.recibirChatAutomatico();
          }

        }
      }
    });
  }

  filtraExpertos() {
    this.expertos_filtro = this.expertos.filter(e => {
      return (this.utilService.normalizeText(e.nombre).toLowerCase().indexOf(this.buscar_experto.toLowerCase()) != (-1) || this.utilService.normalizeText(e.correo).toLowerCase().indexOf(this.buscar_experto.toLowerCase()) != (-1));
    });
  }

  abrirConversacionExperto(e: User, oculta?: boolean) {
    if (e.conversacion_experto && !oculta) {
      this.onSelect(e.conversacion_experto);
    } else {
      this.chatService.getConversacionExperto(e.idtbl_usuario).then(data => {
        e.conversacion_experto = new Conversacion(this.user.getId(), 2, data.codigo);
        e.conversacion_experto.cliente = JSON.parse(JSON.stringify(e));
        e.conversacion_experto.idtbl_conversacion = data.idtbl_conversacion;
        this.agregarListenerMensajes(e.conversacion_experto);
        if (!oculta) {
          this.onSelect(e.conversacion_experto);
        }
      });
    }
  }

  trasnferirChat(c: Conversacion) {
    this.dialog.open(TransferenciaChatComponent, { width: '400px', data: { conversacion: c } }).afterClosed().subscribe((result) => {
      if (result && result.success) {
        if (this.user.experto_activo) {
          this.recibirChatAutomatico();
        }
        this.onSelect(null);
      }
    });
  }

  procesaFilas(fila: any) {
    let existe = false;
    let indice;
    let tmp = [];
    this.chats_cola.forEach((f, i) => {

      if (f.id == fila.id) {
        existe = true;
        indice = i;
      }
      if (f.chats) {
        tmp = tmp.concat(f.chats);
      }
    });
    this.fila_chats = tmp;
    if (!existe) {

      this.chats_cola.push(fila);
    } else {
      this.chats_cola[indice].chats = fila.chats;
    }

  }

  buscarConfiguracion(id: number): Configuracion {
    return this.configuraciones.find(c => {
      return c.idtbl_configuracion === id;
    });
  }

  agregarListenerMensajes(c: Conversacion) {
    c.mensajes = [];
    let primera_vez = true;
    c.messages = this.fireStore.collection('conversaciones/' + c.codigo + '/mensajes', ref =>
      ref.orderBy('fecha_mensaje')
    ).valueChanges();
    c.listener_mensajes = c.messages.subscribe(async d => {

      if (!primera_vez && c.mensajes && c.mensajes.length < d.length) {
        c.cantidad_mensajes_nuevos += d.length - c.mensajes.length;
      }
      //console.log('Escucha mensajes del colega', c.cantidad_mensajes_nuevos);
      c.mensajes = await this.procesarMensajes(d, c, primera_vez, 0, []);
      if (!c.primera_consulta) {
        c.mensajes.filter(m => {
          return m.id_usuario == c.id_usuario_creador && (!m.es_nota_voz && !m.es_archivo);
        }).forEach(m => {
          this.utilService.identificarPreguntaTexto(m.texto).then(rta => {
            if (rta && !c.primera_consulta) {
              c.primera_consulta = m.texto;
              c.busqueda_interna = m.texto;
              this.fireStore.doc('conversaciones/' + c.codigo).update({ primera_consulta: c.primera_consulta });
            }
          });
        })
      }
      primera_vez = false;
      this.cantidad_mensajes_sin_leer = 0;
      this.expertos.forEach(e => {
        if (e.conversacion_experto) {
          this.cantidad_mensajes_sin_leer += e.conversacion_experto.cantidad_mensajes_nuevos;
        }
      });
      //console.log(this.cantidad_mensajes_sin_leer);
      this.mensajes_nuevos.emit(this.cantidad_mensajes_sin_leer);
    });
    this.fireStore.collection('conversaciones/' + c.codigo + '/mensajes/').snapshotChanges().subscribe((changes: any) => {
      changes.forEach(a => {
        const data = a.payload.doc.data() as Mensaje;
        const id = a.payload.doc.id;
        data.id = id;
        if (data.id_usuario != this.user.getId() && data.estado != 3) {
          this.chatService.cambiaEstadoMensajes(data, c);
        }
      })
    });
    c.usuarios_escribiendo = [];
    this.fireStore.collection('conversaciones/' + c.codigo + '/usuarios_escribiendo/').snapshotChanges().subscribe((changes: any) => {
      let tmp = [];
      changes.forEach(a => {
        let data = a.payload.doc.data();
        const id = a.payload.doc.id;

        if (id != this.user.getId()) {
          let u = c.usuarios_escribiendo.find(u => {
            return u.id == id;
          });
          if (!u) {
            let ue = { id: id, nombre: data.nombre, timeout: null, tipo: data.tipo };
            tmp.push(ue);
            ue.timeout = setTimeout(() => {
              this.chatService.usuarioDejaEscribir(c, id);
            }, 4000);
          } else {
            tmp.push(u);
            window.clearTimeout(u.timeout);
            u.timeout = setTimeout(() => {
              this.chatService.usuarioDejaEscribir(c, id);
            }, 4000);
          }
        }
      });
      c.usuarios_escribiendo = tmp;
    });
  }

  async procesarMensajes(d: Array<Mensaje>, c: Conversacion, primera_vez: boolean, i: number, tmp: Array<Mensaje>) {
    let m = d.shift();
    if (m) {
      let experto = this.usuarios.find((e: User) => {
        return e.idtbl_usuario == m.id_usuario;
      });
      if (!experto) {
        let u = await this.userService.getInfoUsuario(m.id_usuario);
        this.usuarios.push(u);
      }
      if (m.es_nota_voz) {
        m.audioControls = { reproduciendo: false, segundo: m.duracion, min: 0, max: m.duracion };
        this.asignarAudio(m);
      }

      //c.mensajes[i] = m;
      tmp.push(m);
      if (!primera_vez && !c.focuseado && m.id_usuario != this.user.getId() && c.id_estado_conversacion == 2) {
        this.soundService.sonar(1);
        c.mensajes_nuevos = true;
        // c.cantidad_mensajes_nuevos++;
      } else {

      }

      //console.log('mensaje sin leer', this.cantidad_mensajes_sin_leer);

      if (d.length < 1) {
        c.ultimo_mensaje = m;
        if (m.es_nota_voz) {
          c.ultimo_mensaje.label = 'Nota de voz';
        } else if (m.es_archivo) {
          c.ultimo_mensaje.label = 'Archivo adjunto';
        } else {
          c.ultimo_mensaje.label = m.texto;
        }
      }
      i++;
      return await this.procesarMensajes(d, c, primera_vez, i, tmp);
    } else {
      //console.log(' mensajes', m)
      return tmp;
    }
  }

  passByMensajes(mensajes: Array<Mensaje>, index: number, mensaje_anterior?: Mensaje) {
    let m = mensajes[index];
    if (m) {
      m.muestra_hora = true;
      index++;
      if (mensaje_anterior && m.id_usuario == mensaje_anterior.id_usuario) {
        let a = moment(mensaje_anterior.fecha_mensaje);
        let b = moment(m.fecha_mensaje);
        let minutes = a.diff(b, 'minutes');

        if (minutes == 0) {
          mensaje_anterior.muestra_hora = false;
          delete mensaje_anterior.user;
        }
      }
      this.passByMensajes(mensajes, index, m);
    }
  }

  asignarAudio(m: Mensaje, audio?: HTMLAudioElement) {
    //audio.load();

    m.audio = new Audio();
    m.audio.src = m.url;
    m.audio.load();
    m.audio.addEventListener('durationchange', e => {
      let target = <HTMLAudioElement>e.target;
      let d = Math.floor(target.duration);
      if (d > 0) {
        m.audioControls.max = d;
        m.audioControls.segundo = d;
      }

    });
    m.audio.addEventListener('timeupdate', e => {
      let target = <HTMLAudioElement>e.target;
      m.audioControls.segundo = target.currentTime;
    })

    m.audio.addEventListener('pause', e => {
      m.audioControls.reproduciendo = false;
    });
    m.audio.addEventListener('play', e => {
      m.audioControls.reproduciendo = true;
    });

  }

  toggleAudio(c: Conversacion, m: Mensaje) {
    c.mensajes.filter(m => {
      return m.es_nota_voz;
    }).forEach(me => {
      me.audio.pause();
    });
    if (m.audioControls.reproduciendo) {
      m.audio.pause();
    } else {
      m.audio.play();
    }
  }

  cambiarSegundoAudio(m: Mensaje) {
    m.audio.pause();
    m.audio.currentTime = m.audioControls.segundo;
    m.audio.play();
  }

  bajaScroll(c: Conversacion) {
    if (this.chat && c.codigo === this.chat.codigo) {
      if (this.componentRef.directiveRef.position().y === 'end') {
        setTimeout(() => {
          this.ocultar_nuevos_mensajes = true;
          this.componentRef.directiveRef.scrollToBottom();
        }, 50);
      } else {
        this.ocultar_nuevos_mensajes = false;
      }
    }
  }
  cambiaScroll(e) {

  }
  verNuevosMensajes(comp: PerfectScrollbarComponent, c: Conversacion) {
    this.ocultar_nuevos_mensajes = true;
    c.ocultar_nuevos_mensajes = true;
    comp.directiveRef.scrollToBottom();
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  onSelect(chat: Conversacion): void {
    this.chat = chat;
    if (chat) {
      chat.mensajes_nuevos = false;
      this.setFocus(chat, false);
    }
  }

  onSelectCola(c: Conversacion): void {
    // this.chat = chat;
    // chat.mensajes_nuevos = false;
    this.chatService.asignarUsuarioExperto(this.user.getId(), c.idtbl_conversacion, c.codigo).then(u => {

    });
  }

  remplazaEmoji(c: Conversacion) {
    c.texto_mensaje = this.chatService.findEmojiData(c.texto_mensaje);
  }

  setFocus(c: Conversacion, estado: boolean) {
    // console.log(c);
    c.focuseado = estado;
    // console.log(this.cantidad_mensajes_sin_leer,c.cantidad_mensajes_nuevos);
    this.cantidad_mensajes_sin_leer -= c.cantidad_mensajes_nuevos;
    this.mensajes_nuevos.emit(this.cantidad_mensajes_sin_leer);
    c.cantidad_mensajes_nuevos = 0;
    if (estado) {
      c.mensajes_nuevos = false;
      c.mostrar_emojis = false;
    }
  }

  seleccionarEmoji(evento, c: Conversacion) {
    console.log(evento.emoji);
    if (c.texto_mensaje) {
      c.texto_mensaje += '' + evento.emoji.native;
    } else {
      c.texto_mensaje = '';
      c.texto_mensaje += evento.emoji.native;
    }
    //c.mostrar_emojis = false;
  }

  toggleEmojis(c: Conversacion) {
    if (c.mostrar_emojis) {
      c.mostrar_emojis = false;
    } else {
      c.mostrar_emojis = true;
    }
  }

  toggleDatosCliente(c: Conversacion) {
    if (!c.mostrar_datos_cliente) {
      c.mostrar_datos_cliente = true;
    } else {
      c.mostrar_datos_cliente = false;
    }
  }

  enviarMensaje(chat: Conversacion, tipo_mensaje: number, url?: string, event?: Event, comp?: PerfectScrollbarComponent, duration?: number) {

    if (chat.texto_mensaje) {
      chat.texto_mensaje = chat.texto_mensaje.trim();
    }
    if ((chat.texto_mensaje && chat.texto_mensaje != '') || chat.archivo_adjunto || tipo_mensaje == 3 || tipo_mensaje == 4) {
      if (!chat.texto_mensaje) {
        chat.texto_mensaje = '';
      }
      let m = new Mensaje();
      m.tipo_conversacion = chat.id_tipo_conversacion;
      m.id_usuario = this.user.getId();
      m.texto = chat.texto_mensaje;
      chat.texto_mensaje = '';
      m.fecha_mensaje = moment().utc();
      m.codigo = chat.codigo;
      m.id_conversacion = chat.idtbl_conversacion;
      m.estado = 1;
      if (chat.archivo_adjunto) {
        tipo_mensaje = 2;
        m.url = chat.archivo_adjunto.url;
        m.tipo_archivo = chat.archivo_adjunto.tipo_archivo;
      }
      switch (tipo_mensaje) {
        case 1:
          m.es_archivo = false;
          m.es_nota_voz = false;
          break;
        case 2:
          m.es_archivo = true;
          m.es_nota_voz = false;
          m.nombre_archivo = chat.archivo_adjunto.name;
          break;
        case 3:
          m.es_archivo = false;
          m.es_nota_voz = true;
          m.url = url;
          chat.texto_mensaje = '';
          m.tipo_archivo = 4;
          m.audioControls = { reproduciendo: false, segundo: duration, min: 0, max: duration };
          m.duracion = duration;
          this.asignarAudio(m);
          break;

        case 4:
          m.es_archivo = false;
          m.es_nota_voz = false;
          m.texto = 'Únete a la videollamada: ' + url;
          m.es_llamada = true;
          m.url = url;
          break;
      }

      chat.mensajes.push(m);
      /*this.ngZone.runOutsideAngular(() => {
        chat.mensajes.push(m);
        this.passByMensajes(chat.mensajes, 0);
      });*/
      this.chatService.usuarioDejaEscribir(chat, this.user.getId());

      if (comp) {
        setTimeout(() => {
          chat.ocultar_nuevos_mensajes = true;
          comp.directiveRef.scrollToBottom();
        }, 300);
      }
      //this.fireStore.collection('conversaciones/' + chat.codigo + '/mensajes').add(JSON.parse(JSON.stringify(m)));

      this.chatService.enviarMensaje(m);
      delete chat.texto_mensaje;
      delete chat.archivo_adjunto;
      delete chat.grabando_nota;
      this.changeRef.detectChanges();
    }
  }

  adjuntarArchivo(c: Conversacion, evento: Event, form: HTMLFormElement, input: HTMLInputElement) {

    let target = <any>evento.target;
    c.cargando_archivo = true;
    if (target.files && target.files.length > 0) {
      this.chatService.adjuntarArchivosServidor(target.files[0]).then(archivo => {

        c.archivo_adjunto = archivo;
        input.value = "";
        c.cargando_archivo = false;
      }, e => {
        delete c.archivo_adjunto;
        c.cargando_archivo = false;
        input.value = "";
        swal.fire({ type: 'error', text: e });
      });
    }
  }

  adjuntarNotaVoz(c: Conversacion, file: File, duration: number, comp: PerfectScrollbarComponent) {

    c.cargando_archivo = true;
    c.grabando_nota = false;
    this.chatService.adjuntarArchivosServidor(file, true).then(archivo => {
      this.chatService.usuarioDejaEscribir(c, this.user.getId());
      this.enviarMensaje(c, 3, archivo.url, null, comp, duration);
      c.cargando_archivo = false;
    });
  }

  quitarArchivoAdjunto(c: Conversacion, input: HTMLInputElement) {
    delete c.archivo_adjunto;
    input.value = "";
  }

  grabarNotaVoz(c: Conversacion, comp: PerfectScrollbarComponent) {

    let minutos = parseInt(this.buscarConfiguracion(7).valor);
    let tiempo = minutos * 60;
    const options = { mimeType: 'audio/webm' };
    let detenido = false;
    let calculaTiempo = { fechaIni: null, fechaFin: null };
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.stream = stream;
        c.mediaRecorder = new StereoAudioRecorder(stream, {
          sampleRate: 48000,
          get16BitAudio: true,
          bufferSize: 4096,
          numberOfAudioChannels: 1,
          disableLogs: true
        });
        this.startTimer(tiempo, c).then(() => {
          c.mediaRecorder.stop(audioBlob => {
            this.onStopRecordingNotaVoz(audioBlob, c, comp);

          });
        });

      });



  }

  onStopRecordingNotaVoz(audioBlob: Blob, c: Conversacion, comp: PerfectScrollbarComponent) {

    var voice_file = new File([audioBlob], 'nota_voz_' + moment().unix() + '.wav', { type: 'audio/wav' });
    delete c.mediaRecorder;
    var duration = moment().diff(moment(c.inicia_grabacion), 'seconds');
    this.adjuntarNotaVoz(c, voice_file, duration, comp);
    this.stream.getTracks().forEach(track => track.stop());

  }

  startTimer(duration: number, c: Conversacion): Promise<any> {

    var timer: number = duration;
    let minutes;
    let seconds;


    return new Promise((resolve, reject) => {


      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      c.cuenta_regresiva = minutes + ":" + seconds;
      c.mediaRecorder.record();
      c.grabando_nota = true;
      c.inicia_grabacion = new Date();
      this.chatService.usuarioEscribiendoConversacion(c, 2);
      c.interval_grabando = setInterval(() => {
        timer -= 1;
        minutes = Math.floor(timer / 60);
        seconds = Math.floor(timer % 60);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        c.cuenta_regresiva = minutes + ":" + seconds;



        if (timer <= 0) {
          window.clearInterval(c.interval_grabando);
          resolve();
        }
        this.chatService.usuarioEscribiendoConversacion(c, 2);
      }, 1000);
    });

  }

  enviarNota(c: Conversacion, comp: PerfectScrollbarComponent) {
    c.mediaRecorder.stop(audioBlob => {
      this.onStopRecordingNotaVoz(audioBlob, c, comp);
    });
    window.clearInterval(c.interval_grabando);

  }

  quitarNotaVoz(c: Conversacion) {
    delete c.grabando_nota;
    c.mediaRecorder.stop();
    window.clearInterval(c.interval_grabando);
    this.stream.getTracks().forEach(track => track.stop());
  }

  escribiendo(c: Conversacion, event: KeyboardEvent) {
    let code = event.which || event.keyCode;
    if (code != 13 && code != 8) {
      this.chatService.usuarioEscribiendoConversacion(c);
    }
    // Inicia la validación si es un shortcut
    this.validarShortcut(event, c);
    // Fin validación shortcut
  }

  validarShortcut(event: KeyboardEvent, c: Conversacion) {
    let code = event.which;
    let shortcut: ShortCut = { activo: true };
    if ((event.ctrlKey || event.altKey || event.shiftKey) && (this.shortcutsService.iniciadores.indexOf(code) == (-1))) {
      // console.log('encuentra cosas', event);
      if (event.ctrlKey) {
        shortcut.ctrl = true;
      }
      if (event.altKey) {
        shortcut.alt = true;
      }
      if (event.shiftKey) {
        shortcut.shift = true;
      }
      shortcut.comando = code;
      let s = this.shortcuts.find(s => {

        return (s.comando == shortcut.comando && (((s.ctrl && shortcut.ctrl) || (!s.ctrl && !shortcut.ctrl)) && ((s.alt && shortcut.alt) || (!s.alt && !shortcut.alt)) && ((s.shift && shortcut.shift) || (!s.shift && !shortcut.shift))));
      });
      // console.log('encuentra cosas', s, shortcut.alt);
      if (s) {
        event.preventDefault();
        event.stopPropagation();
        if (!c.texto_mensaje) {
          c.texto_mensaje = '';
        }
        c.texto_mensaje += this.reemplazaVariablesShortcut(s.guion, c);
        // console.log('encuentra cosas');

      }

    }
  }

  reemplazaVariablesShortcut(cadena: string, c: Conversacion): string {
    cadena = cadena.replace('{nombre_cliente}', c.cliente.nombre);
    cadena = cadena.replace('{correo_cliente}', c.cliente.correo);
    cadena = cadena.replace('{categoria}', c.nombre_producto);
    cadena = cadena.replace('{fecha_actual}', moment().format('DD-MM-YYYY hh:mm:ss a'));
    cadena = cadena.replace('{busqueda}', c.texto_busqueda);
    cadena = cadena.replace('{id_conversacion}', c.idtbl_conversacion);
    return cadena;
  }

  toggleNotas(c: Conversacion) {
    this.fireStore.doc('conversaciones/' + c.codigo).set({ notas_voz: c.notas_voz }, { merge: true });
  }

  cerrarChat(c: Conversacion) {
    this.dialog.open(CerrarChatExpertoComponent).afterClosed().subscribe(d => {
      if (d && d.motivo) {
        let estado = 3;
        this.chatService.cerrarConversacion(c, estado, d.motivo).then(() => {
          c.mostrar_encuesta = true;
          if (this.user.experto_activo) {
            this.recibirChatAutomatico();
          }
        });
      }
    });

  }

  validaRecomendacionConversacion(c: Conversacion) {
    // console.log(c);
    if (c.conversacion_recomendada) {
      if (!c.muestra_interfaz_recomendacion) {
        c.muestra_boton_recomendacion = true;
        this.fireStore.doc('conversaciones/' + c.codigo).update({ muestra_boton_recomendacion: c.muestra_boton_recomendacion, mostrar_encuesta: c.mostrar_encuesta, encuesta_realizada: c.encuesta_realizada });
      }

      return true;
    } else {
      return false;
    }
  }

  finalizaEncuesta(c: Conversacion) {
    c.mostrar_encuesta = false;
    c.encuesta_realizada = true;
    if (!this.validaRecomendacionConversacion(c)) {
      if (this.chat.codigo == c.codigo) {
        delete this.chat;
      }
      this.fireStore.doc('expertos/' + this.user.getId() + '/chats/' + c.codigo).delete();
    }
  }

  iniciarVideollamada(c: Conversacion) {
    c.buscando_llamada = true;
    this.chatService.iniciarVideollamada(c).then(d => {
      // console.log('creo', d);
      // this.enviarMensaje(c, 4, d);
      c.buscando_llamada = false;
      this.fireStore.doc('conversaciones/' + c.codigo).update({ llamada_activa: true, url_llamada: d });
    });
  }

  finalizarLlamada(c: Conversacion) {
    this.chatService.finalizarVideollamada(c).then(() => {

    });
  }

  sugerirPregunta(c: Conversacion) {
    c.muestra_interfaz_recomendacion = true;
    c.muestra_boton_recomendacion = false;
    this.fireStore.doc('conversaciones/' + c.codigo).update({ muestra_interfaz_recomendacion: true, muestra_boton_recomendacion: false });
    this.chatService.aceptarSugerenciaNlp(c);
  }

  actualizaMensajeSugerido(m: Mensaje) {
    this.fireStore.doc('conversaciones/' + m.codigo + '/mensajes/' + m.id).set(m);
    //this.fireStore.collection('conversaciones/' + m.codigo + '/mensajes').doc(m.id).set(m);
  }

  rechazarSugerencia(c: Conversacion) {
    if (this.chat.codigo == c.codigo) {
      delete this.chat;
    }
    this.fireStore.doc('expertos/' + this.user.getId() + '/chats/' + c.codigo).delete();
  }

  irSugerencia(c: Conversacion) {
    let texto = '';
    c.mensajes.forEach((m: Mensaje) => {
      if (m.mensaje_sugerido) {
        texto += `\n` + m.texto;
      }
    });
    this.chatService.sugerencia_activa = true;
    this.chatService.texto_mensajes_sugeridos = texto;
    this.rechazarSugerencia(c);
    setTimeout(() => {
      this.router.navigate(['/formulario-preguntas-flujo-curaduria/sugerida']);
    }, 1);

  }

  chatPendiente(c: Conversacion) {
    this.dialog.open(ChatPendienteComponent).afterClosed().subscribe(d => {

      let estado = 7;
      this.chatService.conversacionPendiente(c, estado, d.hora_recordatorio).then(() => {
        //c.mostrar_encuesta = true;
        if (this.chat.codigo == c.codigo) {
          delete this.chat;
        }
        if (this.user.experto_activo) {
          this.recibirChatAutomatico();
        }
      });

    });
  }

  descargarChat(c) {
    this.loading = true
    this.chatService.generarPdf(c.idtbl_conversacion).then((d) => {
      if (d.success) {
        let file = d.file;
        const byteCharacters = atob(file);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        this.file_url = URL.createObjectURL(blob);
  
        let date = moment(c.fecha_creacion).format('YYYY-MM-DD');
        let hour = moment(c.fecha_creacion).format('HH:mm');

        let link = document.createElement("a");
        link.href = this.file_url;
        link.download = `soporte-chat-conecta-${date}-${hour}.pdf`;
        window.document.body.appendChild(link);
        link.click();
        this.loading = false;
      }
    });
  }
}
