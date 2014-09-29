/**
 * @ngdoc module
 * @name sopro.components.titlebar
 */
angular.module('sopro.components.titlebar', [
  'material.animations',
  'material.services.compiler'
])
  .directive('soproTitlebar', [
    '$$rAF',
    SoProTitlebarDirective
  ]);

/**
* @ngdoc directive
* @name soproTitlebar
* @module sopro.components.titlebar
*
* @restrict E
*
* @description
* The `<sopro-titlebar>` directive is an input element placed at the top of a card app.
*
* @usage
* <hljs lang="html">
* <sopro-titlebar title-hint="Add a group...">
* </sopro-titlebar>
* </hljs>
*
*/
function SoProTitlebarDirective($$rAF) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      titleHint: "@",
    },
    template:
      '<div class="titlebarBox">' +
        '<form name="quickAddForm" style="padding-left:20px;">' +
          '<material-input-group>' +
            '<material-input name="addTitle" class="addTitle" type="text" size="45" ng-model="newTitle" placeholder="{{titleHint}}" flex>' +
          '</material-input-group>' +
          '<div ng-transclude></div>' +
            '<material-button class="titlebarAddButton material-button-colored" ng-show="quickAddForm.$dirty" ng-click="alert">' +
              'SAVE' +
            '</material-button>' +
            '<div class="clearBoth"></div>' +
        '</form>' +
      '</div>',
  };
}