///<reference path='../model/ModelBase.ts'/>
module WOZLLA.PureMVC {

    export class ModelWrapper extends ModelBase {

        _modelMap:any;

        constructor(modelMap) {
            super();
            this._modelMap = modelMap || {};
        }

        get(field:string):any {
            var fieldSplit = field.split('.');
            var model = this._modelMap[fieldSplit[0]];
            return model.get(fieldSplit[1]);
        }

        set(field:string, value:any, silent:boolean=false) {
            var fieldSplit = field.split('.');
            var model = this._modelMap[fieldSplit[0]];
            model.set(fieldSplit[1], value, silent);
        }

    }
}