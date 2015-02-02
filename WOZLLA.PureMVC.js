var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path='../puremvc-typescript-multicore-1.1.d.ts'/>
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var ApplicationFacade = (function (_super) {
            __extends(ApplicationFacade, _super);
            function ApplicationFacade() {
                _super.apply(this, arguments);
            }
            ApplicationFacade.getInstance = function (key) {
                if (ApplicationFacade.instanceMap[key] == null) {
                    ApplicationFacade.instanceMap[key] = new ApplicationFacade(key);
                }
                return ApplicationFacade.instanceMap[key];
            };
            ApplicationFacade.prototype.sendNotification = function (name, body, type) {
                // TODO
                _super.prototype.sendNotification.call(this, name, body, type);
            };
            return ApplicationFacade;
        })(puremvc.Facade);
        PureMVC.ApplicationFacade = ApplicationFacade;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='../puremvc-typescript-multicore-1.1.d.ts'/>
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var AsyncCommand = (function (_super) {
            __extends(AsyncCommand, _super);
            function AsyncCommand() {
                _super.apply(this, arguments);
            }
            AsyncCommand.prototype.execute = function (notification, onComplete) {
                onComplete && onComplete();
            };
            return AsyncCommand;
        })(puremvc.SimpleCommand);
        PureMVC.AsyncCommand = AsyncCommand;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='../puremvc-typescript-multicore-1.1.d.ts'/>
///<reference path='AsyncCommand.ts'/>
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var AsyncMacroCommand = (function (_super) {
            __extends(AsyncMacroCommand, _super);
            function AsyncMacroCommand() {
                _super.apply(this, arguments);
            }
            AsyncMacroCommand.prototype.execute = function (notification) {
                var me = this;
                var subCommands = this.subCommands.slice(0);
                var idx = 0;
                function asyncExec() {
                    var CommandClass = subCommands[idx++];
                    if (!CommandClass) {
                        return;
                    }
                    me.executeSubCommand(CommandClass, notification, asyncExec);
                }
                asyncExec();
            };
            AsyncMacroCommand.prototype.executeSubCommand = function (CommandClass, notification, onComplete) {
                var commandInstance = new CommandClass();
                commandInstance.initializeNotifier(this.multitonKey);
                if (commandInstance instanceof PureMVC.AsyncCommand) {
                    commandInstance.execute(notification, onComplete);
                }
                else {
                    commandInstance.execute(notification);
                    onComplete();
                }
            };
            return AsyncMacroCommand;
        })(puremvc.MacroCommand);
        PureMVC.AsyncMacroCommand = AsyncMacroCommand;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var Mediator = (function (_super) {
            __extends(Mediator, _super);
            function Mediator() {
                _super.apply(this, arguments);
            }
            Mediator.prototype.getStage = function () {
                return WOZLLA.Director.getInstance().stage;
            };
            Mediator.prototype.getView = function () {
                return this.getViewComponent();
            };
            Mediator.prototype.show = function (callback) {
                var view = this.getView();
                this.getStage().addChild(view.gameObject);
                callback && callback();
            };
            Mediator.prototype.hide = function (callback) {
                var view = this.getView();
                view.gameObject.removeMe();
                callback && callback();
            };
            Mediator.prototype.close = function (callback) {
                var view = this.getView();
                view.gameObject.destroy();
                view.gameObject.removeMe();
                callback && callback();
            };
            return Mediator;
        })(puremvc.Mediator);
        PureMVC.Mediator = Mediator;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='../../puremvc-typescript-multicore-1.1.d.ts'/>
