import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class PlaneNav extends THREE.Mesh{

    private index:number;

    constructor(geometry:THREE.PlaneGeometry, material:THREE.MeshBasicMaterial, index:number){
        super(geometry, material);
        this.index = index;
    }

    public getIndex():number{
        return this.index;
    }

}