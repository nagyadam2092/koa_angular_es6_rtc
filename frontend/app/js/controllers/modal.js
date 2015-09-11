var module = angular.module("AdamNagyApp");

module.controller("ModalInstanceCtrl", ['$scope', '$modalInstance', 'name', function($scope, $modalInstance, name) {

    $scope.name = name;

    $scope.ok = function() {
        $modalInstance.close($scope.name);
    };

}]);