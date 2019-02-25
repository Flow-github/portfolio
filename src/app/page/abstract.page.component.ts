import { OnDestroy, ElementRef, OnInit } from '@angular/core';
import { PageEntity } from '../entities/pageEntity/page.entity';
import { Subscription } from 'rxjs';
import { RouteService } from '../service/route.service';
import * as TWEEN from '@tweenjs/tween.js';

export class AbstractPage implements OnInit, OnDestroy{

    protected currentData:PageEntity;
    protected isInit:boolean;
    protected isToOpen:boolean;
    protected targetHtml:any;
    protected currentUrl:string;

    private subRouteStartChange:Subscription;
    private subRouteChange:Subscription;
    private time:any;

    constructor(private routeService:RouteService, private elRef:ElementRef){
        this.subRouteStartChange = this.routeService.routeStartChange.subscribe((url:string) => this.closePage(url));
        this.subRouteChange = this.routeService.routeChanged.subscribe((param:any) => this.openPage(param.data, param.url));
    }

    ngOnInit() {
        this.targetHtml = this.elRef.nativeElement.children[0];
        this.targetHtml.style.opacity = 0;
        this.isInit = true;
        if(this.isToOpen){
            this.startChangePage(true);
        }
    }

    ngOnDestroy(){
        this.subRouteStartChange.unsubscribe();
        this.subRouteChange.unsubscribe();
        clearInterval(this.time);
    }

    protected openPage(data:PageEntity, url:string){
        this.currentData = data;
        this.currentUrl = url;

        if(this.isInit){
            this.startChangePage(true);
        }else{
            this.isToOpen = true;
        }
    }

    protected closePage(url:string){
        if(url[0] != '/'){
            url = '/' + url;
        }
        
        if(url != this.currentUrl){
            this.startChangePage(false);
        }
    }

    protected startChangePage(isAppear:boolean){
        this.time = setInterval(() => this.renderTween(), 20);
        if(isAppear){
            this.appear();
        }else{
            this.disappear();
        }
    }

    protected appear(){
        this.changeContent();
        this.createTween(0, 0, 1);
    }

    protected disappear(){
        this.createTween(0, 0, 0);
    }

    protected createTween(newXPosition:number, newYPosition:number, newAlpha:number){
        var pageInitialObject:object = {alpha:this.targetHtml.style.opacity};
        var tween:TWEEN.Tween = new TWEEN.Tween(pageInitialObject);
        tween.to({alpha:newAlpha}, 400);
        tween.onUpdate((objectUpdateByTwee:object) => this.updatePageByTween(objectUpdateByTwee));
        tween.onComplete(() => this.onEndedPageTween());
        tween.onStop(function() { console.log('stop'); });
        tween.easing(TWEEN.Easing.Exponential.In);
        tween.start();
    }

    protected updatePageByTween(objectUpdateByTwee:any){
        this.targetHtml.style.opacity = objectUpdateByTwee.alpha;
    }

    protected onEndedPageTween(){
        clearInterval(this.time);
        
        if(this.targetHtml.style.opacity == 0){
            this.routeService.pageClose.emit();
        }
    }

    protected changeContent(){
        
    }

    private renderTween(){
        TWEEN.update();
    }

}