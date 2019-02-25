import { Component, ElementRef } from '@angular/core';
import { AbstractPage } from '../abstract.page.component';
import { RouteService } from 'src/app/service/route.service';

@Component({
    selector: '',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
  })

  export class HomeComponent extends AbstractPage{

    constructor(routeService:RouteService, elRef:ElementRef){
      super(routeService, elRef);
  }
      
  }