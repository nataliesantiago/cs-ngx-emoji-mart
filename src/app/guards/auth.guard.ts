import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticationService } from '../services/autenticacion.service';
import { ResponseSearch } from '../models/response-search';
import { UserService } from '../providers/user.service';
import { User } from '../../schemas/user.schema';
import { reject } from 'q';
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanDeactivate<boolean> {
    primer_login: boolean = true; // Se enmcarga de controlar cuando el usuario abre la aplicacion por primera vez
    constructor(private router: Router, private autenticationService: AutenticationService, private responseSearch: ResponseSearch, private userService: UserService, private route: ActivatedRoute, private firebaseAuth: AngularFireAuth) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.userService.getUsuario()) {
            this.responseSearch.setActive(true);
        }
        let d = next.params.data;
        if (d != null && d !== "") {

            return new Promise<boolean>(resolve => {
                let data = JSON.parse(atob(d));

                localStorage.setItem('token', data.token);
                localStorage.setItem('pais', data.pais);
                this.userService.validarUsuario(this.primer_login).subscribe(d => {
                    //debugger;
                    this.primer_login = false;
                    if (d.url) {
                        window.location.href = d.url;
                        reject(false);
                    } else if (d.profile) {
                        let user = new User(d.profile.email, d.profile.token, d.profile.nombre);
                        user.setId(d.profile.idtbl_usuario);
                        user.setIdPerfil(d.profile.id_perfil);
                        user.setIdRol(d.profile.id_rol);
                        user.modulos = d.modulos;
                        user.url_foto = d.profile.foto;
                        user.boton_sos_perfil = d.profile.boton_sos_perfil;
                        user.boton_sos_rol = d.profile.boton_sos_rol;
                        user.codigo_firebase = d.profile.codigo_firebase;
                        user.pass_firebase = d.profile.pass_firebase;
                        user.modo_nocturno = d.profile.modo_nocturno;
                        user.pais = d.profile.pais;
                        this.userService.definirPaisUsuario(d.profile.pais);
                        this.userService.setUsuario(user).then(() => {
                            this.responseSearch.setActive(false);
                            localStorage.setItem("token", data.token);
                            this.router.navigate(['home']);

                            setTimeout(() => {
                                resolve(true);
                            }, 1);
                        });
                    } else {
                        console.error('No se puede cargar la aplicación');
                        reject(false);
                    }

                })

                /* let user = new User(data.email, data.token, data.nombre);
                 user.setId(data.idtbl_usuario);
                 user.setIdPerfil(data.id_perfil);
                 user.setIdRol(data.id_rol);
                 user.url_foto = data.foto;
                 user.codigo_firebase = data.codigo_firebase;
                 user.pass_firebase = data.pass_firebase;
                 user.modo_nocturno = data.modo_nocturno;
                 user.modulos = JSON.parse(decodeURIComponent(escape(JSON.stringify(data.modulos))));
                 user.boton_sos_perfil = data.boton_sos_perfil;
                 user.boton_sos_rol = data.boton_sos_rol;
                 this.userService.definirPaisUsuario(data.pais);
                 user.pais = data.pais;
                 this.userService.setUsuario(user).then(() => {
                     this.responseSearch.setActive(false);
                     localStorage.setItem("token", data.token);
                     this.router.navigate(['home']);
 
                     setTimeout(() => {
                         resolve(true);
                     }, 1);
                 });
                 */

            })

        } else if (this.userService.getUsuario()) {
            if (next.data.bypass) {
                return true;
            } else {
                let modulos_usuario = this.userService.getUsuario().modulos;
                for (let index = 0; index < modulos_usuario.length; index++) {
                    if (modulos_usuario[index].idtbl_modulo == next.data.modulo) {
                        return true
                    }

                }
                this.router.navigate(['home']);
                console.log('Invalid route');
                return false;
            }
            //this.responseSearch.setActive(false);
        } else {
            console.log('loading...');

            return new Promise<boolean>(resolve => {

                this.userService.validarUsuario(this.primer_login).subscribe(d => {
                    //debugger;
                    this.primer_login = false;
                    if (d.url) {
                        window.location.href = d.url;
                        reject(false);
                    } else if (d.profile) {
                        let user = new User(d.profile.email, d.profile.token, d.profile.nombre);
                        user.setId(d.profile.idtbl_usuario);
                        user.setIdPerfil(d.profile.id_perfil);
                        user.setIdRol(d.profile.id_rol);
                        user.modulos = d.modulos;
                        user.url_foto = d.profile.foto;
                        user.boton_sos_perfil = d.profile.boton_sos_perfil;
                        user.boton_sos_rol = d.profile.boton_sos_rol;
                        user.codigo_firebase = d.profile.codigo_firebase;
                        user.pass_firebase = d.profile.pass_firebase;
                        user.modo_nocturno = d.profile.modo_nocturno;
                        user.pais = d.profile.pais;
                        this.userService.definirPaisUsuario(d.profile.pais);
                        this.userService.setUsuario(user).then(() => {
                            this.responseSearch.setActive(false);
                            setTimeout(() => {
                                if (next.routeConfig.path == "") {
                                    this.router.navigate(['home']);
                                } else {
                                    //this.router.navigate([next.routeConfig.path]);
                                }
                                resolve(true);
                            }, 1);
                        });
                    } else {
                        console.error('No se puede cargar la aplicación');
                        reject(false);
                    }

                })
            });

            //return true;
        }
    }
    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

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