///<reference path='../../typings/tsd.d.ts' />
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var modelIdGen = 0;
        function generateModelId() {
            return ++modelIdGen + '';
        }
        var Model = (function (_super) {
            __extends(Model, _super);
            function Model() {
                _super.call(this);
                this.data = {
                    _modelId: generateModelId()
                };
                this.definedField = {};
                this.initFields();
            }
            Model.prototype.initFields = function () {
                this.defineField('_modelId');
            };
            Model.prototype.defineField = function (field) {
                this.definedField[field] = true;
            };
            Model.prototype.defineFields = function (array) {
                var _this = this;
                array.forEach(function (field) {
                    _this.defineField(field);
                });
            };
            Model.prototype.get = function (field) {
                WOZLLA.Assert.isTrue(this.definedField[field], 'Field not defined: ' + field);
                return this.data[field];
            };
            Model.prototype.set = function (field, value, silent) {
                if (silent === void 0) { silent = false; }
                var oldValue;
                WOZLLA.Assert.isTrue(this.definedField[field], 'Field not defined: ' + field);
                oldValue = this.data[field];
                this.data[field] = value;
                if (!silent) {
                    this.dispatchEvent(new WOZLLA.event.Event('fieldchanged', true, new FieldChangeEventData(field, value, oldValue)));
                }
            };
            Model.prototype.setAll = function (data, silent) {
                if (silent === void 0) { silent = false; }
                for (var field in this.definedField) {
                    if (data.hasOwnProperty(field)) {
                        this.set(field, data[field], silent);
                    }
                }
            };
            return Model;
        })(WOZLLA.event.EventDispatcher);
        PureMVC.Model = Model;
        var FieldChangeEventData = (function () {
            function FieldChangeEventData(field, value, oldValue) {
                this._field = field;
                this._value = value;
                this._oldValue = oldValue;
            }
            Object.defineProperty(FieldChangeEventData.prototype, "field", {
                get: function () {
                    return this._field;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FieldChangeEventData.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(FieldChangeEventData.prototype, "oldValue", {
                get: function () {
                    return this._oldValue;
                },
                enumerable: true,
                configurable: true
            });
            return FieldChangeEventData;
        })();
        PureMVC.FieldChangeEventData = FieldChangeEventData;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='../../puremvc-typescript-multicore-1.1.d.ts'/>
///<reference path='../../typings/tsd.d.ts' />
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var Store = (function (_super) {
            __extends(Store, _super);
            function Store() {
                _super.apply(this, arguments);
            }
            return Store;
        })(WOZLLA.event.EventDispatcher);
        PureMVC.Store = Store;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='../../puremvc-typescript-multicore-1.1.d.ts'/>
///<reference path='Model.ts'/>
///<reference path='Store.ts'/>
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var ArrayStore = (function (_super) {
            __extends(ArrayStore, _super);
            function ArrayStore() {
                _super.apply(this, arguments);
                this.list = [];
            }
            Object.defineProperty(ArrayStore.prototype, "count", {
                get: function () {
                    return this.list.length;
                },
                enumerable: true,
                configurable: true
            });
            ArrayStore.prototype.add = function (model, silent) {
                if (silent === void 0) { silent = false; }
                this.addAt(model, this.list.length, silent);
            };
            ArrayStore.prototype.addAt = function (model, index, silent) {
                if (silent === void 0) { silent = false; }
                this.list.splice(index, 0, model);
                if (!silent) {
                    this.dispatchEvent(new WOZLLA.event.Event('add', true, new ArrayStoreEventData(model, index)));
                }
            };
            ArrayStore.prototype.remove = function (model, silent) {
                if (silent === void 0) { silent = false; }
                var index = this.indexOf(model);
                if (index !== -1) {
                    this.removeAt(index, silent);
                }
            };
            ArrayStore.prototype.removeAt = function (index, silent) {
                if (silent === void 0) { silent = false; }
                var model = this.list[index];
                this.list.splice(index, 1);
                if (!silent) {
                    this.dispatchEvent(new WOZLLA.event.Event('remove', true, new ArrayStoreEventData(model, index)));
                }
            };
            ArrayStore.prototype.clear = function (silent) {
                if (silent === void 0) { silent = false; }
                this.list.length = 0;
                if (!silent) {
                    this.dispatchEvent(new WOZLLA.event.Event('clear', true));
                }
            };
            ArrayStore.prototype.getAt = function (index) {
                return this.list[index];
            };
            ArrayStore.prototype.getRange = function (start, count) {
                return this.list.slice(start, start + count);
            };
            ArrayStore.prototype.indexOf = function (model) {
                return this.list.indexOf(model);
            };
            ArrayStore.prototype.sync = function () {
                this.dispatchEvent(new WOZLLA.event.Event('sync', true));
            };
            ArrayStore.prototype.each = function (func) {
                var list = this.list.slice(0);
                list.forEach(func);
            };
            ArrayStore.prototype.query = function (func) {
                var result = [];
                this.each(function (model, index) {
                    if (func(model, index)) {
                        result.push(model);
                    }
                });
                return result;
            };
            ArrayStore.prototype.sort = function (func, silent) {
                if (silent === void 0) { silent = false; }
                this.list.sort(func);
                if (!silent) {
                    this.dispatchEvent(new WOZLLA.event.Event('sort', true));
                }
            };
            return ArrayStore;
        })(PureMVC.Store);
        PureMVC.ArrayStore = ArrayStore;
        var ArrayStoreEventData = (function () {
            function ArrayStoreEventData(model, index) {
                this.model = model;
                this.index = index;
            }
            return ArrayStoreEventData;
        })();
        PureMVC.ArrayStoreEventData = ArrayStoreEventData;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='../puremvc-typescript-multicore-1.1.d.ts'/>
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var Proxy = (function (_super) {
            __extends(Proxy, _super);
            function Proxy() {
                _super.apply(this, arguments);
            }
            return Proxy;
        })(puremvc.Proxy);
        PureMVC.Proxy = Proxy;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='../puremvc-typescript-multicore-1.1.d.ts'/>
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var Service = (function (_super) {
            __extends(Service, _super);
            function Service() {
                _super.apply(this, arguments);
            }
            return Service;
        })(puremvc.Proxy);
        PureMVC.Service = Service;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='../../typings/tsd.d.ts' />
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var View = (function (_super) {
            __extends(View, _super);
            function View() {
                _super.apply(this, arguments);
            }
            View.prototype.init = function () {
                this.onInit();
                _super.prototype.init.call(this);
            };
            View.prototype.destroy = function () {
                this.onDestroy();
                _super.prototype.destroy.call(this);
            };
            View.prototype.onCreate = function () {
            };
            View.prototype.onInit = function () {
            };
            View.prototype.onDestroy = function () {
            };
            return View;
        })(WOZLLA.Component);
        PureMVC.View = View;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var AdapterFactory = (function () {
            function AdapterFactory() {
            }
            AdapterFactory.create = function (name) {
                var AdapterClass = AdapterFactory.adapterCtorMap[name];
                WOZLLA.Assert.isNotUndefined(AdapterClass, 'unknow adapter: ' + name);
                return new AdapterClass();
            };
            AdapterFactory.register = function (name, AdapterClass) {
                WOZLLA.Assert.isUndefined(AdapterFactory.adapterCtorMap[name], 'adapter name="' + name + '" has been registered');
                AdapterFactory.adapterCtorMap[name] = AdapterClass;
            };
            AdapterFactory.adapterCtorMap = {};
            return AdapterFactory;
        })();
        PureMVC.AdapterFactory = AdapterFactory;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='View.ts'/>
///<reference path='AdapterFactory.ts'/>
///<reference path='../model/Store.ts'/>
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var AdapterView = (function (_super) {
            __extends(AdapterView, _super);
            function AdapterView() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(AdapterView.prototype, "adapter", {
                get: function () {
                    return this._adapter;
                },
                set: function (value) {
                    this.setAdapter(value);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdapterView.prototype, "storeKey", {
                get: function () {
                    return this._storeKey;
                },
                set: function (key) {
                    this._storeKey = key;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(AdapterView.prototype, "store", {
                get: function () {
                    return this._store;
                },
                enumerable: true,
                configurable: true
            });
            AdapterView.prototype.onDestroy = function () {
                this.unbindStore();
                _super.prototype.onDestroy.call(this);
            };
            AdapterView.prototype.bindStore = function (store, callback) {
                this._store = store;
                this.onStoreBind(store, callback);
            };
            AdapterView.prototype.unbindStore = function () {
                var store;
                if (!this._store)
                    return;
                store = this._store;
                this._store = null;
                this.onStoreUnbind(store);
            };
            AdapterView.prototype.onStoreBind = function (store, callback) {
                if (this._adapter) {
                    this._adapter.onStoreBind(store, callback);
                }
                else {
                    callback && callback();
                }
            };
            AdapterView.prototype.onStoreUnbind = function (store) {
                if (this._adapter) {
                    this._adapter.onStoreUnbind(store);
                }
            };
            AdapterView.prototype.setAdapter = function (adapter, callback) {
                if (this._adapter && this._store) {
                    this._adapter.onStoreUnbind(this._store);
                }
                this._adapter = adapter;
                this._adapter.setAdapterView(this);
                if (this._store) {
                    this._adapter.onStoreBind(this._store, callback);
                }
                else {
                    callback && callback();
                }
            };
            return AdapterView;
        })(PureMVC.View);
        PureMVC.AdapterView = AdapterView;
        WOZLLA.Component.register(AdapterView, {
            name: 'MVC.AdapterView',
            properties: [{
                name: 'storeKey',
                type: 'string'
            }, {
                name: 'adapter',
                type: 'MVC.Adapter',
                convert: function (name) {
                    if (!name) {
                        return null;
                    }
                    return PureMVC.AdapterFactory.create(name);
                }
            }]
        });
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='AdapterView.ts'/>
///<reference path='../model/Model.ts'/>
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var Adapter = (function () {
            function Adapter() {
            }
            Adapter.prototype.setAdapterView = function (view) {
                this._adapterView = view;
            };
            Adapter.prototype.getCount = function () {
                return 0;
            };
            Adapter.prototype.getItem = function (index) {
                return null;
            };
            Adapter.prototype.getView = function (index, callback) {
            };
            Adapter.prototype.onStoreBind = function (store, callback) {
                console.log('onbind', store, callback);
                callback && callback();
            };
            Adapter.prototype.onStoreUnbind = function (store) {
            };
            return Adapter;
        })();
        PureMVC.Adapter = Adapter;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='View.ts'/>
///<reference path='../model/Model.ts'/>
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var SimpleView = (function (_super) {
            __extends(SimpleView, _super);
            function SimpleView() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(SimpleView.prototype, "modelKey", {
                get: function () {
                    return this._modelKey;
                },
                set: function (key) {
                    this._modelKey = key;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SimpleView.prototype, "model", {
                get: function () {
                    return this._model;
                },
                enumerable: true,
                configurable: true
            });
            SimpleView.prototype.onDestroy = function () {
                this.unbindModel();
                _super.prototype.onDestroy.call(this);
            };
            SimpleView.prototype.bindModel = function (model) {
                if (this._model) {
                    this.unbindModel();
                }
                model.addListenerScope('fieldchanged', this.onModelFieldChange, this);
                this._model = model;
                this.onModelBind(model);
            };
            SimpleView.prototype.unbindModel = function () {
                var model;
                if (!this._model)
                    return;
                model = this._model;
                model.removeListenerScope('fieldchanged', this.onModelFieldChange, this);
                this._model = null;
                this.onModelUnbind(model);
            };
            SimpleView.prototype.onModelFieldChange = function (e) {
                this._binder.onModelFieldChange(e);
            };
            SimpleView.prototype.onModelBind = function (model) {
                if (this._binder) {
                    this._binder.onModelBind(model);
                }
            };
            SimpleView.prototype.onModelUnbind = function (model) {
                if (this._binder) {
                    this._binder.onModelUnbind(model);
                }
            };
            SimpleView.prototype.setBinder = function (binder) {
                if (this._binder && this._model) {
                    this._binder.onModelUnbind(this._model);
                }
                this._binder = binder;
                if (this._model && binder) {
                    this._binder.onModelBind(this._model);
                }
            };
            return SimpleView;
        })(PureMVC.View);
        PureMVC.SimpleView = SimpleView;
        WOZLLA.Component.register(SimpleView, {
            name: 'MVC.SimpleView',
            properties: [{
                name: 'modelKey',
                type: 'string'
            }]
        });
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='Adapter.ts'/>
///<reference path='AdapterFactory.ts'/>
///<reference path='../view/SimpleView.ts'/>
///<reference path='../model/ArrayStore.ts'/>
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var Assert = WOZLLA.Assert;
        var ListAdapter = (function (_super) {
            __extends(ListAdapter, _super);
            function ListAdapter() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(ListAdapter.prototype, "arrayStore", {
                get: function () {
                    return this._adapterView.store;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListAdapter.prototype, "listView", {
                get: function () {
                    return this._adapterView;
                },
                enumerable: true,
                configurable: true
            });
            ListAdapter.prototype.getCount = function () {
                var arrayStore = this.arrayStore;
                return arrayStore ? arrayStore.count : 0;
            };
            ListAdapter.prototype.getItem = function (index) {
                var arrayStore = this.arrayStore;
                return arrayStore ? arrayStore.getAt(index) : null;
            };
            ListAdapter.prototype.getView = function (index, callback) {
                this.loadItemView(index, callback);
            };
            ListAdapter.prototype.onStoreBind = function (store, callback) {
                var _this = this;
                var loadedCount;
                var arrayStore = store;
                Assert.isTrue(store instanceof PureMVC.ArrayStore, 'ListAdapter only support bind ArrayStore');
                arrayStore.addListenerScope('add', this.onStoreAdd, this);
                arrayStore.addListenerScope('remove', this.onStoreRemove, this);
                arrayStore.addListenerScope('clear', this.onStoreClear, this);
                arrayStore.addListenerScope('sync', this.onStoreSync, this);
                if (arrayStore.count === 0) {
                    callback && callback();
                }
                else {
                    loadedCount = arrayStore.count;
                    arrayStore.each(function (model, idx) {
                        _this.getView(idx, function (itemView) {
                            _this.listView.addItemView(itemView);
                            if (--loadedCount === 0) {
                                callback && callback();
                            }
                        });
                    });
                }
            };
            ListAdapter.prototype.onStoreUnbind = function (store) {
                var arrayStore = this.arrayStore;
                arrayStore.removeListenerScope('add', this.onStoreAdd, this);
                arrayStore.removeListenerScope('remove', this.onStoreRemove, this);
                arrayStore.removeListenerScope('clear', this.onStoreClear, this);
                arrayStore.removeListenerScope('sync', this.onStoreSync, this);
                this.listView.clearItemViews();
            };
            ListAdapter.prototype.onStoreAdd = function (e) {
                var _this = this;
                this.getView(e.data.index, function (itemView) {
                    _this.listView.addItemView(itemView);
                    itemView.gameObject.loadAssets(function () { return itemView.gameObject.init(); });
                });
            };
            ListAdapter.prototype.onStoreRemove = function (e) {
                this.listView.removeItemViewAt(e.data.index);
            };
            ListAdapter.prototype.onStoreClear = function (e) {
                this.listView.clearItemViews();
            };
            ListAdapter.prototype.onStoreSync = function (e) {
            };
            ListAdapter.prototype.loadItemView = function (index, callback) {
                var viewBuilder = new PureMVC.ViewBuilder();
                viewBuilder.setSync();
                viewBuilder.instantiateWithSrc(this.listView.itemViewSrc);
                viewBuilder.addModel(PureMVC.ListView.DEFAUL_ITEM_MODEL_KEY, this.getItem(index));
                viewBuilder.build(function (error, root) {
                    var itemView = root.getComponent(PureMVC.SimpleView);
                    callback && callback(itemView);
                });
            };
            return ListAdapter;
        })(PureMVC.Adapter);
        PureMVC.ListAdapter = ListAdapter;
        PureMVC.AdapterFactory.register('ListAdapter', ListAdapter);
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='AdapterView.ts'/>
///<reference path='ListAdapter.ts'/>
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var ListView = (function (_super) {
            __extends(ListView, _super);
            function ListView() {
                _super.apply(this, arguments);
                this._itemViews = [];
            }
            Object.defineProperty(ListView.prototype, "itemViewSrc", {
                get: function () {
                    return this._itemViewSrc;
                },
                set: function (src) {
                    this._itemViewSrc = src;
                },
                enumerable: true,
                configurable: true
            });
            ListView.prototype.addItemViewAt = function (itemView, idx) {
                this._itemViews.splice(idx, 0, itemView);
                itemView.gameObject.z = idx;
                this.gameObject.addChild(itemView.gameObject);
            };
            ListView.prototype.removeItemViewAt = function (idx) {
                var itemView = this._itemViews[idx];
                this._itemViews.splice(idx, 1);
                itemView.gameObject.destroy();
                itemView.gameObject.removeMe();
            };
            ListView.prototype.clearItemViews = function () {
                this.gameObject.eachChild(function (child) {
                    child.destroy();
                    child.removeMe();
                });
                this._itemViews.length = 0;
            };
            ListView.prototype.addItemView = function (itemView) {
                this.addItemViewAt(itemView, this._itemViews.length);
            };
            ListView.prototype.getItemViewAt = function (idx) {
                return this._itemViews[idx];
            };
            ListView.prototype.removeItemView = function (itemView) {
                var idx = this.indexOf(itemView);
                this.removeItemViewAt(idx);
            };
            ListView.prototype.indexOf = function (itemView) {
                return this._itemViews.indexOf(itemView);
            };
            ListView.DEFAUL_ITEM_MODEL_KEY = 'item';
            return ListView;
        })(PureMVC.AdapterView);
        PureMVC.ListView = ListView;
        WOZLLA.Component.register(ListView, {
            name: 'MVC.ListView',
            properties: [
                WOZLLA.Component.extendConfig(PureMVC.AdapterView),
                {
                    name: 'itemViewSrc',
                    type: 'string'
                }
            ]
        });
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='SimpleView.ts'/>
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var Assert = WOZLLA.Assert;
        var helpRecord = new WOZLLA.QueryRecord();
        var SimpleBinder = (function () {
            function SimpleBinder(simpleView, config) {
                this._queryCache = {};
                this._view = simpleView;
                this._config = config;
                for (var attrName in config) {
                    var attrConfig = config[attrName];
                    if (typeof attrConfig === 'string') {
                        config[attrName] = {
                            bind: attrConfig,
                            cache: true
                        };
                    }
                }
            }
            SimpleBinder.prototype.syncAttr = function (name) {
                var target;
                var targetAttrName;
                var model = this._view.model;
                var attrConfig = this._config[name];
                // get model value
                var getter = attrConfig.model && attrConfig.model.getter;
                var value;
                if (model) {
                    if (getter) {
                        value = getter(model);
                    }
                    else {
                        value = model.get(name);
                    }
                }
                // query bind target
                var cacheData;
                var cache = attrConfig.cache !== false;
                var bind = attrConfig.bind;
                if (cache) {
                    cacheData = this._queryCache[bind];
                    target = cacheData && cacheData.target;
                    targetAttrName = cacheData && cacheData.attrName;
                }
                if (!target) {
                    var gameObj = this._view.gameObject;
                    var queryRecord = helpRecord;
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
                target[targetAttrName] = value;
                target.loadAssets();
            };
            SimpleBinder.prototype.onModelFieldChange = function (e) {
                this.syncAttr(e.data.field);
            };
            SimpleBinder.prototype.onModelBind = function (model) {
                this.syncAll();
            };
            SimpleBinder.prototype.onModelUnbind = function (model) {
                this.syncAll();
            };
            SimpleBinder.prototype.syncAll = function () {
                var config = this._config;
                for (var attrName in config) {
                    this.syncAttr(attrName);
                }
            };
            return SimpleBinder;
        })();
        PureMVC.SimpleBinder = SimpleBinder;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
///<reference path='View.ts'/>
var WOZLLA;
(function (WOZLLA) {
    var PureMVC;
    (function (PureMVC) {
        var Assert = WOZLLA.Assert;
        var ViewBuilder = (function (_super) {
            __extends(ViewBuilder, _super);
            function ViewBuilder() {
                _super.apply(this, arguments);
                this._modelMap = {};
                this._storeMap = {};
                this._bindList = [];
            }
            ViewBuilder.fullBuild = function (src, modelMap, onComplete) {
                var builder = new WOZLLA.PureMVC.ViewBuilder();
                if (typeof src === 'string') {
                    builder.instantiateWithSrc(src);
                }
                else {
                    builder.instantiateWithJSON(src);
                }
                for (var key in modelMap) {
                    var modelOrStore = modelMap[key];
                    if (modelOrStore instanceof PureMVC.Model) {
                        builder.addModel(key, modelOrStore);
                    }
                    else {
                        builder.addStore(key, modelOrStore);
                    }
                }
                builder.load().init().build(function (error, root) {
                    var view = root.getComponent(PureMVC.View);
                    onComplete && onComplete(view);
                });
            };
            ViewBuilder.prototype.addModel = function (key, model) {
                this._modelMap[key] = model;
            };
            ViewBuilder.prototype.getModel = function (key) {
                Assert.isNotUndefined(this._modelMap[key]);
                return this._modelMap[key];
            };
            ViewBuilder.prototype.addStore = function (key, store) {
                this._storeMap[key] = store;
            };
            ViewBuilder.prototype.getStore = function (key) {
                Assert.isNotUndefined(this._storeMap[key]);
                return this._storeMap[key];
            };
            ViewBuilder.prototype._newGameObjectTree = function (callback) {
                var _this = this;
                _super.prototype._newGameObjectTree.call(this, function () {
                    var me = _this;
                    function nextBind() {
                        var bindExec = me._bindList.shift();
                        if (!bindExec) {
                            callback();
                            return;
                        }
                        bindExec(nextBind);
                    }
                    nextBind();
                });
            };
            ViewBuilder.prototype._newComponent = function (compData, gameObj) {
                var _this = this;
                var simpleView;
                var adapterView;
                var component = _super.prototype._newComponent.call(this, compData, gameObj);
                if (component instanceof PureMVC.View) {
                    component.onCreate();
                    if (component instanceof PureMVC.SimpleView) {
                        simpleView = component;
                        if (simpleView.modelKey) {
                            this._bindList.push(function (next) {
                                simpleView.bindModel(_this.getModel(simpleView.modelKey));
                                next();
                            });
                        }
                    }
                    else if (component instanceof PureMVC.AdapterView) {
                        adapterView = component;
                        if (adapterView.storeKey) {
                            this._bindList.push(function (next) {
                                adapterView.bindStore(_this.getStore(adapterView.storeKey), next);
                            });
                        }
                    }
                }
                return component;
            };
            return ViewBuilder;
        })(WOZLLA.jsonx.JSONXBuilder);
        PureMVC.ViewBuilder = ViewBuilder;
    })(PureMVC = WOZLLA.PureMVC || (WOZLLA.PureMVC = {}));
})(WOZLLA || (WOZLLA = {}));
//# sourceMappingURL=WOZLLA.PureMVC.js.map