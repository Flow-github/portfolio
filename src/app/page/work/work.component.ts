import { Component, OnInit, OnDestroy, ElementRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { RouteService } from '../../service/route.service';
import { AbstractPage } from '../abstract.page.component';

@Component({
    selector: '',
    templateUrl: './work.component.html',
    styleUrls: ['./work.component.scss'],
    //encapsulation: ViewEncapsulation.None,
})

export class WorkComponent extends AbstractPage implements OnInit, OnDestroy {

    @ViewChild('buttonSee') seeButton: ElementRef;

    public nameCompagny:string;
    public typeWork:string;
    public dateCompagny:string;
    public titleText:string;
    public contentText:string;
    public technoText:string;
    public urlImg:string;

    constructor(routeService:RouteService, elRef:ElementRef){
        super(routeService, elRef);
    }

    ngOnInit() {
        super.ngOnInit();

        this.seeButton.nativeElement.addEventListener('click', (e:MouseEvent) => this.seeButtonClicked(e));
    }

    ngOnDestroy(){
        super.ngOnDestroy();

        this.seeButton.nativeElement.removeEventListener('click', this.seeButtonClicked);
    }

    protected changeContent(){
        this.nameCompagny = this.currentData.getNameCompagny();
        this.typeWork = this.currentData.getTypeWork();
        this.dateCompagny = this.currentData.getDateCompagny();
        this.titleText = this.currentData.getTitleText();
        this.contentText = this.currentData.getContentText();
        this.technoText = this.currentData.getTechnoText();
        this.urlImg = this.currentData.getUrlImg();
    }

    private seeButtonClicked(e:MouseEvent){
        console.log('seeButtonClicked');
        var link:string = this.currentData.getLink();
        if(link != ''){
            window.open(link, '_blank');
        }
    }

}