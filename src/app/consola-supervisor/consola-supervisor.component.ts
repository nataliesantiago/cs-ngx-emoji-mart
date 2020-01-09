import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { UserService } from '../providers/user.service';
import { ChatService } from '../providers/chat.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { SonidosService } from '../providers/sonidos.service';
import { UtilsService } from '../providers/utils.service';
import { MatDialog } from '@angular/material';
import { User } from '../../schemas/user.schema';
import { Conversacion } from '../../schemas/conversacion.schema';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Mensaje } from '../../schemas/mensaje.schema';
import { TransferenciaChatComponent } from '../components/transferencia-chat/transferencia-chat.component';
import { CategoriaExperticia, Configuracion } from '../../schemas/interfaces';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { Experto } from '../../schemas/xhr.schema';
const moment = _rollupMoment || _moment;
@Component({
  selector: 'app-consola-supervisor',
  templateUrl: './consola-supervisor.component.html',
  styleUrls: ['./consola-supervisor.component.scss']
})
export class ConsolaSupervisorComponent implements OnInit {
  user: User;
  chats_activos: Array<Conversacion> = [];
  chats_activos_backup: Array<Conversacion> = [];
  chats_en_fila: Array<Conversacion> = [];
  chats_activos_filtrados: Array<Conversacion> = [];
  chats_en_fila_filtrados: Array<Conversacion> = [];
  usuarios: Array<User> = [];
  filtro_activos: string;
  filtro_cola: string;
  expertos: Array<Experto>;
  expertos_filtro: Experto[];
  mensajes_nuevos = 0;
  categorias_experticia: Array<CategoriaExperticia> = [];
  loading = false;
  cargar_pendientes = false;
  es_col = false;

