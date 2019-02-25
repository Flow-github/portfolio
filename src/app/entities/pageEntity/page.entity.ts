import { Injectable } from '@angular/core';

@Injectable()

export class PageEntity{

    private titleText:string;
    private contentText:string;
    private technoText:string;
    private img:string;
    private link:string;
    private nameCompagny:string;
    private dateCompagny:string;
    private typeWork:string;
    private urlImg:string;

    public getTitleText():string{
        return this.titleText;
    }

    public getContentText():string{
        return this.contentText;
    }

    public getTechnoText():string{
        return this.technoText;
    }

    public getImg():string{
        return this.img;
    }

    public getLink():string{
        return this.link;
    }

    public getNameCompagny():string{
        return this.nameCompagny;
    }

    public getDateCompagny():string{
        return this.dateCompagny;
    }

    public getTypeWork():string{
        return this.typeWork;
    }

    public getUrlImg():string{
        return this.urlImg;
    }

    constructor(elementXML:Element){
        this.build(elementXML);
    }

    private build(elementXML:Element){
        this.titleText = elementXML.getElementsByTagName("titleText")[0].textContent;
        this.contentText = elementXML.getElementsByTagName("contentText")[0].textContent;
        this.technoText = elementXML.getElementsByTagName("technoText")[0].textContent;
        this.img = elementXML.getElementsByTagName("img")[0].textContent;
        this.link = elementXML.getElementsByTagName("link")[0].textContent;
        this.nameCompagny = elementXML.getElementsByTagName("nameCompagny")[0].textContent;
        this.dateCompagny = elementXML.getElementsByTagName("dateCompagny")[0].textContent;
        this.typeWork = elementXML.getElementsByTagName("typeWork")[0].textContent;
        this.urlImg = elementXML.getElementsByTagName("img")[0].textContent;
    }

}