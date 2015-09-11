var module = angular.module("AdamNagyApp");

var ChatDirective = module.directive('chat', function($timeout){
    return {
        restrict: 'E',
        templateUrl: '../templates/chat.html',
        scope: {
            socket: "=",
            name: "="
        },
        controller: ['$scope', function(scope){
            scope.chatInput = "";
            scope.isTyping = false;
            scope.messages = [];

            var typingPromise;

            scope.stringToRGB = function(i){
                console.log(i);
                i = hashCode(i)
                var c = (i & 0x00FFFFFF)
                    .toString(16)
                    .toUpperCase();
                var retVal = "00000".substring(0, 6 - c.length) + c;

                retVal = "#" + retVal;
                console.log(retVal);
                return retVal;
                function hashCode(str) { // java String#hashCode
                    var hash = 0;
                    for (var i = 0; i < str.length; i++) {
                       hash = str.charCodeAt(i) + ((hash << 5) - hash);
                    }
                    return hash;
                } 
            };


            scope.typing = function(){
                console.log("typing");
                $timeout.cancel(typingPromise);
                typingPromise = $timeout(stoppedTyping, 1000);
                scope.socket.emit('typing');
                //scope.isTyping = true;
                //scope.$apply();       

                function stoppedTyping(){
                    //ng-keyup="stoppedTyping"
                    console.log("stopped typing");
                    scope.socket.emit('stopped typing');
                    scope.isTyping = false;
                    scope.$apply();
                }
            };


            scope.sendMessage = function(){
                var msg = {};
                msg.username = scope.name;
                msg.message = scope.chatInput;
                addMessage(msg, true);
                scope.socket.emit("new message", scope.chatInput);
                scope.chatInput = "";
            }

            scope.socket.on('typing', function(data){
                console.log("typing", data);
                scope.isTyping = true;
                scope.typing.username = data.username;
                scope.$apply();    //wtf
            });
            scope.socket.on('stopped typing', function(data){
                console.log("stopped typing", data);
                scope.isTyping = false;
                scope.$apply();
            });

            scope.socket.on('new message', addMessage);


            function addMessage(data, apply){
                var msg = {};
                msg.username = data.username;
                msg.message = data.message;
                scope.messages.push(msg);
                if(!apply)
                    scope.$apply();
            }

        }]
    };
});

ChatDirective.$inject = ['$timeout'];