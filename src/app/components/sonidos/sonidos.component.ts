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
    this.soundService.sonidoObserver.subscribe(t => {
      switch (t) {
        case 1:
          this.mensaje.play();
          break;
        case 2:
          this.cliente.play();
          break;
        case 3:
          this.sos.play();
          break;
        case 4:
          this.notificacion.play();
          break;
      }
    })
  }

  ngOnInit() {
  }

  asignarAudioMensaje(element: HTMLAudioElement, tipo: number) {
    switch (tipo) {
      case 1:
        this.mensaje = element;
        break;
      case 2:
        this.cliente = element;
        break;
      case 3:
        this.sos = element;
        break;
      case 4:
        this.notificacion = element;
        break;
    }
  }

}
