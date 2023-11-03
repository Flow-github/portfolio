import { EventEmitter, ElementRef } from '@angular/core';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { MenuElementEntity } from '../entities/menuEntity/menuElement.entity';
import { angularMath } from 'angular-ts-math';
import { PlaneNav } from './plane.nav';

//declare var require:any;

export class ManagerNav3D{

    //private static TWEEN: any = require('@tweenjs/tween.js');
    private static MOVE_LEFT:string = 'left';
    private static MOVE_RIGHT:string = 'right';
    private static LEFT_ANGLE:number = 25;
    private static RIGHT_ANGLE:number = -25;
    private static Z_TARGET_DEFAULT_POSITION:number = -50;
    private static Z_TARGET_POSITION:number = 150;
    private static ESPACE_BETWEEN_TWO_PLANE:number = 300;
    private static DURATION_BASE_TWEEN:number = 700;

    public pageChanged:EventEmitter<any>;
    public moveStarted:EventEmitter<any>;
    public moveEnded:EventEmitter<any>;

    private canvasRef: ElementRef;
    private listMenuEntities:Array<MenuElementEntity>;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private listPlane:Array<PlaneNav>;
    private numTextureLoaded:number;
    private numTweenEnded:number;
    private currentPlanePosition:number;
    private targetPlanePosition:number;
    private durationTween:number;
    private time:any;
    private easingType:any;

    constructor(canvas:ElementRef, menuEntities:Array<MenuElementEntity>){
        this.canvasRef = canvas;
        this.listMenuEntities = menuEntities;
        this.listPlane = new Array<PlaneNav>();
        this.numTextureLoaded = 0;
        this.numTweenEnded = 0;
        this.currentPlanePosition = 1;
        this.pageChanged = new EventEmitter();
        this.moveStarted = new EventEmitter();
        this.moveEnded = new EventEmitter();

        this.initNav();
    }

