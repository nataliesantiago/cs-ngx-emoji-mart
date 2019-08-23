import { Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { UserService } from '../../../providers/user.service';
import { User } from '../../../../schemas/user.schema';
import { ChatService } from '../../../providers/chat.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {

  profileImage = '../../../../assets/images/users/profle.svg';
  estados_operador = [{ id: 1, nombre: 'Activo' }, { id: 2, nombre: 'Inactivo' }];
  user: User;
  constructor(private userService: UserService, private chatService: ChatService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe((u: User) => {
      // console.log(u);
      if (u) {
        this.user = u;
        this.profileImage = u.url_foto;
        if (this.user.getIdRol() == 2) {
          this.cambiarEstadoExperto({ value: 1 });
        }
      }
    });
    if (this.userService.getUsuario()) {
      this.profileImage = this.userService.getUsuario().url_foto;
      if (this.user.getIdRol() == 2) {
        this.cambiarEstadoExperto({ value: 1 });
      }
    }
  }

  cambiarEstadoExperto(e) {
    let activo = (e.value == 1) ? true : false;
    this.userService.setActivoExperto(activo);
  }

  public config: PerfectScrollbarConfigInterface = {};
  // This is for Notifications
  notifications: Object[] = [
    {
      round: 'round-danger',
      icon: 'ti-link',
      title: 'Launch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      round: 'round-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {
      round: 'round-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      round: 'round-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];
  abrirChat() {
    this.chatService.crearConversacion();
  }
}
