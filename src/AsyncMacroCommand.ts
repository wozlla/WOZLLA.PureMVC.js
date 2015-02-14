///<reference path='../puremvc-typescript-multicore-1.1.d.ts'/>
///<reference path='AsyncCommand.ts'/>
module WOZLLA.PureMVC {

    export class AsyncMacroCommand extends puremvc.MacroCommand {

        public execute(notification: puremvc.INotification):void {
            var me = this;
            var	subCommands:Function[] = this.subCommands.slice(0);
            var idx:number = 0;
            function asyncExec() {
                var CommandClass:Function = subCommands[idx++];
                if(!CommandClass) {
                    return;
                }
                me.executeSubCommand(CommandClass, notification, asyncExec);
            }
            asyncExec();
        }

        public executeSubCommand(CommandClass:Function, notification: puremvc.INotification, onComplete:Function):void {
            var commandInstance:any =  new (<any>CommandClass)();
            commandInstance.initializeNotifier(this.multitonKey);
            if(commandInstance instanceof AsyncCommand) {
                commandInstance.execute(notification, onComplete);
            } else {
                commandInstance.execute(notification);
                onComplete();
            }
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