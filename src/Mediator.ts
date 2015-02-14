module WOZLLA.PureMVC {

    export class Mediator extends puremvc.Mediator {

        private controlParams:any;
        private scope;

        public getStage():WOZLLA.Stage {
            return Director.getInstance().stage;
        }

        public getService(id):Service {
            return <Service>this.facade().retrieveProxy(id);
        }

        public getProxy(id):Proxy {
            return<Proxy>this.facade().retrieveProxy(id);
        }

        public control(scope:WOZLLA.GameObject, params:any) {
            if(this.scope || this.controlParams) {
                return;
            }
            this.controlParams = params;
            scope.addListenerScope('*', this.onControl, this);
        }

        public uncontrol(scope:WOZLLA.GameObject) {
            scope.removeListenerScope('*', this.onControl, this);
        }

        private onControl(e) {
            var targetName = e.target.name;
            var targetIdExpr = '#' + e.target.id;
            var eventType = e.type;

            var listenerMap;
            var listener;
            for(var expr in this.controlParams) {
                if(targetName === expr || targetIdExpr === expr) {
                    listenerMap = this.controlParams[expr];
                    if(listenerMap) {
                        listener = listenerMap[eventType];
                        if (listener) {
                            listener.call(this, e, this.scope);
                        }
                    }
                }
            }
        }

    }

}