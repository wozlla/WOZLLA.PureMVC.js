///<reference path='../puremvc-typescript-multicore-1.1.d.ts'/>
module WOZLLA.PureMVC {

    export class AsyncCommand extends puremvc.SimpleCommand {

        public execute(notification: puremvc.INotification, onComplete?:Function): void {
            onComplete && onComplete();
        }

        public getMediator(id):Mediator {
            return <Mediator>this.facade().retrieveMediator(id);
        }

        public getService(id):Service {
            return <Service>this.facade().retrieveProxy(id);
        }

        public getProxy(id):Proxy {
            return<Proxy>this.facade().retrieveProxy(id);
        }
    }

}