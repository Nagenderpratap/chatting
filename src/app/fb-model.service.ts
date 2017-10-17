import { Injectable } from '@angular/core';

@Injectable()
export class FbModelService {
public model:{
              name:string;
              image:string;
              email:string;
              provider:string;
              token:string;
            }
  constructor() { }

}
