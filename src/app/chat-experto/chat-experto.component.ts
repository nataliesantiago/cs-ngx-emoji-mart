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
import { Configuracion } from '../../schemas/interfaces';
import { SonidosService } from '../providers/sonidos.service';
import swal from 'sweetalert2';
import { UtilsService } from '../providers/utils.service';
import { MatDialog } from '@angular/material';
import { TransferenciaChatComponent } from '../components/transferencia-chat/transferencia-chat.component';
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
  chat: Conversacion;
  obligaCambio = true;
  @ViewChild('contenedor') componentRef?: PerfectScrollbarComponent;
  configuraciones = [];

  constructor(private userService: UserService, private chatService: ChatService, private fireStore: AngularFirestore, private changeRef: ChangeDetectorRef, private ngZone: NgZone, private soundService: SonidosService, private utilService: UtilsService, private dialog: MatDialog) {

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
    this.chatService.getConfiguracionesChat().then(configs => {
      this.configuraciones = configs.configuraciones;
      this.userService.getFilasExperto().then(() => {
        this.fireStore.collection('expertos').doc('' + this.user.getId()).valueChanges().subscribe((d: any) => {
          d.activo = true;
          this.fireStore.collection('expertos').doc('' + this.user.getId()).set(d);
        });
        this.user.filas.forEach(f => {
          let fila = { chats: null, id: f.id_categoria_experticia };
          //this.chats_cola.push(fila)
          let cola = this.fireStore.collection('categorias_experticia/' + f.id_categoria_experticia + '/chats').valueChanges();
          cola.subscribe(chats => {

            let tmp = [];

            if (chats.length < 1) {
              fila.chats = [];
              this.procesaFilas(fila);
            } else {
              chats.forEach((c: any, index) => {
                let refConversacion = c.conversacion;
                this.fireStore.doc('conversaciones/' + refConversacion).snapshotChanges().subscribe(datos => {
                  let c: Conversacion = datos.payload.data() as Conversacion;
                  c.codigo = refConversacion;
                  if (c.id_estado_conversacion == 1 && chats.length > 0) {
                    this.userService.getInfoUsuario(c.id_usuario_creador).then((d: User) => {
                      c.cliente = d;
                      tmp.push(c);
                      if (index == chats.length - 1) {
                        fila.chats = tmp;
                        this.procesaFilas(fila);
                      }
                    });
                  } else {
                    this.chats_cola[index].chats = [];
                  }
                });
              });
            }
          })
        });
        let chats = this.fireStore.collection('expertos/' + this.user.getId() + '/chats').valueChanges();
        chats.subscribe((chats: Array<Conversacion>) => {
          //this.chats_experto = [];
          let temporal = [];
          //this.chats_experto = [];
          chats.forEach((c: any, index) => {
            let refConversacion = c.conversacion;
            let test = this.chats_experto.find(co => {
              return co.codigo == refConversacion;
            });


            this.fireStore.doc('conversaciones/' + refConversacion).valueChanges().subscribe((d: Conversacion) => {
              let c = d;
              c.codigo = refConversacion;

              this.agregarListenerMensajes(c);
              this.userService.getInfoUsuario(c.id_usuario_creador).then((d: User) => {
                //// console.log(d);
                c.cliente = d;
                if (c.id_estado_conversacion != 1)
                  temporal.push(c);
                if (!this.chat) {
                  this.obligaCambio = false;
                  this.onSelect(c);
                }
                if (index == (chats.length - 1)) {
                  if (temporal.length > this.chats_experto.length) {
                    this.soundService.sonar(2);
                  }
                  this.chats_experto = temporal
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
    })
  }

  filtraExpertos() {
    this.expertos_filtro = this.expertos.filter(e => {
      return (this.utilService.normalizeText(e.nombre).toLowerCase().indexOf(this.buscar_experto.toLowerCase()) != (-1) || this.utilService.normalizeText(e.correo).toLowerCase().indexOf(this.buscar_experto.toLowerCase()) != (-1));
    })
  }

  abrirConversacionExperto(e: User) {
    if (e.conversacion_experto) {
      this.onSelect(e.conversacion_experto);
    } else {
      this.chatService.getConversacionExperto(e.idtbl_usuario).then(codigo => {
        e.conversacion_experto = new Conversacion(this.user.getId(), 2, codigo);
        e.conversacion_experto.cliente = JSON.parse(JSON.stringify(e));
        this.agregarListenerMensajes(e.conversacion_experto);
        this.onSelect(e.conversacion_experto);
      })
    }
  }

  trasnferirChat(c: Conversacion) {
    this.dialog.open(TransferenciaChatComponent, { width: '400px' });
  }

  procesaFilas(fila: any) {
    let existe = false;
    let indice;
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
    c.messages.subscribe(d => {

      d.forEach((m: Mensaje, i) => {

        if (m.es_nota_voz) {
          m.audioControls = { reproduciendo: false, segundo: m.duracion, min: 0, max: m.duracion };
        }
        if (!c.mensajes[i]) {
          c.mensajes[i] = m;
          if (!primera_vez && !c.focuseado) {
            this.soundService.sonar(1);
            c.mensajes_nuevos = true;
          }
        } else {
          c.mensajes[i].estado = m.estado;
        }
        if (i == d.length - 1) {
          c.ultimo_mensaje = m;
          if (m.es_nota_voz) {
            c.ultimo_mensaje.label = 'Nota de voz';
          } else if (m.es_archivo) {
            c.ultimo_mensaje.label = 'Archivo adjunto';
          } else {
            c.ultimo_mensaje.label = m.texto;
          }
        }
      });
      /*this.ngZone.runOutsideAngular(() => {
        this.passByMensajes(c.mensajes, 0);
      });*/
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
            let ue = { id: id, nombre: data.nombre, timeout: null };
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

  asignarAudio(m: Mensaje, audio: HTMLAudioElement) {
    //audio.load();

    m.audio = audio;
    audio.addEventListener('durationchange', e => {
      let target = <HTMLAudioElement>e.target;
      m.audioControls.max = Math.ceil(target.duration);

    });
    audio.addEventListener('timeupdate', e => {
      let target = <HTMLAudioElement>e.target;
      m.audioControls.segundo = target.currentTime;
    })

    audio.addEventListener('pause', e => {
      let target = <HTMLAudioElement>e.target;
      m.audioControls.reproduciendo = false;
    });
    audio.addEventListener('play', e => {
      let target = <HTMLAudioElement>e.target;
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
    chat.mensajes_nuevos = false;
    this.setFocus(chat, true);
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
          break;
      }
      chat.mensajes.push(m);
      /*this.ngZone.runOutsideAngular(() => {
        chat.mensajes.push(m);
        this.passByMensajes(chat.mensajes, 0);
      });*/
      this.chatService.usuarioDejaEscribir(chat, this.user.getId());
      chat.texto_mensaje = '';
      if (comp) {
        setTimeout(() => {
          chat.ocultar_nuevos_mensajes = true;
          comp.directiveRef.scrollToBottom();
        }, 1);
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

  adjuntarNotaVoz(c: Conversacion, file: File, duration: number) {

    c.cargando_archivo = true;
    c.grabando_nota = false;
    this.chatService.adjuntarArchivosServidor(file, true).then(archivo => {
      this.enviarMensaje(c, 3, archivo.url, null, null, duration);
      c.cargando_archivo = false;
    });
  }

  quitarArchivoAdjunto(c: Conversacion, input: HTMLInputElement) {
    delete c.archivo_adjunto;
    input.value = "";
  }

  grabarNotaVoz(c: Conversacion) {

    let minutos = parseInt(this.buscarConfiguracion(7).valor);
    let tiempo = minutos * 60;
    const options = { mimeType: 'audio/webm' };
    let detenido = false;
    let calculaTiempo = { fechaIni: null, fechaFin: null };
    if (!this.stream) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          this.stream = stream;
          c.mediaRecorder = new StereoAudioRecorder(stream, {
            sampleRate: 48000,
            get16BitAudio: true,
            bufferSize: 4096,
            numberOfAudioChannels: 1
          });
          this.startTimer(tiempo, c).then(() => {
            c.mediaRecorder.stop(audioBlob => {
              this.onStopRecordingNotaVoz(audioBlob, c);

            });
          });

        });
    } else {
      c.mediaRecorder = new StereoAudioRecorder(this.stream, {
        sampleRate: 48000,
        get16BitAudio: true,
        bufferSize: 4096,
        numberOfAudioChannels: 1
      });
      this.startTimer(tiempo, c).then(() => {
        c.mediaRecorder.stop(audioBlob => {
          this.onStopRecordingNotaVoz(audioBlob, c);

        });
      });
    }



  }

  onStopRecordingNotaVoz(audioBlob: Blob, c: Conversacion) {
    var voice_file = new File([audioBlob], 'nota_voz_' + moment().unix() + '.wav', { type: 'audio/wav' });
    delete c.mediaRecorder;
    var duration = moment().diff(moment(c.inicia_grabacion), 'seconds');
    this.adjuntarNotaVoz(c, voice_file, duration);
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
      }, 1000);
    });

  }

  enviarNota(c: Conversacion) {
    c.mediaRecorder.stop(audioBlob => {
      this.onStopRecordingNotaVoz(audioBlob, c);
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
  }
  toggleNotas(c: Conversacion) {
    this.fireStore.doc('conversaciones/' + c.codigo).set({ notas_voz: c.notas_voz }, { merge: true });
  }
}
