import { Component, ChangeDetectorRef, ViewChild, ModuleWithComponentFactories, NgZone, Input, Output, EventEmitter, OnInit, ViewChildren, ElementRef } from '@angular/core';
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
import { TouchSequence } from 'selenium-webdriver';
import { EstadoExpertoService } from '../providers/estado-experto.service';
import * as uuid from 'uuid';
import { Experto } from '../../schemas/xhr.schema';
import { debounceTime } from 'rxjs/operators';

const moment = _rollupMoment || _moment;

declare var StereoAudioRecorder: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat-experto.component.html',
  styleUrls: ['./chat-experto.component.scss']
})
export class ChatExpertoComponent implements OnInit {
  ngOnInit() { }
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
  cantidad_mensajes_sin_leer_usuarios = 0;
  @Output() mensajes_nuevos: EventEmitter<number> = new EventEmitter<number>();
  file_url;
  loading = false;
  state: LogEstadoExperto = { id_usuario_experto: null, id_estado_experto_actual: null, id_estado_experto_nuevo: null, estado_ingreso: null };
  cerro_experto = false;
  intervalo;
  nombre_pestana = 'Conecta';
  new_messages = [];
  listeners_conversaciones = [];
  chats_listener;
  listener_cola = [];
  listener_fila;
  listener_activos;

