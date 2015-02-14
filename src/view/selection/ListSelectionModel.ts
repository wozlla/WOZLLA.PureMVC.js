module WOZLLA.PureMVC {

    export interface ISelectable {
        isSelectable:boolean;
        setSelected(selected:boolean):void;
    }

    export class ListSelectionModel extends WOZLLA.event.EventDispatcher {

        public static SINGLE_SELECTION:number = 1;
        public static MULTIPLE_SELECTION:number = 2;

        public static EVENT_CHANGED:string = 'selectionChanged';

        get selectionIndex():number {
            if(this._selectionIndices.length === 0) {
                return -1;
            }
            return this._selectionIndices[0];
        }

        get selectionIndices():Array<number> {
            return this._selectionIndices.slice(0);
        }

        _selectionIndices:Array<number> = [];
        _selectionMode:number = ListSelectionModel.SINGLE_SELECTION;

        addSelectionIndex(index:number) {
            if(this._selectionIndices.indexOf(index) !== -1) {
                return;
            }
            if(this._selectionMode === ListSelectionModel.SINGLE_SELECTION) {
                this.setSelectionIndex(index);
                return;
            }
            var oldIndices = this._selectionIndices.slice(0);
            this._selectionIndices.push(index);
            this.dispatchEvent(new SelectionChangeEvent(this._selectionIndices.slice(0), oldIndices));
        }

        setSelectionIndex(index:number) {
            if(this._selectionIndices.indexOf(index) !== -1) {
                return;
            }
            var oldIndices = this._selectionIndices.slice(0);
            this._selectionIndices.length = 0;
            this._selectionIndices.push(index);
            this.dispatchEvent(new SelectionChangeEvent(this._selectionIndices.slice(0), oldIndices));
        }

        setSelectionIndices(indices:Array<number>) {
            if(!indices || indices.length === 0) {
                var oldIndices = this._selectionIndices.slice(0);
                this._selectionIndices.length = 0;
                this.dispatchEvent(new SelectionChangeEvent(this._selectionIndices.slice(0), oldIndices));
            } else {
                if(this._selectionMode === ListSelectionModel.SINGLE_SELECTION) {
                    this.setSelectionIndex(indices[0]);
                } else {
                    var oldIndices = this._selectionIndices.slice(0);
                    this._selectionIndices = indices;
                    this.dispatchEvent(new SelectionChangeEvent(this._selectionIndices.slice(0), oldIndices));
                }
            }
        }

        clearSelection() {
            var oldIndices = this._selectionIndices.slice(0);
            this._selectionIndices.length = 0;
            this.dispatchEvent(new SelectionChangeEvent(this._selectionIndices.slice(0), oldIndices));
        }

        setSelectionMode(mode:number) {
            this._selectionMode = mode;
        }

    }

    export class SelectionChangeEvent extends WOZLLA.event.Event {

        get selectionIndex():number {
            if(this._selectionIndices.length === 0) {
                return -1;
            }
            return this._selectionIndices[0];
        }

        get selectionIndices():Array<number> {
            return this._selectionIndices.slice(0);
        }

        get oldSelectionIndex():number {
            if(this._oldSelectionIndices.length === 0) {
                return -1;
            }
            return this._oldSelectionIndices[0];
        }

        get oldSelectionIndices():Array<number> {
            return this._oldSelectionIndices.slice(0);
        }

        _selectionIndices:Array<number> = [];
        _oldSelectionIndices:Array<number> = [];

        constructor(selectionIndices:Array<number>, oldSelectionIndices:Array<number>) {
            super(ListSelectionModel.EVENT_CHANGED, false);
            this._selectionIndices = selectionIndices;
            this._oldSelectionIndices = oldSelectionIndices;
        }

    }

}