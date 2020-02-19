import { Component, OnInit, Inject, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { HistorialChatService } from '../../providers/historial-chat.service';
import { Conversacion } from '../../../schemas/conversacion.schema';
import { Mensaje } from '../../../schemas/mensaje.schema';
import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ChatService } from '../../providers/chat.service';
import { UserService } from '../../providers/user.service';
import { User } from '../../../schemas/user.schema';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import swal from 'sweetalert2';
import { Configuracion, AudioControls } from '../../../schemas/interfaces';
import { FormControl } from '@angular/forms';
import { CerrarChatExpertoComponent } from '../../components/cerrar-chat-experto/cerrar-chat-experto.component';

const moment = _rollupMoment || _moment;
declare var StereoAudioRecorder: any;

@Component({
  selector: 'app-dialogo-detalle-chat',
  templateUrl: './dialogo-detalle-chat.component.html',
  styleUrls: ['./dialogo-detalle-chat.component.scss']
})
export class DialogoDetalleChatComponent implements OnInit {

  chat: Conversacion;
  messages;
  is_empty_messages;
  user: User;
  urlAdjuntos: string;
  limite_texto_chat;
  configuraciones;
  stream: any;
  chats = [];
  extensiones_archivos = [];
  loading = false;
  file_url;
  @ViewChild('scroll') componentRef?: PerfectScrollbarComponent;
  ocultar_ultimos_mensajes = true;
  recording_url = [];
  is_recording = false;
  is_closed = false;
  is_user;
  
