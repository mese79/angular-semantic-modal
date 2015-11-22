function getUUID() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == "x" ? r : (r&0x3|0x8);
		return v.toString(16);
	});
};

var semanticModal = angular.module("SemanticModal", []);

// Modal factory:
semanticModal.factory("Modal", ["$rootScope", "$q", "$http", "$compile", "$controller", "$timeout", "$document",
	function($rootScope, $q, $http, $compile, $controller, $timeout, $document) {
	
		function Modal(settings) {
			var self = this;
			
			self.defered = $q.defer();

			self.settings = angular.extend({
				allowMultiple: true,
				closable: false
			}, settings);

			var url = settings.template || settings.templateUrl;
			if (!url) {
				console.error("No templateUrl or template specified for modal window.");
				return null;
			}

			self.id = getUUID();
			
			// Get scope from settings or create a new one.	
			self.scope = (settings.scope || $rootScope).$new();
			delete self.settings.scope;
			
			// Create a controller instance, if specified.
			var ctrl = {};
			if (self.settings.controller) {
				ctrl = $controller(self.settings.controller, {
					$scope: self.scope
				});
				delete self.settings.controller;
			}

			if (self.settings.message)
				self.scope.message = self.settings.message;

			// Make functions for modal behaviors:
			function onApprove() {
				self.defered.resolve("approved");
			}
			function onDeny() {
				self.defered.resolve("denied");
			}

			// Add and compile modal directive.
			self.scope.options = {
				"closable": self.settings.closable,
				"allowMultiple": self.settings.allowMultiple,
				"onVisible": ctrl.onVisible || ctrl[self.settings.onVisible] || self.settings.onVisible,
				"onHidden": ctrl.onHidden || ctrl[self.settings.onHidden] || self.settings.onHidden,
				"onApprove": onApprove,
				"onDeny": onDeny
			};
			var angularElem = angular.element("<semantic-modal></semantic-modal>");
			angularElem.attr({
				"id": self.id,
				"template-url": url,
				"options": "options"
			});
			self.element = $compile(angularElem)(self.scope);
			var body = $document.find("body").eq(0);
			body.append(self.element);
		};

		Modal.prototype.show = function() {
			var self = this;
			// Create new defer each time.
			self.defered = $q.defer();

			$timeout(function() {
				self.element.modal("show");
			}, 10);
			
			return self.defered.promise;
		};

		Modal.prototype.setMessage = function(msg) {
			this.scope.message = msg;	
		};

		Modal.prototype.close = function() {
			var self = this;
			$timeout(function() {
				self.element.modal("hide");
			}, 10);
		};

		Modal.prototype.destroy = function() {
			this.settings = this.scope = null;
			this.element.remove();
		};

		return Modal;

	}
]);

// Modal directive:
semanticModal.directive("semanticModal", function($document) {
	return {

		restrict: "EA",
		transclude: true,
		replace: true,
		templateUrl: function(element, attrs) {
			return attrs.templateUrl;
		},
		link: function(scope, element, attrs) {
			element.modal(scope.options);
		}

	};
});

// Dimmer factory:
semanticModal.factory("Dimmer", ["$rootScope", "$q", "$http", "$compile", "$controller", "$timeout", "$document",
	function($rootScope, $q, $http, $compile, $controller, $timeout, $document) {
	
		function Dimmer(settings) {
			var self = this;
			
			self.settings = angular.extend({
				parent: $document.find("body").eq(0)
			}, settings);

			var url = settings.template || settings.templateUrl;
			if (!url) {
				url = '<div class="ui dimmer"><div class="ui text loader"></div></div>';
			}

			self.id = getUUID();
			
			// Get scope from settings or create a new one.	
			self.scope = (settings.scope || $rootScope).$new();
			delete self.settings.scope;
			
			// Create a controller instance, if specified.
			var ctrl = {};
			if (self.settings.controller) {
				ctrl = $controller(self.settings.controller, {
					$scope: self.scope
				});
				delete self.settings.controller;
			}

			// Add and compile modal directive.
			self.scope.options = {
				"onShow": ctrl.onShow || ctrl[self.settings.onShow],
				"onHide": ctrl.onHide || ctrl[self.settings.onHide],
				"onChange": ctrl.onChange || ctrl[self.settings.onChange],
				"closable": false
			};
			var angularElem = angular.element("<semantic-dimmer></semantic-dimmer>");
			angularElem.attr({
				"id": self.id,
				"template-url": url,
				"options": "options"
			});
			self.element = $compile(angularElem)(self.scope);
			self.settings.parent.append(self.element);
		};

		Dimmer.prototype.show = function() {
			var self = this;
			self.element.dimmer("show");
		};

		Dimmer.prototype.hide = function() {
			var self = this;
			self.element.dimmer("hide");
		};

		return Dimmer;

	}
]);

// Dimmer directive:
semanticModal.directive("semanticDimmer", function($document) {
	return {

		restrict: "EA",
		transclude: true,
		replace: true,
		templateUrl: function(element, attrs) {
			return attrs.templateUrl;
		},
		link: function(scope, element, attrs) {
			element.dimmer(scope.options);
		}

	};
});
