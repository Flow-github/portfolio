import { Injectable } from '@angular/core';
import { PageEntity } from './page.entity';

@Injectable()

export class PageEntitiesManager{

    private _pageEntities:Array<PageEntity>;

    public getPageEntities():Array<PageEntity>{
        return this._pageEntities;
    }

    constructor(sourceXML:string){
        this.build(sourceXML);
    }

    private build(sourceXML:string){
        if(sourceXML != ''){
            this._pageEntities = new Array<PageEntity>();
            var xml:Document = (new DOMParser()).parseFromString(sourceXML, "text/xml");
            var xmlPage:HTMLCollectionOf<Element> = xml.getElementsByTagName("page");
            for(var i:number = 0; i < xmlPage[0].childElementCount; i++){
                this._pageEntities.push(new PageEntity(xmlPage[0].children[i]));
            }
        }
    }

}