  @ViewChild('escribirMensaje') escribir_mensaje: ElementRef;
  validando_automatico = false;
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
    window.addEventListener('beforeunload', (e) => {

      let pregunta = false;
      this.chats_experto.forEach(c => {
        if (c.id_estado_conversacion == 2) {
          pregunta = true;
        }
      })
      if (pregunta) {
        // console.log('bueno');
        //e.returnValue = 'Tienes conversaciones activas';
      } else {
        // console.log('malo');

      }
    });
  }

  init() {
    this.listeners_conversaciones = [];
    this.chatService.obtenerLimiteTexto().then(valor => {
      this.limite_texto_chat = valor;
    });
    this.shortcutsService.getShortcutsUsuario().then(shortcuts => {
      this.shortcuts = shortcuts;
    })
    let paso_por_chats = false;
    if (this.user.id_rol == 2) {

      this.chatService.getConfiguracionesChat().then(configs => {
        this.configuraciones = configs.configuraciones;
        // console.log(this.configuraciones);
        this.userService.getFilasExperto().then(() => {
          if (this.user.estado_actual != 7) {
            this.insertarLogEstadoExperto();
            this.userService.setActivoExpertoGlobal(1);
          }
          let cola = this.fireStore.collection('paises/' + this.user.pais + '/conversaciones/', ref => ref.where('id_estado_conversacion', '==', 1)).snapshotChanges();
          this.listener_fila = cola./*pipe(debounceTime(1000)).*/subscribe(async chaters => {
            let tmp = [];

            this.fila_chats.forEach((c: Conversacion) => {
              if (c.interval_tiempo_cola) {
                window.clearInterval(c.interval_tiempo_cola);
              }
            });


            chaters = chaters.filter((d) => {
              let c = d.payload.doc.data() as Conversacion;
              let pasa = false;
              if (c.categorias_ids) {
                c.categorias_ids.forEach(cate => {
                  if (this.user.filas_ids.indexOf(cate) != (-1)) {
                    pasa = true;
                  }
                })
              }
              return pasa;
            });
            if (chaters.length < 1) {
              this.fila_chats = [];
            } else {
              this.soundService.sonar(2);
            }
            chaters.forEach(async (d, index) => {
              let c = d.payload.doc.data() as Conversacion;
              c.cliente = await this.buscarUsuario(c.id_usuario_creador) as User;
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

              if (index == chaters.length - 1) {
                this.fila_chats = tmp;
                // console.log(this.user);
                if (this.user.estado_actual == 1) {
                  this.recibirChatAutomatico();
                }
              }
            })

          });



          let chats = this.fireStore.collection('paises/' + this.user.pais + '/' + 'expertos/' + this.user.getId() + '/chats').valueChanges();
          this.listener_activos = chats.subscribe(chaters => {
            /* this.chats_experto.forEach((c: Conversacion) => {
               c.listener_mensajes.unsubscribe();
               c.listener_conversacion.unsubscribe();
             });*/
            this.chatService.getConversacionesExperto().then(async chat => {
              // console.log('chats', chat);
              if (!chat) {
                chat = [];

              }
              let temporal: Array<Conversacion> = [];



              if (chat.length > 0) {
                this.soundService.sonar(2);
              }

              if (chat.length < 1) {
                // this.chats_experto = [];

                if (this.chat && this.chat.id_tipo_conversacion == 1) {

                  delete this.chat;
                }
              }

              /*
               Logica para mantener los objetos y nos destruirlos hasta que la conversacion finalice o sea trasnferida
              */
              let finales = [];
              let eliminar = [];
              let nuevos = [];
              this.chats_experto.forEach((c: Conversacion) => {
                let conversa = chat.find((co: Conversacion) => {
                  return co.codigo === c.codigo;
                });
                if (conversa) {
                  finales.push(c);
                } else {
                  eliminar.push(c);
                }
              });
              // console.log(finales);
              chat.forEach((c: Conversacion) => {
                let t = finales.find((cc: Conversacion) => {
                  return cc.codigo === c.codigo;
                });
                if (!t) {
                  nuevos.push(c);
                }
              });

              /*console.log(nuevos);
              console.log(finales);
              console.log(eliminar);*/
              eliminar.forEach((c: Conversacion) => {
                c.listener_conversacion.unsubscribe();
                c.listener_mensajes.unsubscribe();
              });
              if (nuevos.length < 1) {
                this.chats_experto = finales;
              }
              let index = 0;
              for (let c of nuevos) {
                c = c as Conversacion;
                let codigo = c.codigo;
                let d = await this.chatService.getDocumentoFirebase('paises/' + this.user.pais + '/conversaciones/' + codigo);
                c = d;
                temporal.push(c);
                c.codigo = codigo;
                if (index == (nuevos.length - 1)) {
                  paso_por_chats = true;

                  this.chats_experto = [...finales, ...temporal];
                  this.changeRef.detectChanges();
                }
                let us = await this.buscarUsuario(c.id_usuario_creador) as User;
                //// // console.log(d);
                c.cliente = us;
                // this.changeRef.detectChanges();
                this.agregarListenerMensajes(c);
                this.agregaListenerConversacion(c);
                if (!this.chat) {
                  this.obligaCambio = false;
                  this.onSelect(c);
                }
                this.chatService.buscarHistorialClienteUsuario(c.id_usuario_creador).then(historial => {
                  c.historial = historial;
                });
                index++;
              }

              //this.chats_experto = finales.concat(nuevos);
              //console.log(this.chats_experto);
              ///////////////////////////////////////////////////////////////////////////////////////////////////////


              /* chat.forEach((change: any, index) => {
                 let codigo = change.codigo;
                 this.chatService.getDocumentoFirebase('paises/' + this.user.pais + '/conversaciones/' + codigo).then((d: Conversacion) => {
                   let c = d;
                   c.codigo = codigo;
                   this.buscarUsuario(c.id_usuario_creador).then((d: User) => {
                     //// // console.log(d);
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
                       // this.changeRef.detectChanges();
                     }
                   });
                   this.chatService.buscarHistorialClienteUsuario(c.id_usuario_creador).then(historial => {
                     c.historial = historial;
                   })
                 });
               });*/

            });
          });
        });
      });
    }




    this.chatService.getColegasChat().then(e => {
      this.expertos = this.expertos_filtro = e.filter(experto => {
        return experto.idtbl_usuario != this.user.getId();
      });
      // // console.log(this.expertos);
      this.expertos.forEach(e => {
        this.fireStore.doc('paises/' + this.user.pais + '/' + 'expertos/' + e.idtbl_usuario).valueChanges().subscribe((experto: any) => {

          if (!experto || !experto.fecha) {
            e.activo_chat = false;
            e.estado_actual_experto = "Desconectado";
          } else {

            e.atendiendo_emergencia = experto.atendiendo_emergencia;
            var duration = moment(new Date()).unix() - experto.fecha.seconds;
            // console.log(e.nombre, experto.fecha.seconds, duration);
            if (experto.activo && duration < 30) {
              if (!e.activo_chat) {
                e.activo_chat = true;
              }
              e.estado_actual_experto = experto.estado_experto;

            } else {
              e.activo_chat = false;
              e.estado_actual_experto = experto.estado_experto;
            }

          }
          this.abrirConversacionExperto(e, true);
          //console.log(e);
        });
      });
    })
  }

  async buscarUsuario(id_usuario: number) {
    return new Promise((resolve, reject) => {
      let u = this.usuarios.find((user: User) => {
        return user.idtbl_usuario === id_usuario;
      });
      if (u) {
        resolve(u);
      } else {
        this.userService.getInfoUsuario(id_usuario).then(u => {
          this.usuarios.push(u);
          resolve(u);
        })
      }
    });

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
              // console.log('Encontro mensaje', m.texto.toLowerCase());
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
    if (this.user.estado_actual != 1) {
      this.state.id_usuario_experto = this.user.getId();
      this.state.id_estado_experto_actual = this.user.estado_actual;
      this.state.id_estado_experto_nuevo = 1;
      this.state.estado_ingreso = 1;
      this.estadoExpertoService.createLogState(this.state);
    }
  }

  recibirChatAutomatico() {
    if (!this.validando_automatico) {
      this.validando_automatico = true;
      let config = this.utilService.buscarConfiguracion('cantidad_usuarios_simultaneos_operador');

      this.chatService.getConversacionesExperto().then(async (conversaciones: Array<Conversacion>) => {
        if (config) {
          conversaciones = conversaciones.filter((c: Conversacion) => {
            return c.id_estado_conversacion == 2;
          });
          if (parseInt(config.valor) > conversaciones.length) {
            let chats = this.fila_chats;
            /*this.chats_cola.forEach(f => {
              chats = chats.concat(f.chats);
            });
            */
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
            let disponibilidad = await this.chatService.getDisponibilidadExperto();
            console.log('disponibilidad: ', disponibilidad, c, new Date().getTime());
            if (c && disponibilidad && !c.id_experto_actual) {
              this.onSelectCola(c).then(r => {
                if (chats.length > 0) {
                  this.recibirChatAutomatico();
                }
              });
            }
            this.validando_automatico = false;

          } else {
            console.log('No tengo cupo');
            this.validando_automatico = false;
          }


        } else {
          this.validando_automatico = false;
        }
      });
    }

  }

  ngOnDestroy() {
    // console.log('destruyendo listeners ', this.listeners_conversaciones.length);
    this.listeners_conversaciones.forEach(l => {
      if (l)
        l.unsubscribe();
    });
    this.chats_experto.forEach(c => {
      if (c.listener_mensajes)
        c.listener_mensajes.unsubscribe();
    });
    this.chats_experto.forEach((c: Conversacion) => {
      c.codigo_abandonado = true;
    });

    this.listener_cola.forEach(lc => {
      if (lc)
        lc.unsubscribe();
    });
    if (this.listener_fila) {
      this.listener_fila.unsubscribe();
    }
    if (this.listener_activos) {
      this.listener_activos.unsubscribe();
    }

  }

  toggleRecomendacion(c: Conversacion) {

    this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ recomendacion_manual: c.recomendacion_manual });
  }

  agregaListenerConversacion(c: Conversacion) {


    let l = c.listener_conversacion = this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).snapshotChanges().subscribe(datos => {
      let data = datos.payload.data() as Conversacion;
      if (data && data.id_experto_actual != this.user.getId()) {
        //this.fireStore.doc('paises/' + this.user.pais + '/' + 'expertos/' + this.user.getId() + '/chats/' + data.codigo).delete();
      } else if (data) {
        c.id_estado_conversacion = data.id_estado_conversacion;
        c.mensajes_nuevos = data.mensajes_nuevos;
        c.llamada_activa = data.llamada_activa;
        c.url_llamada = data.url_llamada;
        c.conversacion_recomendada = data.conversacion_recomendada;
        c.cerro_experto = c.cerro_experto ? c.cerro_experto : false;
        c.motivo_cierre_enviado = c.motivo_cierre_enviado ? c.motivo_cierre_enviado : false;
        c.esta_pendiente = c.esta_pendiente ? c.esta_pendiente : false;
        c.mostro_modal_cierre = c.mostro_modal_cierre ? c.mostro_modal_cierre : false;
        c.mostrar_encuesta = data.mostrar_encuesta;
        if (c.id_estado_conversacion == 3 || c.id_estado_conversacion == 4 || c.id_estado_conversacion == 5 || c.id_estado_conversacion == 6) {
          if (!c.cerro_experto && c.esta_seleccionado && !c.motivo_cierre_enviado && !c.esta_pendiente && !c.mostro_modal_cierre) {
            // console.log('listener', c.cerro_experto, c.esta_seleccionado, c.motivo_cierre_enviado, c.esta_pendiente);
            if (c.grabando_nota) {
              this.quitarNotaVoz(c);
            }
            c.mostro_modal_cierre = true;
            if (!c.codigo_abandonado) {
              this.motivoCierreChat(c);

            }
          }
        }

        if (data.id_estado_conversacion == 4) {
          c.cerrado_inactividad = true;
          this.mensajeInactividadDesconexion(c);
        }
        if (data.id_estado_conversacion == 5) {
          c.cerrado_inactividad = true;
          this.mensajeInactividadCliente(c);
        }
        if (data.id_estado_conversacion == 6) {
          c.cerrado_inactividad = true;
          this.mensajeInactividadExperto(c);
        }
      }
    });
    this.listeners_conversaciones.push(l);
  }

  obtenerEncuestaExperto(c) {
    this.chatService.obtenerEncuestaExperto().then((d: any) => {
      if (d.encuesta.length == 0) {
        this.validarCerrarConversacion(c);
      } else {
        if (!c.encuesta_realizada) {
          c.mostrar_encuesta = true;
        }
      }
    });
  }

  filtraExpertos() {
    this.expertos_filtro = this.expertos.filter(e => {
      let busqueda = this.utilService.normalizeText(this.buscar_experto).toLowerCase();
      return (
        this.utilService.normalizeText(e.estado_actual_experto).toLowerCase().indexOf(busqueda) != (-1) ||
        this.utilService.normalizeText(e.nombre).toLowerCase().indexOf(busqueda) != (-1) ||
        this.utilService.normalizeText(e.correo).toLowerCase().indexOf(busqueda) != (-1));
    });
  }

  abrirConversacionExperto(e: User, oculta?: boolean) {
    if (e.conversacion_experto && !oculta) {
      //console.log(e);
      e.conversacion_experto.cliente.estado_actual_experto = e.estado_actual_experto;
      this.onSelect(e.conversacion_experto);
    } else if (!e.conversacion_experto) {
      this.chatService.getConversacionExperto(e.idtbl_usuario).then(data => {

        e.conversacion_experto = new Conversacion(this.user.getId(), 2, data.codigo);
        e.conversacion_experto.cliente = JSON.parse(JSON.stringify(e));
        e.conversacion_experto.idtbl_conversacion = data.idtbl_conversacion;
        this.agregarListenerMensajes(e.conversacion_experto);
        if (!oculta) {
          this.onSelect(e.conversacion_experto);
        }
      });
    } else if (e.conversacion_experto) {
      e.conversacion_experto.cliente.estado_actual_experto = e.estado_actual_experto;
    }
  }

  trasnferirChat(c: Conversacion) {
    c.ventana_transferencia = this.dialog.open(TransferenciaChatComponent, { width: '400px', data: { conversacion: c } });

    c.ventana_transferencia.afterClosed().subscribe((result) => {
      if (result && result.success) {
        if (this.user.experto_activo) {
          this.recibirChatAutomatico();
        }
        this.onSelect(null);
        delete c.ventana_transferencia;
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

    });

    if (!existe) {

      this.chats_cola.push(fila);
    } else {
      this.chats_cola[indice].chats = fila.chats;
    }
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
    // console.log(this.fila_chats);

  }

  buscarConfiguracion(id: number | string): Configuracion {

    return this.configuraciones.find((c: Configuracion) => {

      return c.idtbl_configuracion === id || c.nombre == id;
    });
  }

  agregarListenerMensajes(c: Conversacion) {
    c.mensajes = [];
    c.primera_vez = true;
    c.cantidad_mensajes_nuevos = 0;
    c.messages = this.fireStore.collection('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo + '/mensajes', ref =>
      ref.orderBy('fecha_mensaje')
    ).valueChanges();
    c.listener_mensajes = c.messages.subscribe(async d => {
      if (!c.primera_vez && c.mensajes && c.mensajes.length < d.length) {
        c.cantidad_mensajes_nuevos += d.length - c.mensajes.length;
      }
      //// console.log('Escucha mensajes del colega', c.cantidad_mensajes_nuevos);
      let mensajes_nuevos = await this.procesarMensajes(d, c, c.primera_vez, 0, []);
      c.mensajes = this.utilService.getUnique(c.mensajes.concat(mensajes_nuevos), 'uuid');

      c.primera_vez = false;
      if (this.intervalo) {
        window.clearInterval(this.intervalo);
        document.title = this.nombre_pestana;
      }

      this.intervalo = setInterval(() => {
        if (document.title == this.nombre_pestana && !c.primera_vez) {

          this.cantidad_mensajes_sin_leer_usuarios = 0;
          this.chats_experto.forEach(chat => {
            this.cantidad_mensajes_sin_leer_usuarios += chat.cantidad_mensajes_nuevos;
          });

          if (this.cantidad_mensajes_sin_leer_usuarios > 0) {
            document.title = 'Mensajes(' + this.cantidad_mensajes_sin_leer_usuarios + ') nuevos en el chat';
          } else {
            document.title = this.nombre_pestana;
          }
        } else {
          document.title = this.nombre_pestana;
        }
      }, 1400);

      if (!c.primera_consulta) {
        c.mensajes.filter(m => {
          return m.id_usuario == c.id_usuario_creador && (!m.es_nota_voz && !m.es_archivo);
        }).forEach(m => {
          this.utilService.identificarPreguntaTexto(m.texto).then(rta => {
            if (rta && !c.primera_consulta) {
              c.primera_consulta = m.texto;
              c.busqueda_interna = m.texto;

              this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ primera_consulta: c.primera_consulta });
            }
          });
        })
      }

      this.cantidad_mensajes_sin_leer = 0;
      this.expertos.forEach(e => {
        if (e.conversacion_experto) {
          this.cantidad_mensajes_sin_leer += e.conversacion_experto.cantidad_mensajes_nuevos;
        }
      });
      this.mensajes_nuevos.emit(this.cantidad_mensajes_sin_leer);
    });
    this.fireStore.collection('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo + '/mensajes/').snapshotChanges().subscribe((changes: any) => {
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
    this.fireStore.collection('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo + '/usuarios_escribiendo/').snapshotChanges().subscribe((changes: any) => {
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
    for (let index = 0; index < d.length; index++) {
      const m = d[index];
      //// console.log(m);
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

      //  c.mensajes[i] = m;
      let bus: Mensaje = c.mensajes.find(mm => {
        return mm.uuid == m.uuid;
      });
      //// console.log(bus);
      if (!bus) {
        tmp.push(m);
      } else {
        bus.estado = m.estado;
      }
      if (d.length == (index + 1)) {
        c.ultimo_mensaje = m;
        if (m.es_nota_voz) {
          c.ultimo_mensaje.label = 'Nota de voz';
        } else if (m.es_archivo) {
          c.ultimo_mensaje.label = 'Archivo adjunto';
        } else {
          c.ultimo_mensaje.label = m.texto;
        }
      }

    }

    if (c.id_tipo_conversacion == 1) {
      if (!c.primera_vez && !c.focuseado && c.id_estado_conversacion == 2) {
        this.soundService.sonar(1);
        c.mensajes_nuevos = true;
        this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ mensajes_nuevos: true });
      }
    } else {
      if (!c.primera_vez && !c.focuseado) {
        this.soundService.sonar(1);
        c.mensajes_nuevos = true;
        this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ mensajes_nuevos: true });
      }
    }

    if (!c.primera_vez && !c.esta_seleccionado) {
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].id_usuario != this.user.idtbl_usuario) {
          if (!this.new_messages.includes(tmp[i].id_conversacion)) {
            this.new_messages.push(tmp[i].id_conversacion);
          }
        }
      }
    }
    return tmp;

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
      let d = Math.round(target.duration);
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
    if (this.chat) {
      this.chat.esta_seleccionado = false;
    }
    this.chat = chat;
    if (chat) {

      let index = this.new_messages.indexOf(chat.idtbl_conversacion);
      if (index >= 0) {
        this.new_messages.splice(index, 1);
      }

      chat.esta_seleccionado = true;
      chat.mensajes_nuevos = false;

      this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + chat.codigo).update({ mensajes_nuevos: false });
      this.setFocus(chat, true);
      if (chat.id_estado_conversacion == 3 || chat.id_estado_conversacion == 4 || chat.id_estado_conversacion == 5 || chat.id_estado_conversacion == 6) {
        chat.esta_seleccionado = false;
        if (!chat.motivo_cierre_enviado && !chat.mostro_modal_cierre) {
          //  console.log('select', chat.motivo_cierre_enviado, chat.mostro_modal_cierre);
          this.motivoCierreChat(chat);
        }
      }

    }
  }

  onSelectCola(c: Conversacion): Promise<any> {
    // this.chat = chat;
    // chat.mensajes_nuevos = false;
    return new Promise((resolve, reject) => {
      if (!c.chat_tomado || c.chat_tomado != this.user.getId()) {
        c.chat_tomado = this.user.getId();
        this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ chat_tomado: c.chat_tomado }).then(() => {
          this.chatService.asignarUsuarioExperto(this.user.getId(), c.idtbl_conversacion, c.codigo, false).then(u => {
            resolve(true);
          });
        }).catch(e => {
          console.log('Error asignando al experto');
          resolve(false);
        });
      }
    });

  }

  remplazaEmoji(c: Conversacion) {
    c.texto_mensaje = this.chatService.findEmojiData(c.texto_mensaje);
  }

  setFocus(c: Conversacion, estado: boolean) {
    c.focuseado = estado;
    c.mensajes_nuevos = false;
    this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ mensajes_nuevos: false });
    this.cantidad_mensajes_sin_leer -= c.cantidad_mensajes_nuevos;
    this.mensajes_nuevos.emit(this.cantidad_mensajes_sin_leer);
    c.cantidad_mensajes_nuevos = 0;
    if (estado) {
      c.mensajes_nuevos = false;
      c.mostrar_emojis = false;
    }
  }

  seleccionarEmoji(evento, c: Conversacion) {
    // console.log(evento.emoji);
    if (c.texto_mensaje) {
      c.texto_mensaje += '' + evento.emoji.native;
    } else {
      c.texto_mensaje = '';
      c.texto_mensaje += evento.emoji.native;
    }
    this.escribir_mensaje.nativeElement.focus();
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
      m.uuid = uuid.v4();
      m.tipo_conversacion = chat.id_tipo_conversacion;
      m.id_usuario = this.user.getId();
      if (tipo_mensaje == 1) {
        if (chat.texto_mensaje && chat.texto_mensaje != '') {
          m.texto = chat.texto_mensaje;
        } else {
          m.texto = '';
        }

      }
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

          if (chat.texto_mensaje && chat.texto_mensaje != '') {
            m.texto = chat.texto_mensaje;
          } else {
            m.texto = '';
          }
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
      // console.log(m);
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
      //this.fireStore.collection('paises/'+this.user.pais+'/'+'conversaciones/' + chat.codigo + '/mensajes').add(JSON.parse(JSON.stringify(m)));

      this.chatService.enviarMensaje(m).then(f => {
        // 'YYYY-MM-DD HH:mm:ss'
        // m.fecha_mensaje = moment(f);
      });
      if (tipo_mensaje == 1 || tipo_mensaje == 2) {
        delete chat.texto_mensaje;
      }
      if (tipo_mensaje == 2 || tipo_mensaje == 3) {
        delete chat.archivo_adjunto;
        delete chat.grabando_nota;
      }
      //this.changeRef.detectChanges();
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
    c.iniciando_grabacion = false;
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

    c.iniciando_grabacion = true;
    let minutos;

    minutos = parseInt(this.utilService.buscarConfiguracion('cantidad_tiempo_maximo_nota_voz').valor);

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
        this.startTimer(tiempo, c, comp).then(() => {
          c.mediaRecorder.stop(audioBlob => {
            this.onStopRecordingNotaVoz(audioBlob, c, comp);

          });

        }).catch(() => {
          c.iniciando_grabacion = false;
          swal.fire('Alerta', 'No se pudo acivar el micrófono, por favor habilítalo en la parte superior junto a la URL', 'error');
        });
      });
  }

  onStopRecordingNotaVoz(audioBlob: Blob, c: Conversacion, comp: PerfectScrollbarComponent) {
    let milli = (moment().valueOf() - c.inicia_grabacion);
    var duration = Math.round(milli / 1000);
    this.stream.getTracks().forEach(track => track.stop());
    var voice_file = new File([audioBlob], 'nota_voz_' + moment().unix() + '_' + this.user.getId() + '.wav', { type: 'audio/wav' });
    delete c.mediaRecorder;
    this.adjuntarNotaVoz(c, voice_file, duration, comp);


  }

  startTimer(duration: number, c: Conversacion, comp: PerfectScrollbarComponent): Promise<any> {

    var timer: number = duration;
    let minutes;
    let seconds;
    c.inicia_grabacion = moment().valueOf();

    return new Promise((resolve, reject) => {


      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      c.cuenta_regresiva = minutes + ":" + seconds;
      c.mediaRecorder.record();
      c.grabando_nota = true;

      this.chatService.usuarioEscribiendoConversacion(c, 2);
      c.interval_grabando = setInterval(() => {
        timer -= 1;
        minutes = Math.floor(timer / 60);
        seconds = Math.floor(timer % 60);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;





        if (timer <= 0) {
          c.cuenta_regresiva = minutes + ":" + seconds;
          this.enviarNota(c, comp);
        } else {
          c.cuenta_regresiva = minutes + ":" + seconds;
          this.chatService.usuarioEscribiendoConversacion(c, 2);
        }

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
    delete c.iniciando_grabacion;
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
      // // console.log('encuentra cosas', event);
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
      // // console.log('encuentra cosas', s, shortcut.alt);
      if (s) {
        event.preventDefault();
        event.stopPropagation();
        if (!c.texto_mensaje) {
          c.texto_mensaje = '';
        }
        c.texto_mensaje += this.reemplazaVariablesShortcut(s.guion, c);
        // // console.log('encuentra cosas');

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
    this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).set({ notas_voz: c.notas_voz }, { merge: true });
  }

  cerrarChat(c: Conversacion) {
    c.cerro_experto = true;
    let cliente = c.cliente.nombre;
    this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ cerro_experto: true }).then(() => {
      this.dialog.open(CerrarChatExpertoComponent, { width: '80%', data: { no_cerro_experto: false, cliente: cliente } }).afterClosed().subscribe(d => {
        if (d && d.motivo) {
          let estado = 3;
          this.chatService.cerrarConversacion(c, estado, d.motivo).then(() => {
            c.motivo_cierre_enviado = true;
            this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ motivo_cierre_enviado: true, mostrar_encuesta: true });
            this.obtenerEncuestaExperto(c);
            // console.log(this.user.experto_activo);
            if (this.user.experto_activo) {
              this.recibirChatAutomatico();
            }
          });
        }
      });
    });


  }

  validaRecomendacionConversacion(c: Conversacion) {
    if (c.conversacion_recomendada || c.recomendacion_manual) {
      if (!c.muestra_interfaz_recomendacion) {
        c.muestra_boton_recomendacion = true;
        this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ muestra_boton_recomendacion: c.muestra_boton_recomendacion, mostrar_encuesta: c.mostrar_encuesta, encuesta_realizada: c.encuesta_realizada });
      }

      return true;
    } else {
      return false;
    }
  }

  finalizaEncuesta(c: Conversacion) {
    c.mostrar_encuesta = false;
    c.encuesta_realizada = true;
    this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ mostrar_encuesta: c.mostrar_encuesta, encuesta_realizada: c.encuesta_realizada });
    this.validarCerrarConversacion(c);
  }

  validarCerrarConversacion(c) {
    if (!this.validaRecomendacionConversacion(c)) {
      if (this.chat.codigo == c.codigo) {
        delete this.chat;
      }
      this.fireStore.doc('paises/' + this.user.pais + '/' + 'expertos/' + this.user.getId() + '/chats/' + c.codigo).delete();
      c.listener_mensajes.unsubscribe();
      c.listener_conversacion.unsubscribe();
    }
  }

  iniciarVideollamada(c: Conversacion) {
    c.buscando_llamada = true;
    this.chatService.iniciarVideollamada(c).then(d => {
      // // console.log('creo', d);
      // this.enviarMensaje(c, 4, d);
      c.buscando_llamada = false;
      this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ llamada_activa: true, url_llamada: d });
    });
  }

  finalizarLlamada(c: Conversacion) {
    this.chatService.finalizarVideollamada(c).then(() => {

    });
  }

  sugerirPregunta(c: Conversacion) {
    c.muestra_interfaz_recomendacion = true;
    c.muestra_boton_recomendacion = false;
    this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ muestra_interfaz_recomendacion: true, muestra_boton_recomendacion: false });
    this.chatService.aceptarSugerenciaNlp(c);
  }

  actualizaMensajeSugerido(m: Mensaje) {
    this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + m.codigo + '/mensajes/' + m.id).set(m);
    //this.fireStore.collection('paises/'+this.user.pais+'/'+'conversaciones/' + m.codigo + '/mensajes').doc(m.id).set(m);
  }

  rechazarSugerencia(c: Conversacion) {
    if (this.chat.codigo == c.codigo) {
      delete this.chat;
    }
    this.fireStore.doc('paises/' + this.user.pais + '/' + 'expertos/' + this.user.getId() + '/chats/' + c.codigo).delete();
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
        c.esta_pendiente = true;
        this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ esta_pendiente: true });
        if (this.chat.codigo == c.codigo) {
          delete this.chat;
        }
        if (this.user.experto_activo) {
          this.recibirChatAutomatico();
        }
      });

    });
  }

  /**
   * habilita la modal para seleccionar un motivo de cierre cuando el chat ha sido cerrado por el usuario o por inactividad
   * @param c 
   */
  motivoCierreChat(c) {
    c.cerro_experto = false;
    let cliente = c.cliente.nombre;
    if (c.ventana_transferencia) {
      c.ventana_transferencia.close();
    }
    this.dialog.open(CerrarChatExpertoComponent, { width: '80%', data: { no_cerro_experto: true, cliente: cliente } }).afterClosed().subscribe(d => {
      if (d && d.motivo) {

        this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ motivo_cierre_enviado: true, mostrar_encuesta: true }).then(() => {
          this.chatService.cerrarConversacionUsuario(c, c.id_estado_conversacion, d.motivo).then(() => {
            c.motivo_cierre_enviado = true;
            this.obtenerEncuestaExperto(c);
            if (this.user.experto_activo) {
              this.recibirChatAutomatico();
            }
          });
        });
      }
    });
  }

  /**
   * obtiene el mensaje automatico de inactividad del cliente
   * @param chat 
   */
  mensajeInactividadCliente(chat) {
    this.chatService.getMensajesGenerales(chat.idtbl_conversacion, 8).then(result => {
      chat.mensaje_inactividad = result;
    });
  }

  /**
   * obtiene el mensaje automatico de inactividad del experto
   * @param chat 
   */
  mensajeInactividadExperto(chat) {
    this.chatService.getMensajesGenerales(chat.idtbl_conversacion, 7).then(result => {
      chat.mensaje_inactividad = result;
    });
  }

  /**
   * obtiene el mensaje automatico de inactividad por desconexion
   * @param chat 
   */
  mensajeInactividadDesconexion(chat) {
    this.chatService.getMensajesGenerales(chat.idtbl_conversacion, 9).then(result => {
      chat.mensaje_inactividad = result;
    });
  }
}
