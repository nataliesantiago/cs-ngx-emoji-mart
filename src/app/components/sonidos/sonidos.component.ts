import { Component, OnInit } from '@angular/core';
import { SonidosService } from '../../providers/sonidos.service';

@Component({
  selector: 'app-sonidos',
  templateUrl: './sonidos.component.html',
  styleUrls: ['./sonidos.component.scss']
})
export class SonidosComponent implements OnInit {
  mensaje: HTMLAudioElement;
  cliente: HTMLAudioElement;
  sos: HTMLAudioElement;
  notificacion: HTMLAudioElement;
  constructor(private soundService: SonidosService) {
    this.mensaje = new Audio();
    this.mensaje.src = 'assets/sounds/message.mp3';
    this.mensaje.load();
    this.cliente = new Audio();
    this.cliente.src = 'assets/sounds/cliente.wav';
    this.cliente.load();
    this.sos = new Audio();
    this.sos.src = 'assets/sounds/alarma.wav';
    this.sos.load();
    this.notificacion = new Audio();
    this.notificacion.src = 'assets/sounds/notificacion.mp3';
    this.notificacion.load();
    this.soundService.sonidoObserver.subscribe(t => {
      let media;


      switch (t) {
        case 1:
          if (this.mensaje)
            media = this.mensaje;
          break;
        case 2:
          if (this.cliente)
            media = this.cliente;
          break;
        case 3:
          if (this.sos)
            media = this.sos;
          break;
        case 4:
          if (this.notificacion)
            media = this.notificacion;
          break;
      }
      if (media) {
        const playPromise = media.play();
        if (playPromise !== null) {
          playPromise.catch(() => { media.play(); })
        }
      }
    })
  }

  ngOnInit() {
  }

  

}
