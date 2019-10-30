import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseSearch } from '../models/response-search';
import { HomeService } from '../services/home.service';
import { SearchService } from '../providers/search.service';
import { ResultadoCloudSearch } from '../../schemas/interfaces';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  resultado = true;
  busqueda: string;
  busquedaUrl: string;
  valorBusqueda: string;
  ortografia = false;
  busquedaCorregida: string;
  resultados: Array<ResultadoCloudSearch>;
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
    this.init();

  }
  init() {
    this.activatedRoute.params.subscribe(params => {
      console.log(' paso por aca');
      this.busqueda = params.id;
      this.busquedaUrl = encodeURI(this.busqueda);
      this.searchService.queryCloudSearch(this.busqueda).then(d => {
        console.log(d);
        this.resultados = d.results;
        if (d.resultCountExact < 1) {
          this.resultado = false;
        }
        if (d.spellResults) {
          this.ortografia = true;
          this.busquedaCorregida = d.spellResults[0].suggestedQuery;
          this.busquedaUrl = (this.busquedaCorregida);
        }
      });
    });
  }
  buscar() {

    this.router.navigate(['/search/' + this.valorBusqueda]);
  }

}
