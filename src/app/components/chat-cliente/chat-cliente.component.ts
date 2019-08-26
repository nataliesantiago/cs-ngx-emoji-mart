import { Component, OnInit, ChangeDetectorRef, ViewChild, ViewChildren, QueryList, NgZone } from '@angular/core';
import { UserService } from '../../providers/user.service';
import { Conversacion } from '../../../schemas/conversacion.schema';
import { AjaxService } from '../../providers/ajax.service';
import { User } from '../../../schemas/user.schema';
import { AngularFirestore } from '@angular/fire/firestore';
import { Mensaje } from '../../../schemas/mensaje.schema';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { tap, map } from 'rxjs/operators';
import { PerfectScrollbarDirective, PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ChatService } from '../../providers/chat.service';
import { Experto } from '../../../schemas/xhr.schema';
import { Configuracion } from '../../../schemas/interfaces';
import { SonidosService } from '../../providers/sonidos.service';
const moment = _rollupMoment || _moment;

declare var MediaRecorder: any;

@Component({
  selector: 'app-chat-cliente',
  templateUrl: './chat-cliente.component.html',
  styleUrls: ['./chat-cliente.component.scss']
})
export class ChatClienteComponent implements OnInit {
  chats: Array<Conversacion> = [];
  expertos = [];
  archivo_adjunto: any;
  urlAdjuntos: string;
  configuraciones;
  nombre_pestana = 'Conecta';
  intervalo;
  constructor(private userService: UserService, private ajax: AjaxService, private fireStore: AngularFirestore, private changeRef: ChangeDetectorRef, private chatService: ChatService, private ngZone: NgZone, private soundService: SonidosService) {
    this.user = this.userService.getUsuario();
    this.urlAdjuntos = this.ajax.host + 'chat/adjuntarArchivo';
    if (this.user) {
      this.init();
    }
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
        this.init();
      } else {
        delete this.user;
        this.chats = [];
      }
    });
    //// console.log(this.user.getId());
    this.chatService.nuevasConversaciones.subscribe(d => {
      this.openChat(d);
    });
  }
  them;
  user: User;
  sidePanelOpened = true;

  // MESSAGE
  selectedMessage: any = {
    from: 'Kalu valand',
    photo: 'assets/images/users/1.jpg',
    subject: 'Arti thai gai ne?',
  };

  init() {
    this.chatService.getConfiguracionesChat().then(configs => {
      this.configuraciones = configs;
      this.chatService.getConversacionesCLiente().then(chats => {
        this.chats = chats;
        this.chats.forEach(c => {
          this.agregarListenerMensajes(c);
          c.expertos = [];
          if (c.id_experto_actual) {
            c.asesor_actual = new User(null, null, null);
            c.asesor_actual.idtbl_usuario = c.id_experto_actual;
            c.asesor_actual.nombre = c.nombre_experto_actual;
            c.asesor_actual.url_foto = c.url_foto;
          }
          if (c.filas && c.id_estado_conversacion == 1) {
            this.procesaFilas(c);
          } else {
            c.no_hay_filas = "1";
          }
        });
      });
    })
  }

  buscarConfiguracion(id: number): Configuracion {
    return this.configuraciones.find(c => {
      return c.idtbl_configuracion === id;
    });
  }


  verNuevosMensajes(com: PerfectScrollbarComponent, c: Conversacion) {
    c.ocultar_nuevos_mensajes = true;
    com.directiveRef.scrollToBottom();
  }

  setFocus(c: Conversacion, estado: boolean) {
    c.focuseado = estado;
    if (estado) {
      c.mensajes_nuevos = false;
      window.clearInterval(this.intervalo);
      document.title = this.nombre_pestana;
    }
  }
  agregarListenerMensajes(c: Conversacion) {
    this.fireStore.doc('conversaciones/' + c.codigo).valueChanges().subscribe((con: Conversacion) => {
      c.id_estado_conversacion = con.id_estado_conversacion;
      c.notas_voz = con.notas_voz;
    });

    let query = this.fireStore.collection('conversaciones/' + c.codigo + '/mensajes', ref =>
      ref.orderBy('fecha_mensaje')
    );
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
    c.messages = query.valueChanges();
    c.mensajes = [];
    let primera_vez = true;

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
            if (this.intervalo) {
              window.clearInterval(this.intervalo);
            }
            this.intervalo = setInterval(() => {
              if (document.title == this.nombre_pestana) {
                document.title = 'Mensaje nuevo en el chat';
              } else {
                document.title = this.nombre_pestana;
              }
            }, 1400);
          }
        } else {
          c.mensajes[i].estado = m.estado;
        }
      });
      this.ngZone.runOutsideAngular(() => {
        this.passByMensajes(c.mensajes, 0);
      });
      primera_vez = false;
    });
  }

  passByMensajes(mensajes: Array<Mensaje>, index: number, mensaje_anterior?: Mensaje) {
    let m = mensajes[index];
    if (m) {

      m.muestra_hora = true;
      if (m.id_usuario != this.user.getId()) {
        let experto = this.expertos.find((e: User) => {
          return e.idtbl_usuario == m.id_usuario;
        });
        if (experto) {
          m.user = experto;
          index++;
          if (mensaje_anterior && m.id_usuario == mensaje_anterior.id_usuario) {
            /*&& m.id_usuario == mensaje_anterior.id_usuario) {*/

            let a = moment(mensaje_anterior.fecha_mensaje);
            let b = moment(m.fecha_mensaje);
            let minutes = a.diff(b, 'minutes');
            if (minutes == 0) {
              mensaje_anterior.muestra_hora = false;
              delete mensaje_anterior.user;
            }
          }
          this.passByMensajes(mensajes, index, m);
        } else {
          this.userService.getInfoUsuario(m.id_usuario).then((u: User) => {
            m.user = u;
            this.expertos.push(u);
            index++;
            if (mensaje_anterior) {
              let a = moment(mensaje_anterior.fecha_mensaje);
              let b = moment(m.fecha_mensaje);
              let minutes = a.diff(b, 'minutes');

              if (minutes == 0) {
                mensaje_anterior.muestra_hora = false;
                delete mensaje_anterior.user;
              }
            }
            this.passByMensajes(mensajes, index, m);
          })
        }
      } else {
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
  }

  asignarAudio(m: Mensaje, audio: HTMLAudioElement) {
    //audio.load();

    m.audio = audio;
    audio.addEventListener('durationchange', e => {
      let target = <HTMLAudioElement>e.target;
      m.audioControls.max = Math.floor(target.duration);
      //// console.log('Entro', e);
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

  procesaFilas(c: Conversacion) {
    let expertos = [];
    let finaliza = true;

    c.filas.forEach((ce, index) => {
      let r = this.fireStore.collection('conversaciones/').doc(c.codigo).ref;
      this.fireStore.collection('categorias_experticia/' + ce.id + '/chats/').doc(this.user.getId() + '').set({ conversacion: r });
      if (c.id_estado_conversacion == 1) {
        let e = this.fireStore.collection('categorias_experticia/' + ce.id + '/expertos').valueChanges();

        e.subscribe(expertosFila => {

          expertos = expertos.concat(expertosFila);
          if (index == (c.filas.length - 1) && finaliza) {
            finaliza = false;
            this.asignarAsesor(c, expertos);
          }
        });
      } else {

      }
    });
  }

  asignarAsesor(c: Conversacion, expertos: Array<any>) {

    expertos.forEach(e => {
      let a = this.fireStore.doc(e.experto).ref;
      let b = this.fireStore.doc(e.experto).valueChanges();
      b.subscribe((data: any) => {

        if (c.expertos.length < expertos.length) {
          if (!data) {
            data = { activo: false };
          }
          let e = { idtbl_usuario: parseInt(a.id), chats: null, activo: data.activo };
          c.expertos.push(e);
          this.fireStore.doc(a).collection('chats').valueChanges().subscribe(chats => {
            e.chats = chats;
            if (c.expertos.length == expertos.length && !c.asesor_actual) {
              this.procesaChats(c);
            }
          });
        } else {

        }
      })

    });
  }

  procesaChats(c: Conversacion) {

    let asignado = 0;
    c.expertos = c.expertos.filter(e => {
      return e.activo;
    })
    c.expertos.sort((a, b) => {
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
    let experto: Experto = c.expertos.pop();
    c.filas.forEach((ce, index) => {
      this.fireStore.collection('categorias_experticia/' + ce.id + '/chats/').doc(this.user.getId() + '').delete();
    });
    this.chatService.asignarUsuarioExperto(experto.idtbl_usuario, c.idtbl_conversacion, c.codigo).then(u => {
      c.id_experto_actual = u.idtbl_usuario;
      c.nombre_experto_actual = u.nombre;
      c.asesor_actual = new User(null, null, null);
      c.asesor_actual.url_foto = u.url_foto;
      c.asesor_actual.idtbl_usuario = c.id_experto_actual;
      c.asesor_actual.nombre = c.nombre_experto_actual;
    });
  }
  ngOnInit() {

  }
  openChat(data?: any) {
    let c = new Conversacion();
    this.ajax.post('chat/conversacion/crear', { id_usuario: this.user.getId(), id_tipo: 1, ...data }).subscribe(d => {
      if (d.success) {
        c.idtbl_conversacion = d.id_conversacion;
        c.codigo = d.codigo_conversacion;
        c.filas = d.filas;
        c.id_estado_conversacion = 1;
        this.agregarListenerMensajes(c);
        c.expertos = [];
        this.procesaFilas(c);

        /* setTimeout(() => { // ESTO SE DEBE BORRAR SOLO ES PARA PRUEBAS
           c.asesor_actual = new User('david.tobar20@gmail.com', null, 'David Tobar');
           c.asesor_actual.setId(7);
           c.id_experto_actual = c.asesor_actual.getId();
           this.changeRef.detectChanges();
         }, 10000);*/
      }
    });
    this.chats.push(c);
  }
  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  onSelect(message: Object[]): void {
    this.selectedMessage = message;
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


      this.ngZone.runOutsideAngular(() => {
        chat.mensajes.push(m);
        this.passByMensajes(chat.mensajes, 0);
      });
      this.chatService.usuarioDejaEscribir(chat, this.user.getId());
      chat.texto_mensaje = '';
      if (comp) {
        setTimeout(() => {
          comp.directiveRef.scrollToBottom();
          chat.ocultar_nuevos_mensajes = true;
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
    // // console.log(evento);
    let target = <any>evento.target;
    c.cargando_archivo = true;
    if (target.files && target.files.length > 0) {
      this.chatService.adjuntarArchivosServidor(target.files[0]).then(archivo => {
        // // console.log(archivo);
        c.archivo_adjunto = archivo;
        input.value = "";
        c.cargando_archivo = false;
      });
    }
  }

  adjuntarNotaVoz(c: Conversacion, file: File, duration: number) {
    // // console.log(evento);
    c.cargando_archivo = true;
    c.grabando_nota = false;
    this.chatService.adjuntarArchivosServidor(file).then(archivo => {
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
    const options = { mimeType: 'video/webm;codecs=vp9' };
    let detenido = false;
    let calculaTiempo = { fechaIni: null, fechaFin: null };
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        c.mediaRecorder = new MediaRecorder(stream, options);


        const audioChunks = [];
        c.mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        c.mediaRecorder.addEventListener("start", event => {
          calculaTiempo.fechaIni = moment();
          c.grabando_nota = true;
        });

        c.mediaRecorder.addEventListener("stop", () => {

          calculaTiempo.fechaFin = moment();
          const audioBlob = new Blob(audioChunks);
          var voice_file = new File([audioBlob], 'nota_voz_' + moment().unix() + '.wav', { type: "audio/wav" });
          delete c.mediaRecorder;
          var duration = Math.floor(calculaTiempo.fechaFin.unix() - calculaTiempo.fechaIni.unix());
          // console.log(duration);
          this.adjuntarNotaVoz(c, voice_file, duration);
          if (!detenido) {
            detenido = true;
            stream.getTracks().forEach(track => track.stop());
          }
          /*const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();*/
        });
        this.startTimer(tiempo, c).then(() => {
          c.mediaRecorder.stop();
        });

      });
  }

  startTimer(duration: number, c: Conversacion): Promise<any> {

    var timer: number = duration;
    let minutes;
    let seconds;


    return new Promise((resolve, reject) => {

      c.mediaRecorder.start();
      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      c.cuenta_regresiva = minutes + ":" + seconds;
      timer -= 1;
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
    window.clearInterval(c.interval_grabando);
    c.mediaRecorder.stop();
  }

  quitarNotaVoz(c: Conversacion) {
    delete c.grabando_nota;
    window.clearInterval(c.interval_grabando);
  }
  remplazaEmoji(c: Conversacion) {
    c.texto_mensaje = this.chatService.findEmojiData(c.texto_mensaje);
  }

  escribiendo(c: Conversacion, event: KeyboardEvent) {

    let code = event.which || event.keyCode;
    if (code != 13 && code != 8) {
      this.chatService.usuarioEscribiendoConversacion(c);
    }
  }
  seleccionarEmoji(evento, c: Conversacion) {
    console.log(evento);
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
}
