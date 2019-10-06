import { Component, ChangeDetectorRef, ViewChild, ModuleWithComponentFactories, NgZone } from '@angular/core';
import { UserService } from '../providers/user.service';
import { ChatService } from '../providers/chat.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../schemas/user.schema';
import { Conversacion } from '../../schemas/conversacion.schema';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { Mensaje } from '../../schemas/mensaje.schema';
import { Configuracion, ShortCut } from '../../schemas/interfaces';
import { SonidosService } from '../providers/sonidos.service';
import swal from 'sweetalert2';
import { UtilsService } from '../providers/utils.service';
import { MatDialog } from '@angular/material';
import { TransferenciaChatComponent } from '../components/transferencia-chat/transferencia-chat.component';
import { ShortcutsService } from '../providers/shortcuts.service';
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
  constructor(private userService: UserService, private chatService: ChatService, private fireStore: AngularFirestore, private changeRef: ChangeDetectorRef, private ngZone: NgZone, private soundService: SonidosService, private utilService: UtilsService, private dialog: MatDialog, private shortcutsService: ShortcutsService) {

    this.user = this.userService.getUsuario();
    if (this.user) {
      this.init();
    }
    this.userService.observableUsuario.subscribe(u => {
      this.user = u;
      if (this.user) {
        this.init();
      }
    })
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
        this.fireStore.collection('expertos').doc('' + this.user.getId()).valueChanges().subscribe((d: any) => {
          d.activo = true;
          this.fireStore.collection('expertos').doc('' + this.user.getId()).set(d);
        });
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
                    if (paso_por_chats)
                      this.recibirChatAutomatico();

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
            });
          });

        });
      });
    });
    this.chatService.getExpertos().then(e => {
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
            if (experto.activo && duration < 11) {
              e.activo_chat = true;
            } else {
              e.activo_chat = false;
            }
          }
        });
      });
    })
  }

  recibirChatAutomatico() {
    let config = this.buscarConfiguracion(2);
    this.chatService.getConversacionesExperto().then((conversaciones: Array<Conversacion>) => {
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
    });

  }

  agregaListenerConversacion(c: Conversacion) {
    this.fireStore.doc('conversaciones/' + c.codigo).snapshotChanges().subscribe(datos => {
      let data = datos.payload.data() as Conversacion;
      c.id_estado_conversacion = data.id_estado_conversacion;
      if (c.id_estado_conversacion != 1 && c.id_estado_conversacion != 2) {
        c.mostrar_encuesta = true;
        this.recibirChatAutomatico();
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
      this.chatService.getConversacionExperto(e.idtbl_usuario).then(codigo => {
        e.conversacion_experto = new Conversacion(this.user.getId(), 2, codigo);
        e.conversacion_experto.cliente = JSON.parse(JSON.stringify(e));
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
        this.recibirChatAutomatico();
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
    c.listener_mensajes = c.messages.subscribe(d => {
      this.procesarMensajes(d, c, primera_vez, 0);

      primera_vez = false;


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

  async procesarMensajes(d: Array<Mensaje>, c: Conversacion, primera_vez: boolean, i: number) {
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
      if (!c.mensajes[i]) {
        c.mensajes[i] = m;
        if (!primera_vez && !c.focuseado) {
          this.soundService.sonar(1);
          c.mensajes_nuevos = true;
        } else {

        }
      } else {
        c.mensajes[i].estado = m.estado;
      }
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
      this.procesarMensajes(d, c, primera_vez, i);
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
    c.focuseado = estado;
    if (estado) {
      c.mensajes_nuevos = false;
      c.mostrar_emojis = false;
    }
  }

  seleccionarEmoji(evento, c: Conversacion) {
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
    if ((chat.texto_mensaje && chat.texto_mensaje != '') || chat.archivo_adjunto || tipo_mensaje == 3) {
      if (!chat.texto_mensaje) {
        chat.texto_mensaje = '';
      }
      let m = new Mensaje();
      m.id_usuario = this.user.getId();
      m.texto = chat.texto_mensaje;
      chat.texto_mensaje = '';
      m.fecha_mensaje = moment();
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
    let estado = 3;
    this.chatService.cerrarConversacion(c, estado).then(() => {
      c.mostrar_encuesta = true;
      this.recibirChatAutomatico();
    });
  }

  finalizaEncuesta(c: Conversacion) {
    if (this.chat.codigo == c.codigo) {
      delete this.chat;
    }
    this.fireStore.doc('expertos/' + this.user.getId() + '/chats/' + c.codigo).delete();
  }
}
