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
const moment = _rollupMoment || _moment;

declare var MediaRecorder: any;

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
  selectedMessage: any;
  messages: Object[] = [{
    from: 'Nirav Joshi',
    photo: 'assets/images/users/1.jpg',
    subject: 'Hey, how are you?',
  }, {
    from: 'Sunil Joshi',
    photo: 'assets/images/users/2.jpg',
    subject: 'Lorem ipsum done dkaghdka',
  }, {
    from: 'Vishal bhatt',
    photo: 'assets/images/users/3.jpg',
    subject: 'Thanks mate',
  }, {
    from: 'Genelia Desouza',
    photo: 'assets/images/users/4.jpg',
    subject: 'This is my shot',
  }, {
    from: 'Linda muke',
    photo: 'assets/images/users/5.jpg',
    subject: 'You have to do it with your self',
  }, {
    from: 'Vaibhav Zala',
    photo: 'assets/images/users/6.jpg',
    subject: 'No mate this is not',
  }, {
    from: 'Kalu valand',
    photo: 'assets/images/users/1.jpg',
    subject: 'Arti thai gai ne?',
  }];

  user: User;
  ocultar_nuevos_mensajes = false;
  chats_experto = [];
  chat: Conversacion;
  obligaCambio = true;
  @ViewChild('contenedor') componentRef?: PerfectScrollbarComponent;
  configuraciones = [];

  constructor(private userService: UserService, private chatService: ChatService, private fireStore: AngularFirestore, private changeRef: ChangeDetectorRef, private ngZone: NgZone, private soundService: SonidosService) {
    this.selectedMessage = this.messages[1];
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
      this.configuraciones = configs;
      this.userService.getFilasExperto().then(() => {
        this.fireStore.collection('expertos').doc('' + this.user.getId()).valueChanges().subscribe((d: any) => {
          d.activo = true;
          this.fireStore.collection('expertos').doc('' + this.user.getId()).set(d);
        });
        this.user.filas.forEach(f => {
          let cola = this.fireStore.collection('categorias_experticia/' + f.id_categoria_experticia + '/chats').valueChanges();
          cola.subscribe(chats => {
            // // console.log(chats);
            chats.forEach((c: any) => {
              let refConversacion = c.conversacion;
            })
          })
        });
        let chats = this.fireStore.collection('expertos/' + this.user.getId() + '/chats').valueChanges();
        chats.subscribe((chats: Array<Conversacion>) => {
          this.soundService.sonar(2);
          //this.chats_experto = [];
          let temporal = [];
          chats.forEach((c: any, index) => {
            let refConversacion = c.conversacion;
            this.fireStore.doc(refConversacion).valueChanges().subscribe((d: Conversacion) => {
              let c = d;
              c.codigo = refConversacion.id;
              this.agregarListenerMensajes(c);
              this.userService.getInfoUsuario(c.id_usuario_creador).then((d: User) => {
                //// console.log(d);
                c.cliente = d;
                temporal.push(c);
                if (!this.chat) {
                  this.obligaCambio = false;
                  this.onSelect(c);
                }
                if (index == (chats.length - 1)) {
                  if (temporal.length > this.chats_experto.length) {
                    // AQUI SE REPRODUCE EL SONIDO
                  }
                  this.chats_experto = temporal;
                }
              });
            });
          });

        });
      });
    });
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
          }
        } else {
          c.mensajes[i].estado = m.estado;
        }
      });
      this.ngZone.runOutsideAngular(() => {
        this.passByMensajes(c.mensajes, 0);
      });



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
    // console.log(e);
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

  }

  enviarMensaje(chat: Conversacion, tipo_mensaje: number, url?: string, event?: Event, comp?: PerfectScrollbarComponent, duration?: number) {
    if (event) {
      event.preventDefault();
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
        });

        c.mediaRecorder.addEventListener("stop", () => {

          calculaTiempo.fechaFin = moment();
          const audioBlob = new Blob(audioChunks);
          var voice_file = new File([audioBlob], 'nota_voz_' + moment().unix() + '.wav', { type: "audio/wav" });
          delete c.mediaRecorder;
          var duration = Math.ceil(calculaTiempo.fechaFin.unix() - calculaTiempo.fechaIni.unix());
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
      c.grabando_nota = true;
      c.mediaRecorder.start();
      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      c.cuenta_regresiva = minutes + ":" + seconds;
      timer -= 1;
      c.interval_grabando = setInterval(function () {
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

}
