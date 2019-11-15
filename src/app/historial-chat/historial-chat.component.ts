import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { User } from '../../schemas/user.schema';
import { UserService } from '../providers/user.service';
import { HistorialChatService } from '../providers/historial-chat.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { matTableFilter } from '../../common/matTableFilter';
import { DialogoDetalleChatComponent } from './dialogo-detalle-chat/dialogo-detalle-chat.component';
import { ActivatedRoute } from '@angular/router';
import { FiltrosService } from '../providers/filtros.service';

@Component({
  selector: 'app-historial-chat',
  templateUrl: './historial-chat.component.html',
  styleUrls: ['./historial-chat.component.scss']
})
export class HistorialChatComponent implements OnInit {

  user: User;
  displayedColumns = ['acciones', 'nombre', 'fecha_creacion', 'estado', 'producto', 'busqueda'];
  dataSource: MatTableDataSource<any>;
  matTableFilter: matTableFilter;
  filterColumns = [
    { field: 'nombre', type: 'string' },
    { field: 'fecha_creacion', type: 'date' },
    { field: 'estado', type: 'string' },
    { field: 'producto', type: 'string' },
    { field: 'busqueda', type: 'string' }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  column_user;
  is_expert;
  chat_states;
  filters = {};
  chats;

  constructor(private user_service: UserService, private historial_service: HistorialChatService, private change_detector: ChangeDetectorRef, public dialog: MatDialog, 
    private route: ActivatedRoute, private filtros_service: FiltrosService) {
    this.user = this.user_service.getUsuario();
    if (this.user) {
      this.init();
    }
    this.user_service.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
        this.init();
      } else {
        delete this.user;
      }
    });

  }

  ngOnInit() {
    this.route.params
    .filter(params => params.id_conversacion)
    .subscribe(params => {
      let id_conversacion = params.id_conversacion;
      if (id_conversacion) {
        this.getOneConversation(id_conversacion);
      }
    });
  }

  getOneConversation(conversation_id) {
    this.historial_service.getOneConversation(conversation_id, this.user.getId()).then(result => {
      if(result.length != 0) {
        result[0].estado = 'Pendiente';
        this.showMoreChat(result[0]);
      }
    });
  }

  init() {
    if (this.user.getIdRol() == 2) {
      this.column_user = 'Nombre Cliente';
      this.is_expert = true;
      this.getExpertChat();
    } else {
      this.column_user = 'Nombre Experto';
      this.is_expert = false;
      this.getClientChat();
    }
    this.getChatState();
  }

  createTable(result) {
    this.dataSource = new MatTableDataSource(result);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.change_detector.detectChanges();
    this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
  }

  getChatState() {
    this.filtros_service.getConversationStates().then(result => {
      this.chat_states = result;
    });
  }

  getExpertChat() {
    this.historial_service.getExpertChats(this.user.getId()).then(result => {
      this.chats = result;
      this.createTable(this.chats);
      this.change_detector.detectChanges();
    });
  }

  getClientChat() {
    this.historial_service.getClientChats(this.user.getId()).then(result => {
      this.chats = result;
      this.createTable(result);
      this.change_detector.detectChanges();
    });
  }

  showMoreChat(row) {
    let idtbl_usuario = this.user.getId();
    let expert_chat;
    if (this.is_expert && row.estado == 'Pendiente' || row.id_estado_conversacion == 7) {
      expert_chat = true;
    }
    
    let dialog_ref = this.dialog.open(DialogoDetalleChatComponent, {
      panelClass: 'dialog-chat',
      width: '550px',
      height: '90vh',
      data: { ...row, idtbl_usuario, expert_chat }
    });

    dialog_ref.afterClosed().subscribe(result => {
      if (result) {
        this.getExpertChat();
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  filterData(name, event) {
    if (event.value == 'todos') {
      this.createTable(this.chats);
    } else {
      this.filters[name] = event.value;
      let newArray = this.chats;
      for (const key in this.filters) {
        newArray = newArray.filter(element => {
          return element[key] == this.filters[key];
        });
      }
      this.createTable(newArray);
    }
  }

}
