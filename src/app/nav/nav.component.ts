import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuEntitiesManager } from '../entities/menuEntity/menuEntities.manager';
import { StructureRequest } from '../ajax/structureXML.request';
import { ManagerNav3D } from './manager.nav3d';
import { RouteService } from '../service/route.service';

@Component({
  selector: 'nav-root',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {

  @ViewChild('myCanvas') canvasRef: ElementRef;
  @ViewChild('leftButton') leftButton: ElementRef;
  @ViewChild('rightButton') rightButton: ElementRef;
  //private menuEntities:Array<any> = [];
  private menuManagerEntities:MenuEntitiesManager;
  private managerNav3D:ManagerNav3D;
  
  constructor(private loadStructureXML:StructureRequest, private routeService:RouteService){
    
  }

  ngOnInit() {
    this.loadStructureXML.structureXmlLoaded.subscribe((data:string) => this.build(data));
    this.leftButton.nativeElement.addEventListener('click', (e:MouseEvent) => {this.moveLeftHandler(e)});
    this.rightButton.nativeElement.addEventListener('click', (e:MouseEvent) => {this.moveRightHandler(e)});
    this.addButtonListener();
  }

  private build(dataXML:string){
    if(dataXML != ''){
      this.menuManagerEntities = new MenuEntitiesManager(dataXML);
      //this.menuEntities = this.menuManagerEntities.listMenuEntities;
      this.managerNav3D = new ManagerNav3D(this.canvasRef, this.menuManagerEntities.listMenuEntities);
      this.managerNav3D.pageChanged.subscribe((url:string) => this.pageChanged(url));
      this.managerNav3D.moveStarted.subscribe(() => this.removeButtonListener());
      this.managerNav3D.moveEnded.subscribe(() => this.addButtonListener());
    }
  }

  private addButtonListener(){
    this.leftButton.nativeElement.style.pointerEvents = '';
    this.rightButton.nativeElement.style.pointerEvents = '';
  }

  private removeButtonListener(){
    this.leftButton.nativeElement.style.pointerEvents = 'none';
    this.rightButton.nativeElement.style.pointerEvents = 'none';
  }

  private moveLeftHandler(e:MouseEvent){
    this.removeButtonListener();
    this.managerNav3D.moveToNextRight();
  }

  private moveRightHandler(e:MouseEvent){
    this.removeButtonListener();
    this.managerNav3D.moveToNextLeft();
  }

  private pageChanged(url:string){
    this.routeService.routeStartChange.emit(url);
  }

}