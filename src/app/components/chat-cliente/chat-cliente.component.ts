import { Component, OnInit, ChangeDetectorRef, ViewChild, ViewChildren, QueryList, NgZone, ElementRef } from '@angular/core';
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
import { Configuracion, InformacionCorreo } from '../../../schemas/interfaces';
import { SonidosService } from '../../providers/sonidos.service';
import swal from 'sweetalert2';
import { UtilsService } from '../../providers/utils.service';
import { FormControl } from '@angular/forms';
import * as uuid from 'uuid';
const moment = _rollupMoment || _moment;


declare var StereoAudioRecorder: any;
declare var Set: any;
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
  extensiones_archivos = [];
  stream: any;
  cantidad_mensajes_sin_leer = 0;
  limite_texto_chat;
  mensaje_buscando_experto;
  mensaje_no_encontro_experto;
  es_despedida = false;
  mensaje_despedida;
  file_url;
  loading = false;
  observable_chats;
  @ViewChild('escribirMensaje') escribir_mensaje: ElementRef;

  constructor(private userService: UserService, private ajax: AjaxService, private fireStore: AngularFirestore, private changeRef: ChangeDetectorRef, private chatService: ChatService, private ngZone: NgZone, private soundService: SonidosService, private utilService: UtilsService) {
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

    this.observable_chats = this.chatService.nuevasConversaciones.subscribe(d => {
      console.log('Abriendo chat');
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

  ngOnDestroy() {
    this.observable_chats.unsubscribe();
  }


  init() {

    this.chatService.obtenerLimiteTexto().then(valor => {
      this.limite_texto_chat = valor;
    });

    this.chatService.getConfiguracionesChat().then(configs => {

      this.configuraciones = configs.configuraciones;
      configs.extensiones.forEach(e => {
        this.extensiones_archivos.push(e.extension);
      });
      this.chatService.getConversacionesCLiente().then(chats => {
        this.chats = chats;
        this.chats.forEach(c => {
          this.agregaListenerConversacion(c);
          this.agregarListenerMensajes(c);
          c.expertos = [];
          if (c.id_experto_actual) {
            c.asesor_actual = new User(null, null, null);
            c.asesor_actual.idtbl_usuario = c.id_experto_actual;
            c.asesor_actual.nombre = c.nombre_experto_actual;
            c.asesor_actual.url_foto = c.url_foto;
          }
          if (c.filas && c.id_estado_conversacion == 1) {

            this.chatService.getDocumentoFirebase('paises/' + this.user.pais + '/conversaciones/' + c.codigo).then(conversa => {
              c.transferido = conversa.transferido;
              //this.procesaFilas(c);
              this.chatService.getExpertoDisponible(c.filas).then(experto => {
                if (experto) {
                  this.chatService.asignarUsuarioExperto(experto.id_usuario, c.idtbl_conversacion, c.codigo, false).then(u => {
                    c.id_experto_actual = u.idtbl_usuario;
                    c.nombre_experto_actual = u.nombre;
                    c.asesor_actual = new User(null, null, null);
                    c.asesor_actual.url_foto = u.url_foto;
                    c.asesor_actual.idtbl_usuario = c.id_experto_actual;
                    c.asesor_actual.nombre = c.nombre_experto_actual;
                  });
                } else {
                  c.filas.forEach((ce, index) => {
                    this.fireStore.collection('paises/' + this.user.pais + '/' + 'categorias_experticia/' + ce.id + '/chats/').doc(c.codigo).set({ activo: true });
                  });
                }
              })
            })
          } else {
            c.no_hay_filas = "1";
          }
        });
      });
    });

  }

  buscarConfiguracion(id: number): Configuracion {
    return this.configuraciones.find(c => {
      return c.idtbl_configuracion === id;
    });
  }


  verNuevosMensajes(com: PerfectScrollbarComponent, c: Conversacion) {
    c.ocultar_nuevos_mensajes = true;
    com.directiveRef.scrollToBottom();
    this.setFocus(c, true);
  }

  setFocus(c: Conversacion, estado: boolean) {
    c.focuseado = estado;
    if (estado) {
      c.mensajes_nuevos = false;
      c.cantidad_mensajes_nuevos = 0;
      window.clearInterval(this.intervalo);
      document.title = this.nombre_pestana;
      c.mostrar_emojis = false;
    }
  }

  agregarListenerMensajes(c: Conversacion) {
    c.cantidad_mensajes_nuevos = 0;
    this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).valueChanges().subscribe((con: Conversacion) => {
      c.id_estado_conversacion = con.id_estado_conversacion;
      c.notas_voz = con.notas_voz;
    });

    let query = this.fireStore.collection('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo + '/mensajes', ref =>
      ref.orderBy('fecha_mensaje')
    );
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
    c.messages = query.valueChanges();
    c.mensajes = [];
    let primera_vez = true;
    c.primera_vez = true;
    c.messages.subscribe(async d => {
      //// console.log(d.length, c.mensajes.length);
      if (!c.primera_vez && c.mensajes && d.length > c.mensajes.length) {
        c.cantidad_mensajes_nuevos += d.length - c.mensajes.length;
      }

      let mensajes_nuevos = await this.procesarMensajes(d, c, c.primera_vez, 0, []);
      c.mensajes = c.mensajes.concat(mensajes_nuevos);

      c.primera_vez = false;
      if (this.intervalo) {
        window.clearInterval(this.intervalo);
      }

      this.intervalo = setInterval(() => {
        if (document.title == this.nombre_pestana && !c.primera_vez) {

          this.cantidad_mensajes_sin_leer = 0;
          this.chats.forEach(chat => {
            // // console.log(this.chats);
            this.cantidad_mensajes_sin_leer += chat.cantidad_mensajes_nuevos;
          });

          if (this.cantidad_mensajes_sin_leer > 0) {
            document.title = 'Mensajes(' + this.cantidad_mensajes_sin_leer + ') nuevos en el chat';
          }
        } else {
          document.title = this.nombre_pestana;
        }
      }, 1400);
    });
  }

  async procesarMensajes(d: Array<Mensaje>, c: Conversacion, primera_vez: boolean, i: number, tmp) {
    for (let index = 0; index < d.length; index++) {
      const m = d[index];
      //// console.log(m);
      let experto = this.expertos.find((e: User) => {
        return e.idtbl_usuario == m.id_usuario;
      });
      if (!experto) {
        let u = await this.userService.getInfoUsuario(m.id_usuario);
        this.expertos.push(u);
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

    }

    if (!primera_vez && !c.focuseado && c.id_estado_conversacion == 2 && c.minimizado) {
      this.soundService.sonar(1);
      //c.cantidad_mensajes_nuevos++;
      c.mensajes_nuevos = true;
    }

    //// console.log(tmp);
    return tmp;
    /*
        let m = d.shift();
        if (m) {
          let experto = this.expertos.find((e: User) => {
            return e.idtbl_usuario == m.id_usuario;
          });
          if (!experto) {
            let u = await this.userService.getInfoUsuario(m.id_usuario);
            this.expertos.push(u);
          }
          if (m.es_nota_voz) {
            m.audioControls = { reproduciendo: false, segundo: m.duracion, min: 0, max: m.duracion };
            this.asignarAudio(m);
          }
    
          //  c.mensajes[i] = m;
          let bus = c.mensajes.find(mm => {
    
            return mm.codigo == m.codigo;
          });
          // console.log(bus);
          if (!bus) {
            tmp.push(m);
          }
          if (!primera_vez && !c.focuseado && c.id_estado_conversacion == 2) {
            this.soundService.sonar(1);
            //c.cantidad_mensajes_nuevos++;
            c.mensajes_nuevos = true;
    
          }
    
          i++;
          return await this.procesarMensajes(d, c, primera_vez, i, tmp);
        } else {
          return tmp;
        }*/
  }

  changeChatSize(c: Conversacion) {
    c.minimizado = !c.minimizado;
    if (!c.minimizado) {
      c.mensajes_nuevos = false;
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

  procesaFilas(c: Conversacion) {
    let expertos = [];
    let finaliza = true;

    c.filas.forEach((ce, index) => {
      if (c.id_estado_conversacion == 1) {
        if (ce.expertos && ce.expertos.length > 0) {
          expertos = expertos.concat(ce.expertos);
        }
      }
    });
    this.asignarAsesor(c, expertos);
  }

  asignarAsesor(c: Conversacion, expertos: Array<any>) {
    // console.log(expertos);
    expertos.forEach(async (e, index) => {
      let data = await this.chatService.getDocumentoFirebase('paises/' + this.user.pais + '/expertos/' + e.id_usuario);
      if (!data) {
        data = { activo: false };
      }
      let ex = { idtbl_usuario: e.id_usuario, chats: [], activo: data.activo, ultima_conexion: data.fecha };
      ex.chats = await this.chatService.getCollectionFirebase('paises/' + this.user.pais + '/expertos/' + e.id_usuario + '/chats');
      c.expertos.push(ex);
      if (index == expertos.length - 1) {
        this.procesaChats(c);
      }
    });

  }


  procesaChats(c: Conversacion) {
    c.expertos = this.utilService.getUnique(c.expertos, 'idtbl_usuario');
    let asignado = 0;
    c.expertos = c.expertos.filter(e => {
      if (!e.ultima_conexion) {
        return false;
      }
      var duration = moment().unix() - e.ultima_conexion._seconds;
      return e.activo && duration < 11;
    });
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

    // // console.log(experto, parseInt(this.buscarConfiguracion(2).valor), experto.chats.length);
    if (experto && experto.chats && parseInt(this.buscarConfiguracion(2).valor) > experto.chats.length) {
      c.filas.forEach((ce, index) => {
        this.fireStore.collection('paises/' + this.user.pais + '/' + 'categorias_experticia/' + ce.id + '/chats/').doc(c.codigo).delete();
      });
      this.chatService.asignarUsuarioExperto(experto.idtbl_usuario, c.idtbl_conversacion, c.codigo, false).then(u => {
        c.id_experto_actual = u.idtbl_usuario;
        c.nombre_experto_actual = u.nombre;
        c.asesor_actual = new User(null, null, null);
        c.asesor_actual.url_foto = u.url_foto;
        c.asesor_actual.idtbl_usuario = c.id_experto_actual;
        c.asesor_actual.nombre = c.nombre_experto_actual;
      });
    } else if (!c.transferido) {
      c.filas.forEach((ce, index) => {
        this.fireStore.collection('paises/' + this.user.pais + '/' + 'categorias_experticia/' + ce.id + '/chats/').doc(c.codigo).set({ activo: true });
      });

      /* let listener = this.fireStore.doc('paises/'+this.user.pais+'/'+'conversaciones/' + c.codigo).snapshotChanges().subscribe(datos => {
         let data = datos.payload.data() as Conversacion;
         if (data.id_estado_conversacion == 2) {
           listener.unsubscribe();
           this.userService.getInfoUsuario(data.id_experto_actual).then((u: User) => {
             c.id_experto_actual = u.idtbl_usuario;
             c.nombre_experto_actual = u.nombre;
             c.asesor_actual = new User(null, null, null);
             c.asesor_actual.url_foto = u.url_foto;
             c.asesor_actual.idtbl_usuario = c.id_experto_actual;
             c.asesor_actual.nombre = c.nombre_experto_actual;
           });
         }
       });*/
    }
  }

  agregaListenerConversacion(c: Conversacion) {
    this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).snapshotChanges().subscribe(datos => {
      let data = datos.payload.data() as Conversacion;
      c.llamada_activa = data.llamada_activa;
      c.url_llamada = data.url_llamada;
      if (data.id_estado_conversacion != 1 && data.id_estado_conversacion != 2 && data.id_estado_conversacion != 10) {
        c.mostrar_encuesta = true;
        c.cerrado_inactividad = true;
      } else if (c.asesor_actual) {
        if (c.asesor_actual.idtbl_usuario != data.id_experto_actual && data.id_experto_actual) {
          this.userService.getInfoUsuario(data.id_experto_actual).then((u: User) => {
            c.id_experto_actual = u.idtbl_usuario;
            c.nombre_experto_actual = u.nombre;
            c.asesor_actual = new User(null, null, null);
            c.asesor_actual.url_foto = u.url_foto;
            c.asesor_actual.idtbl_usuario = c.id_experto_actual;
            c.asesor_actual.nombre = c.nombre_experto_actual;
          });
        } else if (!data.id_experto_actual) {
          delete c.asesor_actual;
          delete c.nombre_experto_actual;
          delete c.id_experto_actual;
          delete c.no_hay_filas;
        }
      } else {
        if ((data.id_estado_conversacion == 2 && !c.asesor_actual) || (data.id_estado_conversacion == 2 && c.asesor_actual && c.asesor_actual.idtbl_usuario != data.id_experto_actual)) {
          //listener.unsubscribe();
          this.userService.getInfoUsuario(data.id_experto_actual).then((u: User) => {
            c.id_experto_actual = u.idtbl_usuario;
            c.nombre_experto_actual = u.nombre;
            c.asesor_actual = new User(null, null, null);
            c.asesor_actual.url_foto = u.url_foto;
            c.asesor_actual.idtbl_usuario = c.id_experto_actual;
            c.asesor_actual.nombre = c.nombre_experto_actual;
          });
        } else if (data.id_estado_conversacion == 1) {
          delete c.asesor_actual;
          delete c.nombre_experto_actual;
          delete c.id_experto_actual;
        }
      }

      if (data.id_estado_conversacion == 10) {
        c.no_encontro_experto = true;
        this.chatService.getMensajeBuscandoExperto(5).then(result => {
          this.mensaje_no_encontro_experto = result;
        });
      }

      if (data.id_estado_conversacion == 3) {
        c.cerrado_inactividad = true;
        this.mensajeDespedida(c);
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

    });
  }

  ngOnInit() {
    this.mensajeBuscandoExperto();
  }
  openChat(data?: any) {

    let last_open = window.sessionStorage.getItem('loc');
    // console.log('las opent', last_open);
    if (last_open) {
      let diff = moment().diff(moment().unix(last_open), 'seconds');
      // console.log('diferencia', diff)
      if (diff > 2) {
        window.sessionStorage.setItem('loc', moment().unix());
        this.abrirChat(data);
      } else {
        // swal.fire('Cuidado','No puedes abrir un chat en este momento, por favor espera 10 segundos','warning');
      }
    } else {
      window.sessionStorage.setItem('loc', moment().unix());
      this.abrirChat(data);
    }

  }

  abrirChat(data: any) {
    let abriendo = true;
    this.chatService.getConversacionActivaUsuario().then(result => {
      if (result.conversacion.length < result.cantidad_chat_cliente && abriendo) {
        abriendo = false;
        this.crearNuevaConversacion(data);
      } else {
        swal.fire({
          title: 'Lo sentimos',
          text: 'Ha llegado al límite de conversaciones permitidas, si desea abrir una nueva conversación por favor cierre una de las que están abiertas.',
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: 'custom__btn custom__btn--accept',
          confirmButtonText: 'Aceptar',
          customClass: {
            container: 'custom-sweet'
          }
        });
      }
    });
  }

  crearNuevaConversacion(data) {
    let c = new Conversacion();
    this.ajax.post('chat/conversacion/crear', { id_usuario: this.user.getId(), id_tipo: 1, ...data }).subscribe(d => {
      // console.log(d);
      if (d.success) {
        c.idtbl_conversacion = d.id_conversacion;
        c.codigo = d.codigo_conversacion;
        c.filas = d.filas;
        c.id_estado_conversacion = 1;
        this.agregaListenerConversacion(c);
        this.agregarListenerMensajes(c);
        c.expertos = [];
        //his.procesaFilas(c);
        if (d.experto) {
          this.chatService.asignarUsuarioExperto(d.experto.id_usuario, c.idtbl_conversacion, c.codigo, false).then(u => {
            c.id_experto_actual = u.idtbl_usuario;
            c.nombre_experto_actual = u.nombre;
            c.asesor_actual = new User(null, null, null);
            c.asesor_actual.url_foto = u.url_foto;
            c.asesor_actual.idtbl_usuario = c.id_experto_actual;
            c.asesor_actual.nombre = c.nombre_experto_actual;
          });
        } else {
          c.filas.forEach((ce, index) => {
            this.fireStore.collection('paises/' + this.user.pais + '/' + 'categorias_experticia/' + ce.id + '/chats/').doc(c.codigo).set({ activo: true });
          });
        }
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
      m.uuid = uuid.v4();
      m.tipo_conversacion = 1;
      m.es_cliente = true;
      m.id_usuario = this.user.getId();
      if (tipo_mensaje == 1) {
        m.texto = chat.texto_mensaje;
        //chat.texto_mensaje = '';
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
      }

      chat.mensajes.push(m);
      /*this.ngZone.runOutsideAngular(() => {
        chat.mensajes.push(m);
        this.passByMensajes(chat.mensajes, 0);
      });*/
      this.chatService.usuarioDejaEscribir(chat, this.user.getId());

      if (comp) {
        setTimeout(() => {
          comp.directiveRef.scrollToBottom();
          chat.ocultar_nuevos_mensajes = true;
        }, 1);
      }

      this.chatService.enviarMensaje(m);
      if (tipo_mensaje == 1 || tipo_mensaje == 2) {
        delete chat.texto_mensaje;
      }
      if (tipo_mensaje == 2 || tipo_mensaje == 3) {
        delete chat.archivo_adjunto;
        delete chat.grabando_nota;
      }
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
    let minutos = parseInt(this.utilService.buscarConfiguracion('cantidad_tiempo_maximo_nota_voz').valor);
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
        });

      }).catch(() => {
        c.iniciando_grabacion = false;
        swal.fire('Alerta', 'No se pudo acivar el micrófono, por favor habilítalo en la parte superior junto a la URL', 'error');
      });


  }

  onStopRecordingNotaVoz(audioBlob: Blob, c: Conversacion, comp: PerfectScrollbarComponent) {
    var duration = moment().diff(moment(c.inicia_grabacion), 'seconds');
    this.stream.getTracks().forEach(track => track.stop());
    var voice_file = new File([audioBlob], 'nota_voz_' + moment().unix() + '.wav', { type: 'audio/wav' });
    delete c.mediaRecorder;
    this.adjuntarNotaVoz(c, voice_file, duration, comp);


  }

  startTimer(duration: number, c: Conversacion, comp: PerfectScrollbarComponent): Promise<any> {

    var timer: number = duration;
    let minutes;
    let seconds;
    // // console.log(timer)

    return new Promise((resolve, reject) => {


      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      c.cuenta_regresiva = minutes + ":" + seconds;
      c.inicia_grabacion = new Date();
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
    // // console.log(evento);
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

  cerrarChat(c: Conversacion) {
    if (c.id_estado_conversacion != 10) {
      let estado;
      if (c.id_estado_conversacion == 1) {
        if (c.transferido) {
          estado = 3;
        } else {
          estado = 9;
        }
      } else {
        estado = 3;
      }
      this.chatService.cerrarConversacion(c, estado).then(() => {
        c.mostrar_encuesta = true;
        c.cerrado_inactividad = true;
      });

    } else {
      c.mostrar_encuesta = true;
      c.cerrado_inactividad = false;
    }
  }

  finalizaEncuesta(c: Conversacion) {
    let index = this.chats.findIndex(chat => {
      return chat.codigo === c.codigo;
    })
    if (index !== (-1)) {
      this.chats.splice(index, 1);
    }
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

  /**
   * obtiene el mensaje automatico de buscar experto
   */
  mensajeBuscandoExperto() {
    this.chatService.obtenerTextoBuscandoExperto().then(result => {
      this.mensaje_buscando_experto = result;
    });
  }

  /**
   * obtiene el mensaje automatico de despedida
   */
  mensajeDespedida(chat) {
    this.chatService.getMensajeBuscandoExperto(2).then(result => {
      chat.mensaje_inactividad = result;
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
