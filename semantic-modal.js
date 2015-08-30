function getUUID() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == "x" ? r : (r&0x3|0x8);
		return v.toString(16);
	});
};

var semanticModal = angular.module("SemanticModal", []);

semanticModal.factory("Modal", ["$rootScope", "$q", "$http", "$compile", "$controller", "$timeout", "$document",
	function($rootScope, $q, $http, $compile, $controller, $timeout, $document) {
	
		function Modal(settings) {
			var self = this;
			
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

			// Add and compile modal directive.
			self.scope.options = {
				"closable": self.settings.closable,
				"allowMultiple": self.settings.allowMultiple,
				"onVisible": ctrl.onVisible || ctrl[self.settings.onVisible],
				"onHidden": ctrl.onHidden || ctrl[self.settings.onHidden],
				"onApprove": ctrl.onApprove || ctrl[self.settings.onApprove],
				"onDeny": ctrl.onDeny || ctrl[self.settings.onDeny]
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
			self.element.modal("show");
		};

		Modal.prototype.destroy = function() {
			this.settings = this.scope = null;
			this.element.remove();
		};

		return Modal;

	}
]);

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