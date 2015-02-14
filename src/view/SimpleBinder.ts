///<reference path='SimpleView.ts'/>
module WOZLLA.PureMVC {

    var Assert = WOZLLA.Assert;

    export class SimpleBinder {

        _view:SimpleView;
        _config:any;
        _queryCache:any = {};
        _helpRecord:WOZLLA.QueryRecord = new WOZLLA.QueryRecord();

        constructor(simpleView:SimpleView, config:any) {
            this._view = simpleView;
            this._config = config;
            for(var attrName in config) {
                var attrConfig = config[attrName];
                if(typeof attrConfig === 'string') {
                    config[attrName] = {
                        bind: attrConfig,
                        cache: true
                    };
                }
            }
        }

        getModelFieldValue(field:string) {
            var model = this._view.model;
            var attrConfig = this._config[field];

            // get model value
            var getter = attrConfig && attrConfig.model && attrConfig.model.getter;
            var value;
            if(model) {
                if(getter) {
                    value = getter(model, field);
                } else {
                    value = model.get(field);
                }
            }

            return value;
        }

        syncAttr(name) {
            var target;
            var targetAttrName;
            var attrConfig = this._config[name];
            if(!attrConfig) {
                return;
            }

            var value = this.getModelFieldValue(name);

            // query bind target
            var cacheData;
            var cache = attrConfig.cache !== false;
            var bind = attrConfig.bind;
            if(cache) {
                cacheData = this._queryCache[bind];
                target = cacheData && cacheData.target;
                targetAttrName = cacheData && cacheData.attrName;
            }
            if(!target) {
                var gameObj = this._view.gameObject;
                var queryRecord = this._helpRecord;
                queryRecord.target = null;
                gameObj.query(bind, queryRecord);
                Assert.isNotUndefined(queryRecord.target, 'Can\'t found "' + bind + '" for binding.');
                target = queryRecord.target;
                targetAttrName = queryRecord.attrName;
                if (cache) {
                    this._queryCache[bind] = {
                        target: target,
                        attrName: targetAttrName
                    };
                }
            }
            // apply model value to view
            var viewSetter = attrConfig.view && attrConfig.view.setter;
            if(viewSetter) {
                viewSetter(target, targetAttrName, value);
            } else {
                target[targetAttrName] = value;
            }
            target.loadAssets();

            var sync:any = attrConfig.sync;
            if(sync) {
                if (typeof sync === 'string') {
                    this.syncAttr(sync);
                } else {
                    sync.forEach((attr) => {
                        this.syncAttr(attr)
                    });
                }
            }

        }

        onModelFieldChange(e) {
            this.syncAttr(e.data.field);
        }

        onModelBind(model:ModelBase) {
            this.syncAll();
        }

        onModelUnbind(model:ModelBase) {
            this.syncAll();
        }

        syncAll() {
            var config = this._config;
            for(var attrName in config) {
                this.syncAttr(attrName);
            }
        }
    }

}