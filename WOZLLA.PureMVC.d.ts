/// <reference path="puremvc-typescript-multicore-1.1.d.ts" />
/// <reference path="typings/tsd.d.ts" />
declare module WOZLLA.PureMVC {
    class ApplicationFacade extends puremvc.Facade {
        static getInstance(key: string): ApplicationFacade;
        sendNotification(name: string, body?: any, type?: string): void;
    }
}
declare module WOZLLA.PureMVC {
    class AsyncCommand extends puremvc.SimpleCommand {
        execute(notification: puremvc.INotification, onComplete?: Function): void;
    }
}
declare module WOZLLA.PureMVC {
    class AsyncMacroCommand extends puremvc.MacroCommand {
        execute(notification: puremvc.INotification): void;
        executeSubCommand(CommandClass: Function, notification: puremvc.INotification, onComplete: Function): void;
    }
}
declare module WOZLLA.PureMVC {
    class Mediator extends puremvc.Mediator {
        getStage(): WOZLLA.Stage;
        getView(): View;
        show(callback?: Function): void;
        hide(callback?: Function): void;
        close(callback?: Function): void;
    }
}
declare module WOZLLA.PureMVC {
    class Model extends WOZLLA.event.EventDispatcher {
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
        model: Model;
        _model: Model;
        _modelKey: string;
        _binder: SimpleBinder;
        onDestroy(): void;
        bindModel(model: Model): void;
        unbindModel(): void;
        onModelFieldChange(e: any): void;
        onModelBind(model: Model): void;
        onModelUnbind(model: Model): void;
        setBinder(binder: SimpleBinder): void;
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
        _itemViewSrc: string;
        _itemViews: SimpleView[];
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
    class SimpleBinder {
        _view: SimpleView;
        _config: any;
        _queryCache: any;
        constructor(simpleView: SimpleView, config: any);
        syncAttr(name: any): void;
        onModelFieldChange(e: any): void;
        onModelBind(model: Model): void;
        onModelUnbind(model: Model): void;
        syncAll(): void;
    }
}
declare module WOZLLA.PureMVC {
    class ViewBuilder extends WOZLLA.jsonx.JSONXBuilder {
        static fullBuild(src: any, modelMap: any, onComplete: (view: View) => void): void;
        _modelMap: any;
        _storeMap: any;
        _bindList: any[];
        addModel(key: string, model: Model): void;
        getModel(key: string): Model;
        addStore(key: string, store: Store): void;
        getStore(key: string): Store;
        protected _newGameObjectTree(callback: Function): void;
        protected _newComponent(compData: any, gameObj: WOZLLA.GameObject): WOZLLA.Component;
    }
}
