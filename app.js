"use strict";

var app = angular.module("testApp", ["SemanticModal"]);

function modalCtrl($scope) {
	// console.log("modal controller:", $scope);
	$scope.testValue1 = "my first value!";
	this.testValue2 = "my second value!";

	this.onShown = function() {
		console.log("form is visible now!");	
	};

	this.onHidden = function() {
		console.log("form is hidden now!");	
	};
};
app.controller("modalCtrl", ["$scope", modalCtrl]);


app.controller("mainCtrl", function($scope, Modal) {
	
	var myModal = new Modal({
		closable: false,
		templateUrl: "./my-modal.html",
		controller: "modalCtrl as ctrl"
	});

	$scope.showModal = function() {
		myModal.show()
			.then(function(result) {
				console.log("modal result is:", result);
			},
			function(reason) {
				console.error('Failed:', reason);
				defered.reject(reason);
			});
	};

	$scope.destroyModal = function() {
		myModal.destroy();
		myModal = null;
	};
});
