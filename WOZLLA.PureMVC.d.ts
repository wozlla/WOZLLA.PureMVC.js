/// <reference path="puremvc-typescript-multicore-1.1.d.ts" />
/// <reference path="typings/tsd.d.ts" />
declare module WOZLLA.PureMVC {
    class ApplicationFacade extends puremvc.Facade {
        static getInstance(key: string): ApplicationFacade;
        registerService(service: WOZLLA.PureMVC.Service): void;
    }
}
declare module WOZLLA.PureMVC {
    class AsyncCommand extends puremvc.SimpleCommand {
        execute(notification: puremvc.INotification, onComplete?: Function): void;
        getMediator(id: any): Mediator;
        getService(id: any): Service;
        getProxy(id: any): Proxy;
    }
}
declare module WOZLLA.PureMVC {
    class AsyncMacroCommand extends puremvc.MacroCommand {
        execute(notification: puremvc.INotification): void;
        executeSubCommand(CommandClass: Function, notification: puremvc.INotification, onComplete: Function): void;
        getMediator(id: any): Mediator;
        getService(id: any): Service;
        getProxy(id: any): Proxy;
    }
}
declare module WOZLLA.PureMVC {
    class Mediator extends puremvc.Mediator {
        private controlParams;
        private scope;
        getStage(): WOZLLA.Stage;
        getService(id: any): Service;
        getProxy(id: any): Proxy;
        control(scope: WOZLLA.GameObject, params: any): void;
        uncontrol(scope: WOZLLA.GameObject): void;
        private onControl(e);
    }
}
declare module WOZLLA.PureMVC {
    class ModelBase extends WOZLLA.event.EventDispatcher {
        get(field: string): any;
        set(field: string, value: any): void;
    }
}
declare module WOZLLA.PureMVC {
    class Model extends ModelBase {
        protected data: any;
        protected definedField: any;
        constructor();
        initFields(): void;
        defineField(field: string): void;
        defineFields(array: Array<string>): void;
        get(field: string): any;
        set(field: string, value: any, silent?: boolean): void;
        setAll(data: any, silent?: boolean): void;
    }
    class FieldChangeEventData {
        field: string;
        value: any;
        oldValue: any;
        _field: string;
        _value: any;
        _oldValue: any;
        constructor(field: string, value: any, oldValue: any);
    }
}
declare module WOZLLA.PureMVC {
    class Store extends WOZLLA.event.EventDispatcher {
    }
}
declare module WOZLLA.PureMVC {
    class ArrayStore<T extends Model> extends Store {
        protected list: any[];
        count: number;
        add(model: T, silent?: boolean): void;
        addAt(model: T, index: number, silent?: boolean): void;
        remove(model: T, silent?: boolean): void;
        removeAt(index: number, silent?: boolean): void;
        clear(silent?: boolean): void;
        getAt(index: number): any;
        getRange(start: number, count: number): Array<T>;
        indexOf(model: T): number;
        sync(): void;
        each(func: (model: T, index: number) => any): void;
        query(func: (model: T, index: number) => any): Array<T>;
        sort(func: (a: T, b: T) => any, silent?: boolean): void;
    }
    class ArrayStoreEventData {
        model: Model;
        index: number;
        constructor(model: Model, index: number);
    }
}
declare module WOZLLA.PureMVC {
    class Proxy extends puremvc.Proxy {
    }
}
declare module WOZLLA.PureMVC {
    class Service extends puremvc.Proxy {
        getService(id: any): Service;
        getProxy(id: any): Proxy;
    }
}
declare module WOZLLA.PureMVC {
    class View extends WOZLLA.Component {
        init(): void;
        destroy(): void;
        onCreate(): void;
        onInit(): void;
        onDestroy(): void;
    }
}
declare module WOZLLA.PureMVC {
    class AdapterFactory {
        private static adapterCtorMap;
        static create(name: string): any;
        static register(name: string, AdapterClass: Function): void;
    }
}
declare module WOZLLA.PureMVC {
    class AdapterView extends View {
        adapter: Adapter;
        storeKey: string;
        store: Store;
        _store: Store;
        _storeKey: string;
        _adapter: Adapter;
        onDestroy(): void;
        bindStore(store: Store, callback?: Function): void;
        unbindStore(): void;
        onStoreBind(store: Store, callback?: Function): void;
        onStoreUnbind(store: Store): void;
        setAdapter(adapter: Adapter, callback?: Function): void;
    }
}
declare module WOZLLA.PureMVC {
    class Adapter {
        _adapterView: AdapterView;
        setAdapterView(view: AdapterView): void;
        getCount(): number;
        getItem(index: any): Model;
        getView(index: any, callback: (view: SimpleView) => void): void;
        onStoreBind(store: Store, callback?: Function): void;
        onStoreUnbind(store: Store): void;
    }
}
declare module WOZLLA.PureMVC {
    class SimpleView extends View {
        modelKey: string;
        model: ModelBase;
        _model: ModelBase;
        _modelKey: string;
        _binder: SimpleBinder;
        onDestroy(): void;
        bindModel(model: ModelBase): void;
        unbindModel(): void;
        onModelFieldChange(e: any): void;
        onModelBind(model: ModelBase): void;
        onModelUnbind(model: ModelBase): void;
        setBinder(binder: SimpleBinder): void;
        getModelFieldValue(field: string): any;
    }
}
declare module WOZLLA.PureMVC {
    class ListAdapter extends Adapter {
        arrayStore: ArrayStore<Model>;
        listView: ListView;
        getCount(): number;
        getItem(index: any): Model;
        getView(index: any, callback: (view: SimpleView) => void): void;
        onStoreBind(store: Store, callback: Function): void;
        onStoreUnbind(store: Store): void;
        onStoreAdd(e: any): void;
        onStoreRemove(e: any): void;
        onStoreClear(e: any): void;
        onStoreSync(e: any): void;
        protected loadItemView(index: any, callback?: (view: SimpleView) => void): void;
    }
}
declare module WOZLLA.PureMVC {
    class ListView extends AdapterView {
        static DEFAUL_ITEM_MODEL_KEY: string;
        itemViewSrc: string;
        selectionModel: ListSelectionModel;
        _itemViewSrc: string;
        _itemViews: SimpleView[];
        _selectionModel: ListSelectionModel;
        onCreate(): void;
        onDestroy(): void;
        protected getTapChildView(e: any): any;
        protected onChildTap(e: any): void;
        protected onSelectionChanged(e: SelectionChangeEvent): void;
        addItemViewAt(itemView: SimpleView, idx: number): void;
        removeItemViewAt(idx: number): void;
        clearItemViews(): void;
        addItemView(itemView: SimpleView): void;
        getItemViewAt(idx: number): SimpleView;
        removeItemView(itemView: SimpleView): void;
        indexOf(itemView: SimpleView): number;
    }
}
declare module WOZLLA.PureMVC {
    class ModelWrapper extends ModelBase {
        _modelMap: any;
        constructor(modelMap: any);
        get(field: string): any;
        set(field: string, value: any, silent?: boolean): void;
    }
}
declare module WOZLLA.PureMVC {
    interface ISelectable {
        isSelectable: boolean;
        setSelected(selected: boolean): void;
    }
    class ListSelectionModel extends WOZLLA.event.EventDispatcher {
        static SINGLE_SELECTION: number;
        static MULTIPLE_SELECTION: number;
        static EVENT_CHANGED: string;
        selectionIndex: number;
        selectionIndices: Array<number>;
        _selectionIndices: Array<number>;
        _selectionMode: number;
        addSelectionIndex(index: number): void;
        setSelectionIndex(index: number): void;
        setSelectionIndices(indices: Array<number>): void;
        clearSelection(): void;
        setSelectionMode(mode: number): void;
    }
    class SelectionChangeEvent extends WOZLLA.event.Event {
        selectionIndex: number;
        selectionIndices: Array<number>;
        oldSelectionIndex: number;
        oldSelectionIndices: Array<number>;
        _selectionIndices: Array<number>;
        _oldSelectionIndices: Array<number>;
        constructor(selectionIndices: Array<number>, oldSelectionIndices: Array<number>);
    }
}
declare module WOZLLA.PureMVC {
    class SimpleBinder {
        _view: SimpleView;
        _config: any;
        _queryCache: any;
        _helpRecord: WOZLLA.QueryRecord;
        constructor(simpleView: SimpleView, config: any);
        getModelFieldValue(field: string): any;
        syncAttr(name: any): void;
        onModelFieldChange(e: any): void;
        onModelBind(model: ModelBase): void;
        onModelUnbind(model: ModelBase): void;
        syncAll(): void;
    }
}
declare module WOZLLA.PureMVC {
    class ViewBuilder extends WOZLLA.jsonx.JSONXBuilder {
        static create(outerBuilder?: ViewBuilder): ViewBuilder;
        static fullBuild(src: any, modelMap: any, onComplete: (root: WOZLLA.GameObject, view: View) => void): void;
        _modelMap: any;
        _storeMap: any;
        _bindList: any[];
        applyModelStore(builder: ViewBuilder): void;
        addModel(key: string, model: Model): void;
        getModel(key: string): Model;
        addStore(key: string, store: Store): void;
        getStore(key: string): Store;
        protected _newGameObjectTree(callback: Function): void;
        protected _newComponent(compData: any, gameObj: WOZLLA.GameObject): WOZLLA.Component;
    }
}
