import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { User } from '../../schemas/user.schema';
import { UserService } from '../providers/user.service';
import { HistorialChatService } from '../providers/historial-chat.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { matTableFilter } from '../../common/matTableFilter';
import { DialogoDetalleChatComponent } from './dialogo-detalle-chat/dialogo-detalle-chat.component';
import { ActivatedRoute } from '@angular/router';
import { FiltrosService } from '../providers/filtros.service';
import { ChatService } from '../providers/chat.service';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { Conversacion } from '../../schemas/conversacion.schema';

const moment = _rollupMoment || _moment;

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
  @Input() consola: number;
  @Input() cargar_pendientes: boolean;
  column_user;
  is_expert;
  chat_states;
  filters = {};
  chats;
  user_chat = false;
  file_url;
  categorias_experticia;
  loading = false;
  cargar_chat_pendiente;
  estado_filtro;
  constructor(private user_service: UserService, private historial_service: HistorialChatService, private change_detector: ChangeDetectorRef, public dialog: MatDialog,
    private route: ActivatedRoute, private filtros_service: FiltrosService, private chatService: ChatService) {
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

  /**
   * se obtiene el identificador de una conversacion solo si viene por parametro en la url
   */
  ngOnInit() {
    this.change_detector.detectChanges();
    this.route.params
      .filter(params => params.id_conversacion)
      .subscribe(params => {
        let id_conversacion = params.id_conversacion;
        if (id_conversacion) {
          this.getOneConversation(id_conversacion);
        }
      });

    if (this.consola != undefined && this.user.getIdRol() == 3) {
      this.loadPendingChat();
    }
  }

  ngOnChanges(changes: any) {
    if (!changes.cargar_pendientes.firstChange) {
      this.loadPendingChat();
    }
  }

  /**
   * obtiene la informacion de una conversacion especifica
   * @param conversation_id 
   */
  getOneConversation(conversation_id) {
    this.historial_service.getOneConversation(conversation_id, this.user.getId()).then(result => {
      if (result.length != 0) {
        result[0].estado = 'Pendiente';
        this.showMoreChat(result[0]);
      }
    });
  }

  /**
   * inicializa la informacion necesaria
   */
  init() {
    if (this.user.getIdRol() == 2) {
      this.column_user = 'Nombre Cliente';
      this.is_expert = true;
      this.getExpertChat();
    } else {
      this.column_user = 'Nombre Experto';
      this.is_expert = false;
      this.user_chat = true;
      this.getClientChat();
    }
    this.getChatState();
  }

  /**
   * crea la tabla con la informacion correspondiente
   * @param result 
   */
  createTable(result) {
    this.dataSource = new MatTableDataSource(result);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.change_detector.detectChanges();
    this.matTableFilter = new matTableFilter(this.dataSource, this.filterColumns);
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key]);
      }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }
  }

  /**
   * obtiene el estado de una conversacion
   */
  getChatState() {
    this.filtros_service.getConversationStates().then(result => {
      this.chat_states = result;
    });
  }

  /**
   * obtiene los chat de un experto especifico
   */
  getExpertChat() {
    this.historial_service.getExpertChats(this.user.getId()).then(result => {
      this.chats = result;
      if (this.estado_filtro) {
        this.filterData('estado', this.estado_filtro);
      } else {
        this.createTable(this.chats);
      }
      this.change_detector.detectChanges();
    });
  }

  /**
   * obtiene los chat de un cliente especifico
   */
  getClientChat() {
    this.historial_service.getClientChats(this.user.getId()).then(result => {
      this.chats = result;
      this.createTable(result);
      this.change_detector.detectChanges();
    });
  }

  /**
   * obtiene los chat pendientes para mostrar en el historial del supervisor
   */
  getPendingChat() {
    this.historial_service.getPendingChat().then(result => {
      this.chats = result;
      this.createTable(result);
      this.change_detector.detectChanges();
    });
  }

  /**
   * carga los chat pendientes
   */
  loadPendingChat() {
    this.column_user = 'Nombre Experto';
    this.is_expert = false;
    this.user_chat = true;
    this.getPendingChat();
    this.getCategoriasExperticia();
  }

  /**
   * abre la modal con el historial correspondiente del chat
   * @param row 
   */
  showMoreChat(row) {
    let idtbl_usuario = this.user.getId();
    let expert_chat;
    let user_chat = this.user_chat;
    if (this.is_expert && (row.estado == 'Pendiente' || row.id_estado_conversacion == 7)) {
      expert_chat = true;
    }

    let dialog_ref = this.dialog.open(DialogoDetalleChatComponent, {
      panelClass: 'dialog-chat',
      width: '550px',
      height: '90vh',
      data: { ...row, idtbl_usuario, expert_chat, user_chat }
    });

    dialog_ref.afterClosed().subscribe(result => {
      if (result) {
        this.getExpertChat();
      }
    });
  }

  /**
   * aplica filtros generales a la tabla
   * @param filterValue 
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /**
   * aplica filtros especificos por estado a la tabla 
   * @param name 
   * @param event 
   */
  filterData(name, estado) {

    if (estado == 'todos') {
      this.createTable(this.chats);
    } else {

      this.estado_filtro = estado;

      this.filters[name] = this.estado_filtro;

      let newArray = this.chats;
      for (const key in this.filters) {
        newArray = newArray.filter(element => {
          return element[key] == this.filters[key];
        });
      }
      this.createTable(newArray);
    }
  }

  /**
   * descarga el archivo correspondiente con la informacion del chat
   * @param c 
   */
  descargarChat(row) {
    row.loading = true;
    this.chatService.generarPdf(row.idtbl_conversacion).then((d) => {
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

        let date = moment(row.fecha_creacion).format('YYYY-MM-DD');
        let hour = moment(row.fecha_creacion).format('HH:mm');

        let link = document.createElement("a");
        link.href = this.file_url;
        link.download = `soporte-chat-conecta-${date}-${hour}.pdf`;
        window.document.body.appendChild(link);
        link.click();
        row.loading = false;
      }
    });
  }

  /**
   * obtiene todas las categorias de experticia
   */
  getCategoriasExperticia() {
    this.chatService.getCategoriasExperticia().then((c) => {
      this.categorias_experticia = c;
    });
  }

  /**
   * filtra los chat de acuerdo a las categorias de experticia
   * @param event 
   */
  filtrarCategorias(event) {
    this.loading = true;
    let categorias = event.value;
    if (categorias.length != 0) {
      this.chatService.obtenerUsuarioPorCategoria(categorias).then((expertos: any) => {
        let newArray = this.chats;
        newArray = newArray.filter(element => {
          let chat_filtrado = false;
          expertos.forEach(experto => {
            if (element.id_experto_actual === experto.id_usuario) {
              chat_filtrado = true;
            }
          });
          this.loading = false;
          return chat_filtrado;
        });
        this.createTable(newArray);
      });
    } else {
      this.createTable(this.chats);
      this.loading = false;
    }
  }

}
