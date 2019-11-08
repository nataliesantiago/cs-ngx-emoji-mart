import { ChangeDetectorRef, Component, NgZone, OnDestroy, ViewChild, HostListener, Directive, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
import { AutenticationService } from '../../../services/autenticacion.service';
import { Router } from '@angular/router';
import { AjaxService } from '../../../providers/ajax.service';
import { UserService } from '../../../providers/user.service';
import { User } from '../../../../schemas/user.schema';
import { EstadoExpertoService } from '../../../providers/estado-experto.service';
import { LogEstadoExperto } from '../../../../schemas/interfaces';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class AppSidebarComponent implements OnDestroy {
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;
  nuevas_urls = [];
  user: User;
  id_usuario;
  state: LogEstadoExperto = {id_usuario_experto: null, id_estado_experto_actual: null, id_estado_experto_nuevo: null, estado_ingreso: null};

  private _mobileQueryListener: () => void;
  status: boolean = false;
  @Output() cerrado = new EventEmitter<boolean>();
  clickEvent() {
    this.status = !this.status;
  }

  subclickEvent() {
    this.status = true;
  }
  constructor(private ajax: AjaxService, private userService: UserService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public menuItems: MenuItems, 
    public autenticationService: AutenticationService, private router: Router, private estadoExpertoService: EstadoExpertoService) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
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

    this.ajax.get('administracion/obtener-url', { id_usuario: this.user.getId() }).subscribe(p => {
      if (p.success) {
        this.nuevas_urls = p.items;
      }
    });
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  deslogueo() {
    this.autenticationService.logOut();
    this.state.id_usuario_experto = this.user.getId();
    this.state.id_estado_experto_actual = this.user.getEstadoExpertoActual();
    this.state.estado_ingreso = 0;
    this.estadoExpertoService.createLogState(this.state);
  }

  cerrarMenu() {
    this.cerrado.emit(false);
  }

  sugerirPreguntas() {
    this.router.navigate(['/formulario-preguntas-flujo-curaduria', 'sugerida']);
  }

}