  constructor(public dialogRef: MatDialogRef<DialogoDetalleChatComponent>, @Inject(MAT_DIALOG_DATA) public data: any, 
              private historial_service: HistorialChatService, private chatService: ChatService, private userService: UserService, private changeRef: ChangeDetectorRef, 
              private dialog: MatDialog) {

    this.user = this.userService.getUsuario();
    if (this.user) {
      this.init();
    }
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
        this.init();
      } else {
        delete this.user;
      }
    });

    this.chat = data;
    this.is_user = data.user_chat;
    this.chats.push(this.chat);
    
    this.getMessages();
    this.getRecordingUrl();
  }

  /**
   * identifica si el scroll llega al final del contenido
   */
  onReachEnd() {
    if (this.componentRef && this.componentRef.directiveRef) {
      setTimeout(() => {
        if (this.componentRef.directiveRef.position().y === 'end') {
          this.ocultar_ultimos_mensajes = false;
        }
      }, 1000);
    }
  }
  /**
   * inicializa la informacion necesaria
   */
  init() {
    this.chatService.obtenerLimiteTexto().then(valor => {
      this.limite_texto_chat = valor;
    });

    this.chatService.getConfiguracionesChat().then(configs => {
      this.configuraciones = configs.configuraciones;
      configs.extensiones.forEach(e => {
        this.extensiones_archivos.push(e.extension);
      });
    });
    
  }

  /**
   * obtiene las url de grabacion de la llamada
   */
  getRecordingUrl() {
    this.historial_service.getRecordingUrl(this.chat.idtbl_conversacion).then(result => {
      if (result != undefined && result.url_grabacion != '' && result.url_grabacion != null) {
        let urls = result.url_grabacion.split(',');
        this.is_recording = true;
        this.recording_url = urls;
      } else {
        this.is_recording = false;
      }
    });
  }

  /**
   * obtiene los mensajes de una conversacion
   */
  getMessages() {
    this.historial_service.getConversationMessages(this.chat.idtbl_conversacion, this.chat.id_estado_conversacion, this.is_user).then((result: Array<Mensaje>) => {
      (result.length == 0) ? this.is_empty_messages = true : this.is_empty_messages = false;
      let nuevos_mensajes = this.validateMessages(result, 0);
      this.chat.mensajes = nuevos_mensajes;
      this.chat.mensajes.forEach(element => {
        element.mensaje_antiguo = true;
        if (element.es_nota_voz == 1) {
          element.audioControls = {reproduciendo: false, min: 0};
          this.asignarAudio(element)
        }
      });
    });
  }

  /**
   * valida los mensajes de un usuario en el rango de 1 minuto
   * @param mensajes 
   * @param index 
   * @param mensaje_anterior 
   */
  validateMessages(mensajes, index, mensaje_anterior?) {
    let m = mensajes[index];
    if (m) {
        m.muestra_hora = true;
        index++;
        if (mensaje_anterior && m.id_usuario_envia == mensaje_anterior.id_usuario_envia) {
          let fecha_anterior = moment(mensaje_anterior.fecha_envio);
          let fecha_actual = moment(m.fecha_envio);
          let diff = fecha_anterior.diff(fecha_actual, 'minutes');
          
          if (diff == 0) {
            mensaje_anterior.muestra_hora = false;
            delete mensaje_anterior.url_imagen_gsuite;
          }
        }
        this.validateMessages(mensajes, index, m);
    }
    return mensajes;
  }

  /**
   * decodifia el texto del mensaje
   * @param text 
   */
  decodeText(text) {
    return decodeURI(text);
  }

  /**
   * cierra la modal 
   */
  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  /**
   * permite desplazar los mensajes hasta el ultimo
   */
  verNuevosMensajes() {
    if (this.componentRef && this.componentRef.directiveRef) {
      setTimeout(() => {
        this.componentRef.directiveRef.scrollToBottom();
        this.ocultar_ultimos_mensajes = false;
      }, 1);
    }
  }

  /**
   * activa el focus de la conversacion
   * @param c 
   * @param estado 
   */
  setFocus(c: Conversacion, estado: boolean) {
    c.focuseado = estado;
    if (estado) {
      c.mensajes_nuevos = false;
      c.cantidad_mensajes_nuevos = 0;
      c.mostrar_emojis = false;
    }
  }

  /**
   * habilita o deshabilita los emojis
   * @param c 
   */
  toggleEmojis(c: Conversacion) {
    if (c.mostrar_emojis) {
      c.mostrar_emojis = false;
    } else {
      c.mostrar_emojis = true;
    }
  }

  /**
   * reemplaza el emoji enviado
   * @param c 
   */
  remplazaEmoji(c: Conversacion) {
    c.texto_mensaje = this.chatService.findEmojiData(c.texto_mensaje);
  }

  /**
   * envia el mensaje correspondiente
   * @param chat 
   * @param tipo_mensaje 
   * @param url 
   * @param event 
   * @param comp 
   * @param duration 
   */
  enviarMensaje(chat: Conversacion, tipo_mensaje: number, url?: string, event?: Event, comp?: PerfectScrollbarComponent, duration?: number) {
    if (chat.texto_mensaje) {
      chat.texto_mensaje = chat.texto_mensaje.trim();
    }
    if ((chat.texto_mensaje && chat.texto_mensaje != '') || chat.archivo_adjunto || tipo_mensaje == 3) {
      if (!chat.texto_mensaje) {
        chat.texto_mensaje = '';
      }
      let m = new Mensaje();
      m.tipo_conversacion = 1;
      m.es_cliente = true;
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
      }

      chat.mensajes.push(m);
      /*this.ngZone.runOutsideAngular(() => {
        chat.mensajes.push(m);
        this.passByMensajes(chat.mensajes, 0);
      });*/
      this.chatService.usuarioDejaEscribir(chat, this.user.getId());

      if (this.componentRef && this.componentRef.directiveRef) {
        setTimeout(() => {
          this.componentRef.directiveRef.scrollToBottom();
        }, 1);
      }
      //this.fireStore.collection('paises/'+this.user.pais+'/'+'conversaciones/' + chat.codigo + '/mensajes').add(JSON.parse(JSON.stringify(m)));
      this.chatService.enviarMensaje(m);
      delete chat.texto_mensaje;
      delete chat.archivo_adjunto;
      delete chat.grabando_nota;
      this.changeRef.detectChanges();
    }
  }

  /**
   * asigna el formato audio a enviar
   * @param m 
   * @param audio 
   */
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
      let target = <HTMLAudioElement>e.target;
      m.audioControls.reproduciendo = false;
    });
    m.audio.addEventListener('play', e => {
      let target = <HTMLAudioElement>e.target;
      m.audioControls.reproduciendo = true;
    });

  }

  /**
   * adjunta un archivo 
   * @param c 
   * @param evento 
   * @param form 
   * @param input 
   */
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

  /**
   * remueve el archivo adjuntado
   * @param c 
   * @param input 
   */
  quitarArchivoAdjunto(c: Conversacion, input: HTMLInputElement) {
    delete c.archivo_adjunto;
    input.value = "";
  }

  /**
   * selecciona un emoji especifico
   * @param evento 
   * @param c 
   */
  seleccionarEmoji(evento, c: Conversacion) {
    // // console.log(evento);
    if (c.texto_mensaje) {
      c.texto_mensaje += '' + evento.emoji.native;
    } else {
      c.texto_mensaje = '';
      c.texto_mensaje += evento.emoji.native;
    }
    //c.mostrar_emojis = false;
  }

  /**
   * graba una nota de voz
   * @param c 
   * @param comp 
   */
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

  /**
   * busca una configuracion especifica de la administracion
   * @param id 
   */
  buscarConfiguracion(id: number): Configuracion {
    return this.configuraciones.find(c => {
      return c.idtbl_configuracion === id;
    });
  }

  /**
   * inicializa la duracion de una nota de voz
   * @param duration 
   * @param c 
   */
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

  /**
   * deteniene la grabacion de una nota de voz
   * @param audioBlob 
   * @param c 
   * @param comp 
   */
  onStopRecordingNotaVoz(audioBlob: Blob, c: Conversacion, comp: PerfectScrollbarComponent) {

    var voice_file = new File([audioBlob], 'nota_voz_' + moment().unix() + '.wav', { type: 'audio/wav' });
    delete c.mediaRecorder;
    var duration = moment().diff(moment(c.inicia_grabacion), 'seconds');
    this.adjuntarNotaVoz(c, voice_file, duration, comp);
    this.stream.getTracks().forEach(track => track.stop());

  }

  /**
   * adjunta la nota de voz grabada
   * @param c 
   * @param file 
   * @param duration 
   * @param comp 
   */
  adjuntarNotaVoz(c: Conversacion, file: File, duration: number, comp: PerfectScrollbarComponent) {

    c.cargando_archivo = true;
    c.grabando_nota = false;
    this.chatService.adjuntarArchivosServidor(file, true).then(archivo => {
      this.chatService.usuarioDejaEscribir(c, this.user.getId());
      this.enviarMensaje(c, 3, archivo.url, null, comp, duration);
      c.cargando_archivo = false;
    });
  }

  /**
   * envia la nota de voz grabada
   * @param c 
   * @param comp 
   */
  enviarNota(c: Conversacion, comp: PerfectScrollbarComponent) {
    c.mediaRecorder.stop(audioBlob => {
      this.onStopRecordingNotaVoz(audioBlob, c, comp);
    });
    window.clearInterval(c.interval_grabando);

  }

  /**
   * remueve la nota de voz grabada
   * @param c 
   */
  quitarNotaVoz(c: Conversacion) {
    delete c.grabando_nota;
    c.mediaRecorder.stop();
    window.clearInterval(c.interval_grabando);
    this.stream.getTracks().forEach(track => track.stop());
  }

  /**
   * cambia de estado el segundo audio
   * @param m 
   */
  cambiarSegundoAudio(m: Mensaje) {
    m.audio.pause();
    m.audio.currentTime = m.audioControls.segundo;
    m.audio.play();
  }

  /**
   * pausa o reproduce una nota de voz
   * @param c 
   * @param m 
   */
  toggleAudio(c: Conversacion, m: Mensaje) {
    c.mensajes.filter(m => {
      return m.es_nota_voz && m.audio;
    }).forEach(me => {
      me.audio.pause();
    });

    if (m.audioControls.reproduciendo) {
      m.audio.pause();
    } else {
      m.audio.play();
    }
  }

  /**
   * busca un texto dentro del chat
   * @param c 
   * @param e 
   * @param input 
   */
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
   * cierra el chat correspondiente
   * @param c 
   */
  cerrarChat(c: Conversacion) {
    this.dialog.open(CerrarChatExpertoComponent, { width: '80%', data: { no_cerro_experto: false } }).afterClosed().subscribe(d => {
      if (d && d.motivo) {
        this.chatService.cerrarConversacion(c, 3, d.motivo).then(() => {
          c.mostrar_encuesta = true;
          c.mostrar_descarga_chat = true;
          this.chatService.eliminarRecordatorioPendiente(c.idtbl_conversacion).then(() => {});
          this.is_closed = true;
          this.chatService.obtenerEncuestaExperto().then((d: any) => {
            if (d.encuesta.length != 0) {
              if (c.expert_chat && c.mostrar_encuesta) {
                this.dialogRef.disableClose = true;
              }
            } else {
              this.dialogRef.close({closed: this.is_closed});
            }
          });
        });
      }
    });
  }

  /**
   * envia el resultado de la encuesta
   * @param c 
   */
  finalizaEncuesta(c: Conversacion) {
    let index = this.chats.findIndex(chat => {
      return chat.codigo === c.codigo;
    })
    if (index !== (-1)) {
      this.chats.splice(index, 1);
    }
    this.dialogRef.close({closed: this.is_closed});
  }

  /**
   * descarga el archivo correspondiente con la informacion del chat
   * @param c 
   */
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
