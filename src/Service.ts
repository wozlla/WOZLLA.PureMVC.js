///<reference path='../puremvc-typescript-multicore-1.1.d.ts'/>
module WOZLLA.PureMVC {

    export class Service extends puremvc.Proxy {

        public getService(id):Service {
            return <Service>this.facade().retrieveProxy(id);
        }

        public getProxy(id):Proxy {
            return<Proxy>this.facade().retrieveProxy(id);
        }

    }

}