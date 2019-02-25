import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { StructureRequest } from '../ajax/structureXML.request';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { Subscription } from '../../../node_modules/rxjs';
import { PageEntitiesManager } from '../entities/pageEntity/page.entities.manager';
import { Router, ActivatedRoute, Event, NavigationEnd, NavigationStart } from '@angular/router';
import { RouteService } from '../service/route.service';

@Component({
  selector: 'structure-root',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss'],
  //providers: [NavComponent],
})

export class StructureComponent implements OnInit {
  
  private _subLoadStructure:Subscription;
  private pageManagerEntities:PageEntitiesManager;
  private currentPageId:number;
  private newUrl:string;
  private currentUrl:string;

  constructor(private loadStructureXML:StructureRequest, private route: Router, private activeRoute: ActivatedRoute, private routeService:RouteService){
    
  }

  ngOnInit() {
    this._subLoadStructure = this.loadStructureXML.getStructureXML().subscribe((res:Response) => this.parseXML(res), (err:HttpErrorResponse) => this.parseXmlWithErr(err));
    this.route.events.subscribe((event:Event):void => { this.onRouteEvent(event)});
    this.routeService.routeStartChange.subscribe((url:string) => this.diseappearCurrentPage(url));
    this.routeService.pageClose.subscribe(() => this.changeRoute());
  }

  private dispatchNewRoute(){
    this.routeService.routeChanged.emit({data:this.pageManagerEntities.getPageEntities()[this.currentPageId], url:this.currentUrl});
  }

  private parseXML(data:Response) {
    this.transformXmlToObject(data.text());
  }

  private parseXmlWithErr(data:HttpErrorResponse){
    if(data.status == 200){
      this.transformXmlToObject(data.error.text);
    }
  }

  private transformXmlToObject(dataXML:string){
    this.loadStructureXML.structureXmlLoaded.emit(dataXML);
    this._subLoadStructure.unsubscribe();

    if(dataXML != ''){
      this.pageManagerEntities = new PageEntitiesManager(dataXML);
    }

    this.dispatchNewRoute();
  }

  private onRouteEvent(event:Event){
    if (event instanceof NavigationEnd) {
      this.currentUrl = event.url;
      this.currentPageId = Number(this.getParamRoute());
      if(this.pageManagerEntities != null){
        this.dispatchNewRoute();
      }
    }
  }

  private getParamRoute():string{
    /*console.log(this.activeRoute); 
    console.log(this.activeRoute.snapshot); 
    console.log(this.activeRoute.snapshot.params); 
    console.log(this.activeRoute.snapshot.children);*/
    return this.activeRoute.snapshot.children[0].params.idPage;
    //return this.activeRoute.snapshot.params['id'];
  }

  private diseappearCurrentPage(url:string){
    this.newUrl = url;
  }

  private changeRoute(){
    this.route.navigateByUrl(this.newUrl);
  }

}
