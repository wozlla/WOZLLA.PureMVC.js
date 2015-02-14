///<reference path='AdapterView.ts'/>
///<reference path='ListAdapter.ts'/>
module WOZLLA.PureMVC {

    export class ListView extends AdapterView {

        public static DEFAUL_ITEM_MODEL_KEY = 'item';

        get itemViewSrc():string {
            return this._itemViewSrc;
        }
        set itemViewSrc(src:string) {
            this._itemViewSrc = src;
        }

        get selectionModel():ListSelectionModel {
            return this._selectionModel;
        }

        _itemViewSrc:string;
        _itemViews:SimpleView[]= [];

        _selectionModel:ListSelectionModel = new ListSelectionModel();

        onCreate() {
            super.onCreate();
            this.gameObject.addListenerScope('tap', this.onChildTap, this);
            this._selectionModel.addListenerScope(ListSelectionModel.EVENT_CHANGED, this.onSelectionChanged, this);
        }

        onDestroy() {
            this.gameObject.removeListenerScope('tap', this.onChildTap, this);
            this._selectionModel.removeListenerScope(ListSelectionModel.EVENT_CHANGED, this.onSelectionChanged, this);
        }

        protected getTapChildView(e) {
            return e.target.getComponent(SimpleView);
        }

        protected onChildTap(e) {
            var idx;
            var view:any = this.getTapChildView(e);
            if(view && view.isSelectable) {
                idx = this.indexOf(view);
                if(idx !== -1) {
                    this.selectionModel.addSelectionIndex(idx);
                }
            }
        }

        protected onSelectionChanged(e:SelectionChangeEvent) {
            var oldSelectionIndices = e.oldSelectionIndices;
            var selectionIndices = e.selectionIndices;

            var deselectArr = oldSelectionIndices.filter((val) => selectionIndices.indexOf(val) === -1);
            var selectArr = selectionIndices.filter((val) => oldSelectionIndices.indexOf(val) === -1);

            deselectArr.forEach((idx) => {
                var view:any = this.getItemViewAt(idx);
                if(view.isSelectable) {
                    view.setSelected(false);
                }
            });
            selectArr.forEach((idx) => {
                var view:any = this.getItemViewAt(idx);
                if(view.isSelectable) {
                    view.setSelected(true);
                }
            });
        }

        addItemViewAt(itemView:SimpleView, idx:number) {
            this._itemViews.splice(idx, 0, itemView);
            itemView.gameObject.z = idx;
            this.gameObject.addChild(itemView.gameObject);
        }

        removeItemViewAt(idx:number) {
            var itemView:SimpleView = this._itemViews[idx];
            this._itemViews.splice(idx, 1);
            itemView.gameObject.destroy();
            itemView.gameObject.removeMe();
        }

        clearItemViews() {
            this.gameObject.eachChild((child) => {
                child.destroy();
                child.removeMe();
            });
            this._itemViews.length = 0;
        }

        addItemView(itemView:SimpleView) {
            this.addItemViewAt(itemView, this._itemViews.length);
        }

        getItemViewAt(idx:number):SimpleView {
            return this._itemViews[idx];
        }

        removeItemView(itemView:SimpleView) {
            var idx = this.indexOf(itemView);
            this.removeItemViewAt(idx);
        }

        indexOf(itemView:SimpleView) {
            return this._itemViews.indexOf(itemView);
        }

    }

    WOZLLA.Component.register(ListView, {
        name: 'MVC.ListView',
        disableInEditor: true,
        properties: [
        Component.extendConfig(AdapterView),
        {
            name: 'itemViewSrc',
            type: 'string'
        }]
    });

}