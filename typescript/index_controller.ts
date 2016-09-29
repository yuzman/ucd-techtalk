module UCD.Controllers
{
    export class IndexController
    {
        /** Dependency injection */
        static $inject = ['$scope', 'socket'];

        /** Messages */
        public messages = [];

        public userMessage: any;

        public username: string;

        /** Constructor */
        constructor(private $scope: any, private socket: any)
        {
            var ref = this;
            socket.on('server_message', function(data) {        
                ref.messages.push(data.text);
                ref.$scope.$apply();
            });

            var cks = document.cookie.split(';');
            for(var i in cks)
            {
                if (cks[i].split('signin_i=').length == 2)
                {
                    this.username = cks[i].split('signin_i=')[1];
                }
            }
        }

        /** Send messages */
        public sendMessage()
        {        
            if (this.userMessage && this.userMessage.length > 0)
            {
                this.messages.push(this.userMessage);
                this.socket.emit('client_message', {text: this.userMessage});
                this.userMessage = '';
            }
        }
    }
    angular.module('UCD.Controllers', []);
    angular.module('UCD.Controllers').controller('IndexController', IndexController);
}