  constructor(private userService: UserService, private chatService: ChatService, private fireStore: AngularFirestore, private changeRef: ChangeDetectorRef, private ngZone: NgZone, private soundService: SonidosService, private utilService: UtilsService, private dialog: MatDialog) {
    this.user = this.userService.getUsuario();
    if (this.user) {
      this.init();
    }
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
        this.init();
      }
    });

  }

  init() {

    if (this.user.pais == 'col') {
      this.es_col = true;
    }

    this.fireStore.collection('paises/' + this.user.pais + '/' + 'conversaciones', ref => ref.where('id_tipo_conversacion', '==', 1).where('id_estado_conversacion', '==', 2).orderBy('fecha_creacion')).snapshotChanges().subscribe(async changes => {

      let chats = await this.procesaConversaciones(changes) as Array<Conversacion>;
      console.log(chats);
      if (!this.chats_activos || this.chats_activos.length < 1) {
        this.chats_activos = chats;
        for (let c of this.chats_activos) {
          this.agregarListenerMensaes(c);
          await this.agregarTiempoConversacion(c);
        }
      } else {
        chats.forEach(cn => {
          let t = this.chats_activos.find(c => {
            return c.codigo == cn.codigo;
          });
          if (t) {
            for (let attr in cn) {
              if (attr != 'mensajes' && attr != 'messages') {
                // console.log('atributo:', attr);
                t[attr] = cn[attr];
              }
            }
          } else {
            this.agregarListenerMensaes(cn);
            this.chats_activos.push(cn);

          }

        });
        this.chats_activos.forEach((item, index, object) => {
          let t = chats.find(c => {
            return c.codigo == item.codigo;
          });
          if (!t) {
            object.splice(index, 1);
            if (item.transfiriendo) {
              this.dialog.closeAll();
            }
          }
        });
        //this.chats_activos = chats;
      }
      this.applyFilterActivos();
    });
    this.fireStore.collection('paises/' + this.user.pais + '/' + 'conversaciones', ref => ref.where('id_tipo_conversacion', '==', 1).where('id_estado_conversacion', '==', 1).orderBy('fecha_creacion')).snapshotChanges().subscribe(async changes => {
      let chats = await this.procesaConversaciones(changes) as Array<Conversacion>;
      for (let c of chats) {
        setInterval(() => {

          if (c.fecha_creacion) {
          
            if (c.fecha_creacion) {
              c.tiempo_en_conversacion = moment().diff(moment(c.fecha_creacion), 'seconds');
            }
  
          }
        }, 1000);
        
        if (c.idtbl_conversacion) {
          await this.chatService.getFilasConversacion(c);
        }
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

      }
      this.chats_en_fila.forEach((item, index, object) => {
        let t = chats.find(c => {
          return c.codigo == item.codigo;
        });
        if (!t) {
          //object.splice(index, 1);
          if (item.transfiriendo) {
            this.dialog.closeAll();
          }
        }
      });
      this.chats_en_fila = chats;

      this.applyFilterCola();
    });

    this.getCategoriasExperticia();
    
  }


  async agregarTiempoConversacion(c: Conversacion){
    console.log(c);
    setInterval(() => {
            
      if (c.fecha_asignacion) {
        
        if (c.fecha_asignacion) {
        
          c.tiempo_en_conversacion = moment().diff(moment(c.fecha_asignacion), 'seconds');
        }

      }
    }, 1000);

  }

  ngOnInit() {
  }

  transferirChat(c: Conversacion, asignar?: number) {
    c.transfiriendo = true;
    this.dialog.open(TransferenciaChatComponent, { width: '400px', data: { conversacion: c, asignar: asignar } }).afterClosed().subscribe((result) => {
      if (result && result.success) {

      } else {
        c.transfiriendo = false;
      }
    });

  }

  async procesaConversaciones(changes) {
    let tmp = [];

    for (let c of changes) {
      let data = c.payload.doc.data() as Conversacion;
      data.codigo = c.payload.doc.id;
      let usuario = this.usuarios.find((e: User) => {
        // console.log(e);
        if (e != undefined) {
          return e.idtbl_usuario == data.id_usuario_creador;
        }
      });
      let experto = this.usuarios.find((e: User) => {
        if (e != undefined) {
          return e.idtbl_usuario == data.id_usuario_creador;
        }
      });
      if (!experto && data.id_experto_actual) {
        let u = experto = await this.userService.getInfoUsuario(data.id_experto_actual);
        this.usuarios.push(u);
      }
      if (!usuario && data.id_usuario_creador) {
        let u = usuario = await this.userService.getInfoUsuario(data.id_usuario_creador);
        this.usuarios.push(u);
      }
      if (!usuario) {

      }
      data.cliente = usuario;
      data.asesor_actual = experto;
      tmp.push(data);

    }
    return tmp;
  }

  agregarListenerMensaes(c: Conversacion) {
    c.messages = this.fireStore.collection('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo + '/mensajes', ref =>
      ref.orderBy('fecha_mensaje')
    ).valueChanges();
    this.fireStore.collection('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo + '/mensajes', ref => ref.orderBy('fecha_mensaje')).snapshotChanges().subscribe(async changes => {
      let tmp = [];
      changes.forEach(mensaje => {
        let data = mensaje.payload.doc.data() as Mensaje;
        data.id = mensaje.payload.doc.id;
        tmp.push(data);
      });
      c.mensajes = await this.procesarMensajes(tmp, c, true, 0, []);
    })
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
      if (!primera_vez && !c.focuseado && c.viendo_supervisor) {
        this.soundService.sonar(1);
        c.mensajes_nuevos = true;
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
      return await this.procesarMensajes(d, c, primera_vez, i, tmp);
    } else {
      return tmp;
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

  verNuevosMensajes(comp: PerfectScrollbarComponent, c: Conversacion) {
    c.ocultar_nuevos_mensajes = true;
    comp.directiveRef.scrollToBottom();
  }
  toggleConversacion(c: Conversacion) {
    let estado = !c.viendo_supervisor;
    c.viendo_supervisor = !c.viendo_supervisor;
    this.fireStore.doc('paises/' + this.user.pais + '/' + 'conversaciones/' + c.codigo).update({ viendo_supervisor: estado });
  }
  applyFilterActivos() {
    let palabra = this.filtro_activos;
    if (palabra && palabra != '') {
      this.chats_activos_filtrados = this.chats_activos.filter((c: Conversacion) => {
        return this.utilService.normalizeText(c.cliente.nombre.toLowerCase()).indexOf(this.utilService.normalizeText(palabra)) != -1
          || this.utilService.normalizeText(c.cliente.correo.toLowerCase()).indexOf(this.utilService.normalizeText(palabra)) != -1
          || (c.asesor_actual && this.utilService.normalizeText(c.asesor_actual.nombre.toLowerCase()).indexOf(this.utilService.normalizeText(palabra)) != -1)
          || (c.asesor_actual && this.utilService.normalizeText(c.asesor_actual.correo.toLowerCase()).indexOf(this.utilService.normalizeText(palabra)) != -1);
      });
    } else {
      this.chats_activos_filtrados = this.chats_activos;
    }
  }

  applyFilterCola() {
    let palabra = this.filtro_cola;

    if (palabra && palabra != '') {
      this.chats_en_fila_filtrados = this.chats_en_fila.filter((c: Conversacion) => {
        let este = false;
        
        if (this.utilService.normalizeText(c.cliente.nombre.toLowerCase()).indexOf(this.utilService.normalizeText(palabra)) != -1
          || this.utilService.normalizeText(c.cliente.correo.toLowerCase()).indexOf(this.utilService.normalizeText(palabra)) != -1) {

          return true;
        } else {
          c.filas.forEach((f: CategoriaExperticia) => {
            if (this.utilService.normalizeText(f.nombre.toLowerCase()).indexOf(this.utilService.normalizeText(palabra.toLowerCase())) != -1) {
              este = true;
            }
          });

          return este;
        }
      });
    } else {
      this.chats_en_fila_filtrados = this.chats_en_fila;
    }
  }

  getCategoriasExperticia() {
    this.chatService.getCategoriasExperticia().then((c) => {
      this.categorias_experticia = c;
    });
  }

  filtrarCategorias(event) {
    this.loading = true;
    let categorias = event.value;
    if (categorias.length != 0) {
      this.chatService.obtenerUsuarioPorCategoria(categorias).then((expertos: any) => {
        this.chats_activos_filtrados = this.chats_activos.filter((c: Conversacion) => {
          let chat_filtrado = false;
          expertos.forEach(experto => {
            if (c.asesor_actual.idtbl_usuario === experto.id_usuario) {
              chat_filtrado = true;
            }
          });
          this.loading = false;
          return chat_filtrado;
        });
      });
    } else {
      this.chats_activos_filtrados = this.chats_activos;
      this.loading = false;
    }
  }

  filtrarCategoriasFila(event) {
    this.loading = true;
    let categorias = event.value;
    if (categorias.length != 0) {
      this.chats_en_fila_filtrados = this.chats_en_fila.filter((c: any) => {
        let chat_filtrado = false;
        if (c.categoria != null) {
          categorias.forEach(element => {
            if (this.utilService.normalizeText(c.categoria.toLowerCase()) == this.utilService.normalizeText(element.toLowerCase())) {
              chat_filtrado = true;
            }
          });
          return chat_filtrado;
        } else {
          console.log(c);
          
        }
      });
    } else {
      this.chats_en_fila_filtrados = this.chats_en_fila;
      this.loading = false;
    }
  }

}