    private initNav(){
        this.scene = new THREE.Scene();
    
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(0, 0, 1000)
    
        this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: false, canvas: this.canvasRef.nativeElement});
        //this.renderer = new THREE.WebGLRenderer();
        //document.getElementById("WebGLCanvas").appendChild(this.renderer.domElement);
        //console.log(this.renderer.domElement);
        this.renderer.setSize(this.canvasRef.nativeElement.clientWidth, this.canvasRef.nativeElement.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        //this.renderer.setClearColor(0xFFFFFF, 0);
    
        this.createPlane();
    
        this.scene.add(this.camera);

        this.canvasRef.nativeElement.addEventListener('click', (e:MouseEvent) => {this.clickHandler(e)}, true);
        this.canvasRef.nativeElement.addEventListener('mousemove', (e:MouseEvent) => {this.moveHandler(e)}, true);
    }

    private createPlane() {
        var posX:number = 0;
        var posZ:number = ManagerNav3D.Z_TARGET_POSITION;
        for(var i:number = 0; i < this.listMenuEntities.length; i++){
        //for(var i:number = this.listMenuEntities.length - 1; i >= 0; i--){
            let urlImg = this.listMenuEntities[i].img;
            let anglePlane:number = i > 0 ? ManagerNav3D.RIGHT_ANGLE : 0;
            let geometry = new THREE.PlaneGeometry(this.calculateRatioWidth(512), this.calculateRatioHeight(256));
            let texture = new THREE.TextureLoader().load(urlImg, (texture:any) => this.textureLoaded(texture), undefined, (err) => this.textureLoadedError(err));
            //let material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
            let material = new THREE.MeshBasicMaterial({map: texture, transparent: true});
            //let planeMaterial = new THREE.MeshBasicMaterial({color:0xFF0000, side: THREE.DoubleSide});
    
            //this.listPlane.push(new THREE.Mesh(geometry, material));
            this.listPlane.push(new PlaneNav(geometry, material, i));
            this.listPlane[i].position.set(posX, 0, posZ);
            posX += i > 0 ? this.calculateRatioWidth(ManagerNav3D.ESPACE_BETWEEN_TWO_PLANE / 2) : this.calculateRatioWidth(ManagerNav3D.ESPACE_BETWEEN_TWO_PLANE);
            posZ = ManagerNav3D.Z_TARGET_DEFAULT_POSITION;
            this.listPlane[i].rotateY(this.getAngleToRadian(anglePlane));
            this.scene.add(this.listPlane[i]);
        }

        this.renderPlaneOrder();
    }
    
    private textureLoaded(texture:THREE.TextureLoader){
        this.numTextureLoaded++;
        if(this.numTextureLoaded == this.listMenuEntities.length){
            this.time = setInterval(() => this.renderScene(), 20);
        }
    }
    
    private textureLoadedError(err){
        console.error('An error happened.');
        console.error(err.type);
        this.renderScene();
    }

    private renderPlaneOrder(){
        for(var i:number = 0; i < this.listPlane.length; i++){
            if(i < this.currentPlanePosition - 1){
                this.listPlane[i].renderOrder = i;
            }else if(i > this.currentPlanePosition - 1){
                this.listPlane[i].renderOrder = this.listPlane.length - i;
            }else{
                this.listPlane[i].renderOrder = this.listPlane.length;
            }
        }
    }

    private moveAllPlane(direction:string){
        this.canvasRef.nativeElement.style.pointerEvents = 'none';
        this.numTweenEnded = 0;
        for(var i:number = 0; i < this.listPlane.length; i++){
            if(direction == ManagerNav3D.MOVE_LEFT){
                this.movePlaneOnLeft(this.listPlane[i], i + 1);
            }else if(direction == ManagerNav3D.MOVE_RIGHT){
                this.movePlaneOnRight(this.listPlane[i], i + 1);
            }
        }
    }

    private movePlaneOnLeft(target:PlaneNav, targetPosition:number){
        var newXPosition:number = target.position.x;
        var newZPosition:number = target.position.z;
        var newYRotation:number = 0;
        if(targetPosition == this.currentPlanePosition - 1){
            newXPosition -= this.calculateRatioWidth(ManagerNav3D.ESPACE_BETWEEN_TWO_PLANE);
            newZPosition = ManagerNav3D.Z_TARGET_DEFAULT_POSITION;
            newYRotation = ManagerNav3D.LEFT_ANGLE;
        }else if(targetPosition == this.currentPlanePosition){
            newXPosition = 0;
            newZPosition = ManagerNav3D.Z_TARGET_POSITION;
            newYRotation = 0;
        }else if(targetPosition == this.currentPlanePosition + 1){
            newXPosition = this.calculateRatioWidth(ManagerNav3D.ESPACE_BETWEEN_TWO_PLANE);
            newZPosition = ManagerNav3D.Z_TARGET_DEFAULT_POSITION;
            newYRotation = ManagerNav3D.RIGHT_ANGLE;
        }else{
            newXPosition -= this.calculateRatioWidth(ManagerNav3D.ESPACE_BETWEEN_TWO_PLANE / 2);
            newZPosition = ManagerNav3D.Z_TARGET_DEFAULT_POSITION;
            newYRotation = this.getRadianToAngle(target.rotation.y);
        }
        
        this.createTween(target, newXPosition, newZPosition, newYRotation);
    }

    private movePlaneOnRight(target:PlaneNav, targetPosition:number){
        var newXPosition:number = target.position.x;
        var newZPosition:number = target.position.z;
        var newYRotation:number = 0;
        if(targetPosition == this.currentPlanePosition - 1){
            newXPosition = -this.calculateRatioWidth(ManagerNav3D.ESPACE_BETWEEN_TWO_PLANE);
            newZPosition = ManagerNav3D.Z_TARGET_DEFAULT_POSITION;
            newYRotation = ManagerNav3D.LEFT_ANGLE;
        }else if(targetPosition == this.currentPlanePosition){
            newXPosition = 0;
            newZPosition = ManagerNav3D.Z_TARGET_POSITION;
            newYRotation = 0;
        }else if(targetPosition == this.currentPlanePosition + 1){
            newXPosition += this.calculateRatioWidth(ManagerNav3D.ESPACE_BETWEEN_TWO_PLANE);
            newZPosition = ManagerNav3D.Z_TARGET_DEFAULT_POSITION;
            newYRotation = ManagerNav3D.RIGHT_ANGLE;
        }else{
            newXPosition += this.calculateRatioWidth(ManagerNav3D.ESPACE_BETWEEN_TWO_PLANE / 2);
            newZPosition = ManagerNav3D.Z_TARGET_DEFAULT_POSITION;
            newYRotation = this.getRadianToAngle(target.rotation.y);
        }
        
        this.createTween(target, newXPosition, newZPosition, newYRotation);
    }

    private createTween(target:PlaneNav, newXPosition:number, newZPosition:number, newYRotation:number){
        var planeInitialObject:object = {x:target.position.x, z:target.position.z, rotateY:target.rotation.y};
        var planeTargetObject:object = {x:newXPosition, z:newZPosition, rotateY:this.getAngleToRadian(newYRotation)};
        var tween:TWEEN.Tween = new TWEEN.Tween(planeInitialObject);
        tween.to(planeTargetObject, this.durationTween);
        tween.onUpdate((objectUpdateByTwee:object) => this.updatePlaneByTween(objectUpdateByTwee, planeTargetObject, target));
        tween.onComplete(() => this.onEndedPlaneTween());
        tween.onStop(function() { console.log('stop'); });
        tween.easing(this.easingType);
        tween.start();
    }

    private updatePlaneByTween(objectUpdateByTwee:any, planeTargetObject:any, target:PlaneNav){
        target.position.set(objectUpdateByTwee.x, 0, objectUpdateByTwee.z);
        var moveAngle:number = target.rotation.y > 0 ? objectUpdateByTwee.rotateY - target.rotation.y : angularMath.absoluteOfNumber(target.rotation.y) + objectUpdateByTwee.rotateY;
        target.rotateY(moveAngle);
        if(this.listPlane[this.currentPlanePosition - 1].position.z > (ManagerNav3D.Z_TARGET_POSITION / 2)){
            this.renderPlaneOrder();
        }
    }

    private onEndedPlaneTween(){
        this.numTweenEnded++;
        if(this.numTweenEnded == this.listPlane.length){
            if(this.currentPlanePosition > this.targetPlanePosition){
                this.currentPlanePosition--;
                this.moveAllPlane(ManagerNav3D.MOVE_RIGHT);
            }else if(this.currentPlanePosition < this.targetPlanePosition){
                this.currentPlanePosition++;
                this.moveAllPlane(ManagerNav3D.MOVE_LEFT);
            }else{
                this.canvasRef.nativeElement.style.pointerEvents = '';
                this.moveEnded.emit();
                this.pageChanged.emit(this.listMenuEntities[this.currentPlanePosition - 1].url);
            }
        }
    }

    private clickHandler(e:MouseEvent){
        var intersects:Array<any> = this.testIntersect(e);
        if(intersects.length > 0){
            var planeNav:PlaneNav = intersects[0].object;
            if(planeNav.getIndex() + 1 == this.currentPlanePosition){
                this.pageChanged.emit(this.listMenuEntities[planeNav.getIndex()].url);
            }else{
                this.moveStarted.emit();
                this.targetPlanePosition = planeNav.getIndex() + 1;
                var diffCurrentTarget:number = angularMath.absoluteOfNumber(this.targetPlanePosition - this.currentPlanePosition);
                var moveDirection:string = this.currentPlanePosition > this.targetPlanePosition ? ManagerNav3D.MOVE_RIGHT : ManagerNav3D.MOVE_LEFT;
                this.durationTween = ManagerNav3D.DURATION_BASE_TWEEN / diffCurrentTarget;
                this.currentPlanePosition = moveDirection == ManagerNav3D.MOVE_RIGHT ? this.currentPlanePosition - 1 : this.currentPlanePosition + 1;
                this.easingType = diffCurrentTarget > 1 ? TWEEN.Easing.Linear.None : TWEEN.Easing.Cubic.InOut;
                this.moveAllPlane(moveDirection);
            }
        }
    }

    private moveHandler(e:MouseEvent){
        var intersects:Array<any> = this.testIntersect(e);
        if(intersects.length > 0){
            this.canvasRef.nativeElement.style.cursor = "pointer";
        }else{
            this.canvasRef.nativeElement.style.cursor = "default";
        }
    }

    private testIntersect(e:MouseEvent):Array<any>{
        var posXMouseOnScene:number = ( e.layerX / this.canvasRef.nativeElement.clientWidth ) * 2 - 1;
        var posYMouseOnScene:number = - ( e.layerY / this.canvasRef.nativeElement.clientHeight ) * 2 + 1;
        var vecPosMouse:THREE.Vector2 = new THREE.Vector2(posXMouseOnScene, posYMouseOnScene);
        var raycaster:THREE.Raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(vecPosMouse, this.camera);
        var intersects:Array<any> = raycaster.intersectObjects(this.listPlane);

        return intersects;
    }

    private renderScene(){
        TWEEN.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    private calculateRatioWidth(width:number):number{
        return width / this.renderer.getSize().width * window.innerWidth;
    }
    
    private calculateRatioHeight(height:number):number{
        return height / this.renderer.getSize().height * window.innerHeight;
    }

    private getAngleToRadian(degreAngle:number):number{
        return degreAngle * angularMath.getPi() / 180;
    }

    private getRadianToAngle(radianAngle:number):number{
        return radianAngle * 180 / angularMath.getPi();
    }

    public moveToNextLeft(){
        if(this.currentPlanePosition < this.listPlane.length){
            this.currentPlanePosition++;
            this.targetPlanePosition = this.currentPlanePosition;
            this.durationTween = ManagerNav3D.DURATION_BASE_TWEEN;
            this.easingType = TWEEN.Easing.Cubic.InOut;
            this.moveAllPlane(ManagerNav3D.MOVE_LEFT);
        }else{
            this.moveEnded.emit();
        }
    }

    public moveToNextRight(){
        if(this.currentPlanePosition > 1){
            this.currentPlanePosition--;
            this.targetPlanePosition = this.currentPlanePosition;
            this.durationTween = ManagerNav3D.DURATION_BASE_TWEEN;
            this.easingType = TWEEN.Easing.Cubic.InOut;
            this.moveAllPlane(ManagerNav3D.MOVE_RIGHT);
        }else{
            this.moveEnded.emit();
        }
    }

}