import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatChipInputEvent } from '@angular/material';
import { User } from '../../schemas/user.schema';
import { ShortCut, ComandoShortcut, GuionChat } from '../../schemas/interfaces';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ChatService } from '../providers/chat.service';
import { UserService } from '../providers/user.service';
import { FormControl } from '@angular/forms';
import { ShortcutsService } from '../providers/shortcuts.service';
import swal from 'sweetalert2';
import { matTableFilter } from '../../common/matTableFilter';

@Component({
  selector: 'app-administrador-shortcuts',
  templateUrl: './administrador-shortcuts.component.html',
  styleUrls: ['./administrador-shortcuts.component.scss']
})

export class AdministradorShortcutsComponent implements OnInit {
  user: User;
  creando_extension = false;
  displayedColumns = ['acciones', 'comandos', 'guion'];
  dataSource: MatTableDataSource<any>;
  matTableFilter:matTableFilter;
  filterColumns = [
    {field: 'guion', type:'string'}];
  extensiones = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  comandos = [];
  iniciadores = [16, 17, 18];
  separatorKeysCodes = [ENTER, COMMA];
  nuevo_shortcut: ShortCut = { activo: true };
  removable = false;
  habilitado = true;
  guiones = [];
  creando_shortcut = false;
  createControl = new FormControl();
  shortcuts: ShortCut[];
  constructor(private chatService: ChatService, private userService: UserService, private shortcutsService: ShortcutsService) {
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
  }

  init() {
    this.chatService.getGuiones().then(guiones => {
      this.guiones = guiones.filter(g => {
        return g.activo;
      })
    });
    this.shortcutsService.getShortcutsUsuario().then((s: Array<ShortCut>) => {
      s.forEach(shortcut => {
        shortcut.comandos = [];
        if (shortcut.ctrl) {
          shortcut.comandos.push({ key: 'Control' })
        }
        if (shortcut.alt) {
          shortcut.comandos.push({ key: 'Alt' })
        }
        if (shortcut.shift) {
          shortcut.comandos.push({ key: 'Shift' })
        }
        shortcut.comandos.push({ key: this.shortcutsService.getKey(shortcut.comando) });
      });
      this.shortcuts = s;
      this.dataSource = new MatTableDataSource(this.shortcuts);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
    })
  }

  seleccionaGuion(value: GuionChat) {
    this.nuevo_shortcut.id_guion = value.idtbl_guion_chat;
    this.createControl.setValue(value.texto);
  }

  ngOnInit() {
  }

  add(event: KeyboardEvent): void {
    // console.log(event);
    event.preventDefault();
    event.stopPropagation();
    if (!this.nuevo_shortcut.comando) {
      let code = event.which;
      this.nuevo_shortcut.error = false;

      if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
        this.nuevo_shortcut.error = true;
      } else if (this.iniciadores.indexOf(code) == (-1)) {
        this.nuevo_shortcut.comando = code;
        this.nuevo_shortcut.ctrl = event.ctrlKey;
        this.nuevo_shortcut.alt = event.altKey;
        this.nuevo_shortcut.shift = event.shiftKey;
        if (event.ctrlKey) {
          this.comandos.push({ key: 'Control' })
        }
        if (event.altKey) {
          this.comandos.push({ key: 'Alt' })
        }
        if (event.shiftKey) {
          this.comandos.push({ key: 'Shift' })
        }
        this.comandos.push({ key: event.code.toString().replace('Key', '') });

      }
    }
  }

  soltar() {
    if (this.comandos.length > 0)
      setTimeout(() => {
        this.habilitado = false;
      }, 200);
  }

  reset() {
    this.nuevo_shortcut = { activo: true };
    this.comandos = [];
    this.habilitado = true;
  }

  remove(index: any): void {
    console.log(index);
    if (index >= 0) {
      this.comandos.splice(index, 1);
    }
  }

  crearShortcut() {
    this.nuevo_shortcut.id_usuario = this.user.getId();
    this.shortcutsService.crearShortcut(this.nuevo_shortcut).then(id => {
      this.init();
      this.creando_extension = false;
      this.reset();
      this.createControl.setValue('');
    }).catch((err) => {
      swal.fire({
        title: 'Advertencia',
        text: "El Shortcut que intenta ingresar ya existe, por favor ingrese uno diferente",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        if (result.value) {
          this.reset();
          this.createControl.setValue('');
        }
      });
    });
  }

  eliminarShortcut(e) {
    swal.fire({
      title: 'Cuidado',
      text: "Desea Borrar el guión",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.shortcutsService.desactivarShortcut(e.idtbl_shortcut_operador).then((r) => {
          this.init();
        });
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
