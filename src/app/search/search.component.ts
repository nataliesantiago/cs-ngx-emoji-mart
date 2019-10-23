import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseSearch } from '../models/response-search';
import { HomeService } from '../services/home.service';
import { SearchService } from '../providers/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  resultado = true;
  busqueda: string;
  valorBusqueda: string;
  ortografia = false;
  busquedaCorregida: string;
  resultadosBus;
  respuesta: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public responseSearch: ResponseSearch,
    private homeService: HomeService,
    private searchService: SearchService
  ) {

  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.busqueda = params.get('id');
      this.searchService.queryCloudSearch(this.busqueda).then(d => {
        console.log(d);
      });
    });

  }
  resultados() {

  }
  buscar() {

    this.router.navigate(['/search/' + this.valorBusqueda]);
  }

}
