import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticationService } from '../services/autenticacion.service';
import { ResponseSearch } from '../models/response-search';
import { UserService } from '../providers/user.service';
import { User } from '../../schemas/user.schema';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanDeactivate<boolean> {
    primer_login: boolean = true; // Se enmcarga de controlar cuando el usuario abre la aplicacion por primera vez
    constructor(private router: Router, private autenticationService: AutenticationService, private responseSearch: ResponseSearch, private userService: UserService) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.userService.getUsuario()) {
            this.responseSearch.setActive(true);
        }
        if (state.root.queryParams.data != null && state.root.queryParams.data !== "") {
            this.responseSearch.setActive(false);
            return new Promise<boolean>(resolve => {
                let data = JSON.parse(state.root.queryParams.data);
                let user = new User(data.profile.email, data.token, data.profile.nombre);
                user.url_foto = data.profile.foto;
                this.userService.setUsuario(user);
                localStorage.setItem("token", data.token);
                // console.log('usuario d', this.userService.getUsuario());
                this.router.navigate(['home']);
                setTimeout(() => {
                    resolve(true);
                }, 1);
            })

        } else if (this.userService.getUsuario()) {
            // console.log('usuario', this.userService.getUsuario());
            this.responseSearch.setActive(false);
            return new Promise<boolean>(resolve => {
                setTimeout(() => {
                    resolve(true);
                }, 1);
            })

        } else {
            console.log('loading...');
            return new Promise<boolean>(resolve => {
                this.userService.validarUsuario(this.primer_login).subscribe(d => {
                    this.primer_login = false;
                    this.responseSearch.setActive(false);
                    setTimeout(() => {
                        if (d.url) {
                            window.location.href = d.url;
                            resolve(false);
                        } else if (d.profile) {
                            let user = new User(d.profile.email, localStorage.getItem('token'), d.profile.nombre);
                            user.setId(d.profile.idtbl_usuario);
                            user.setIdPerfil(d.profile.id_perfil);
                            user.setIdRol(d.profile.id_rol);
                            user.url_foto = d.profile.foto;
                            this.userService.setUsuario(user);
                            if (next.routeConfig.path == "") {
                                this.router.navigate(['home']);
                            } else {
                                //this.router.navigate([next.routeConfig.path]);
                            }
                            resolve(true);
                        } else {
                            console.error('No se puede cargar la aplicación');
                            resolve(false);
                        }
                    }, 1);

                })
            });

            //return true;
        }
    }
    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
        console.log('pp')
        return true;
    }
    isAuthenticated() {
        if (localStorage.getItem('token') != null && localStorage.getItem('token').toString() !== '') {
            if (!this.userService.getUsuario()) {
                this.userService.loadProfile(localStorage.getItem('token'));
            }
            return true;
        }
        return false;
    }
}
