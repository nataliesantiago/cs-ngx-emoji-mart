import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticationService } from '../services/autenticacion.service';
import { ResponseSearch } from '../models/response-search';
import { UserService } from '../../providers/user.service';
import { User } from '../../schemas/user.schema';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private autenticationService: AutenticationService, private responseSearch: ResponseSearch, private userService: UserService) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        this.responseSearch.setActive(true);
        if (state.root.queryParams.data != null && state.root.queryParams.data !== "") {
            let data = JSON.parse(state.root.queryParams.data);
            let user = new User(data.profile.email, data.token, data.profile.nombre);
            user.url_foto = data.profile.foto;
            this.userService.setUsuario(user);
            localStorage.setItem("token", data.token);
            this.router.navigate(['home']);
            this.responseSearch.setActive(false);
            return true;
        } else if (!this.isAuthenticated()) {
            //this.autenticationService.logout();
            this.autenticationService.urlAutenticacion().subscribe(data => {
                window.location.href = data.url;
            });
            return false;
        } else {
            //this.router.navigate(['home']);
            this.responseSearch.setActive(false);
            return true;
        }

    }

    isAuthenticated() {
        if (localStorage.getItem('token') != null && localStorage.getItem('token').toString() !== '') {
            if(!this.userService.getUsuario()){
                this.userService.loadProfile(localStorage.getItem('token'));
            }
            return true;
        }
        return false;
    }
}
