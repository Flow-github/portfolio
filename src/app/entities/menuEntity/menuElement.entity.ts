import { Injectable } from '@angular/core';

@Injectable()

export class MenuElementEntity{

    private _title:string;
    private _url:string;
    private _img:string;
    private _category:string;

    public get title():string{
        return this._title;
    }

    public get url():string{
        return this._url;
    }

    public get img():string{
        return this._img;
    }

    public get category():string{
        return this._category;
    }

    constructor(elementXML:Element){
        this.build(elementXML);
    }

    private build(elementXML:Element){
        this._title = elementXML.getElementsByTagName("title")[0].textContent;
        this._url = elementXML.getElementsByTagName("url")[0].textContent;
        this._img = elementXML.getElementsByTagName("img")[0].textContent;
        this._category = elementXML.getElementsByTagName("category")[0].textContent;
    }

}