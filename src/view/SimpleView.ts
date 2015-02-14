///<reference path='View.ts'/>
///<reference path='../model/Model.ts'/>
module WOZLLA.PureMVC {

    export class SimpleView extends View {

        get modelKey():string { return this._modelKey; }
        set modelKey(key:string) { this._modelKey = key; }

        get model():ModelBase {
            return this._model;
        }

        _model:ModelBase;
        _modelKey:string;
        _binder:SimpleBinder;

        onDestroy():void {
            this.unbindModel();
            super.onDestroy();
        }

        bindModel(model:ModelBase) {
            if(this._model) {
                this.unbindModel();
            }
            if(!model) return;
            model.addListenerScope('fieldchanged', this.onModelFieldChange, this);
            this._model = model;
            this.onModelBind(model);
        }

        unbindModel() {
            var model;
            if(!this._model) return;
            model = this._model;
            model.removeListenerScope('fieldchanged', this.onModelFieldChange, this);
            this._model = null;
            this.onModelUnbind(model);
        }

        onModelFieldChange(e) {
            this._binder.onModelFieldChange(e);
        }

        onModelBind(model:ModelBase) {
            if(this._binder) {
                this._binder.onModelBind(model);
            }
        }

        onModelUnbind(model:ModelBase) {
            if(this._binder) {
                this._binder.onModelUnbind(model);
            }
        }

        setBinder(binder:SimpleBinder) {
            if(this._binder && this._model) {
                this._binder.onModelUnbind(this._model);
            }
            this._binder = binder;
            if(this._model && binder) {
                this._binder.onModelBind(this._model);
            }
        }

        getModelFieldValue(field:string) {
            if(this._binder) {
                return this._binder.getModelFieldValue(field);
            }
            return this._model.get(field);
        }

    }

    Component.register(SimpleView, {
        name: 'MVC.SimpleView',
        disableInEditor: true,
        properties: [{
            name: 'modelKey',
            type: 'string'
        }]
    });

}