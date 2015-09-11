var module = angular.module("AdamNagyApp");

module.controller("AppController", ["$scope", "$modal", function($scope, $modal) {
    $scope.loggedIn = false;
    $scope.name = "UnnamedUser";
    $scope.socket = io();
	$scope.usersMessage = '';
	$scope.typingTimer = 500; //ms

    $scope.open = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '../templates/modal.html',
            backdrop: false,
            controller: 'ModalInstanceCtrl',
            resolve: {
                name: function() {
                    return $scope.name;
                }
            }
        });
        modalInstance.result.then(function(name) {
            $scope.name = name;
            $scope.loggedIn = true;
            console.log($scope.name);
            $scope.socket.emit('add user', $scope.name);
        }, function() {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    function addParticipantsMessage(data){
    	console.log("user joined");
    	console.log(data.numUsers);
    	if (data.numUsers === 1) {
	      $scope.usersMessage = "There's 1 participant";
	    } else {
	      $scope.usersMessage = "There are " + data.numUsers + " participants";
	    }
	    $scope.$apply();	//interesting why this is necessary
    }


    // SOCKET.IO events
	$scope.socket.on('login', addParticipantsMessage);
	$scope.socket.on('user joined', addParticipantsMessage);
	$scope.socket.on('user left', addParticipantsMessage);
	

    // SOCKET.IO events

    $scope.$watch("name", function(newValue, oldValue){
    	console.log(newValue);
    });
    $scope.open();

    //any string to hexa color

    
}]);