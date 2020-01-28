import { Component, OnInit } from '@angular/core';
import { LookFeelService } from '../providers/look-feel.service';
import { ResponseSearch } from '../models/response-search';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  url_logo: string;
  constructor(private lookService: LookFeelService, private responseSearch: ResponseSearch) { }

  ngOnInit() {

    setTimeout(() => {
      //this.responseSearch.setActive(false);
    }, 1);
    this.lookService.getSpecificSetting('url_logo').then((result) => {
      if (result && result[0] && result[0].valor) {
        this.url_logo = result[0].valor;
      }
    });
  }

}
