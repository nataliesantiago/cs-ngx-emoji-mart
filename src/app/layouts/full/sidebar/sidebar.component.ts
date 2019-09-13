import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  ViewChild,
  HostListener,
  Directive,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../../shared/menu-items/menu-items';
import { AutenticationService } from '../../../services/autenticacion.service';
import { Router } from '@angular/router';
import { AjaxService } from '../../../providers/ajax.service';
import { UserService } from '../../../providers/user.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class AppSidebarComponent implements OnDestroy {
  public config: PerfectScrollbarConfigInterface = {};
  mobileQuery: MediaQueryList;
  nuevas_urls = [];
  usuario;
  id_usuario;

  private _mobileQueryListener: () => void;
  status: boolean = false;
  @Output() cerrado = new EventEmitter<boolean>();
  clickEvent() {
    this.status = !this.status;
  }

  subclickEvent() {
    this.status = true;
  }
  constructor(
    private ajax: AjaxService,
    private user: UserService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    public autenticationService: AutenticationService,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.usuario = user.getUsuario();

    this.ajax.get('user/obtenerUsuario', { correo: this.usuario.correo }).subscribe(d => {
      if (d.success) {

        this.id_usuario = d.usuario[0].idtbl_usuario;
        this.ajax.get('administracion/obtener-url', { id_usuario: this.id_usuario }).subscribe(p => {
          if (p.success) {

            this.nuevas_urls = p.items;
          }
        })
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  deslogueo() {
    this.autenticationService.logOut();
  }

  cerrarMenu() {
    this.cerrado.emit(false);
  }

  sugerirPreguntas() {
    this.router.navigate(['/formulario-preguntas-flujo-curaduria', 'sugerida']);
  }

}
