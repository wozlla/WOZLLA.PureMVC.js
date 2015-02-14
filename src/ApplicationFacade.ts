///<reference path='../puremvc-typescript-multicore-1.1.d.ts'/>
module WOZLLA.PureMVC {

    export class ApplicationFacade extends puremvc.Facade {

        public static getInstance(key:string):ApplicationFacade {
            if(ApplicationFacade.instanceMap[key] == null) {
                ApplicationFacade.instanceMap[key] = new ApplicationFacade(key);
            }
            return ApplicationFacade.instanceMap[key];
        }

        public registerService(service:WOZLLA.PureMVC.Service):void {
            this.registerProxy(service);
        }

    }

}