import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticationService } from '../services/autenticacion.service';
import { ResponseSearch } from '../models/response-search';

@Injectable({
    providedIn: 'root'
})
export class HomeGuard implements CanActivate {

    constructor(private router: Router, private autenticationService: AutenticationService, private responseSearch: ResponseSearch) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
           // debugger;
        this.responseSearch.setActive(true);
        if (this.isAuthenticated()) {
            this.responseSearch.setActive(false);
            return true;
        } else {
            this.router.navigate(['']);
            return false;
        }

    }

    isAuthenticated() {
        if (sessionStorage.getItem('token') != null && sessionStorage.getItem('token').toString() !== '') {
            return true;
        }
        return false;
    }
}
