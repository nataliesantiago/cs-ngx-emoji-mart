import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticationService } from '../services/autenticacion.service';
import { ResponseSearch } from '../models/response-search';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private autenticationService: AutenticationService, private responseSearch: ResponseSearch) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        this.responseSearch.setActive(true);
        if (state.root.queryParams.data != null && state.root.queryParams.data !== "") {
            sessionStorage.setItem("token", state.root.queryParams.data);
            this.router.navigate(['home']);
            this.responseSearch.setActive(false);
            return true;
        }
        if (!this.isAuthenticated()) {
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
        if (sessionStorage.getItem('token') != null && sessionStorage.getItem('token').toString() !== '') {
            return true;
        }
        return false;
    }
}
