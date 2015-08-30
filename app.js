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

	this.onSubmit = function() {
		console.log("form was submited.");	
	};

	this.onDeny = function() {
		console.log("form was denied!");	
	};
};
app.controller("modalCtrl", ["$scope", modalCtrl]);


app.controller("mainCtrl", function($scope, Modal) {
	
	var myModal = new Modal({
		closable: false,
		templateUrl: "./my-modal.html",
		controller: "modalCtrl as ctrl",
		onVisible: "onShown",
		onApprove: "onSubmit"
	});

	$scope.showModal = function() {
		myModal.show();
	};

	$scope.destroyModal = function() {
		myModal.destroy();
		myModal = null;
	};
});
