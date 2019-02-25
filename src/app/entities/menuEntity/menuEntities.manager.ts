import { Injectable } from '@angular/core';
import { MenuElementEntity } from './menuElement.entity';

@Injectable()

export class MenuEntitiesManager{

    private _menuEntities:Array<MenuElementEntity>;

    public get listMenuEntities():Array<MenuElementEntity>{
        return this._menuEntities;
    }

    constructor(sourceXML:string){
        this.build(sourceXML);
    }

    private build(sourceXML:string){
        if(sourceXML != ''){
            this._menuEntities = new Array<MenuElementEntity>();
            var xml:Document = (new DOMParser()).parseFromString(sourceXML, "text/xml");
            //var xmlMenu:NodeListOf<HTMLMenuElement> = xml.getElementsByTagName("menu");
            var xmlMenu:HTMLCollectionOf<HTMLMenuElement> = xml.getElementsByTagName("menu");
            for(var i:number = 0; i < xmlMenu[0].childElementCount; i++){
                this._menuEntities.push(new MenuElementEntity(xmlMenu[0].children[i]));
            }
        }
    }

}