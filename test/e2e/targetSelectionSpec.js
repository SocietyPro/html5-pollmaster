var indexFile = "index.html";
var Elements = function () {
  this.targetSelectionContainer = element(by.id('targetSelectionContainer'));
  this.targetPaneTabs = element(by.id('targetPaneTabs')); // 
  this.targetSelect = element(by.css('#targetPaneList select'));
  this.targetHint = element(by.css('#targetPaneList h4'));
  this.targetTabs = element.all(by.css('.targetTab'));
  this.targetPaneList = element(by.id('targetPaneList'));
  this.chatGroupsContainer = element(by.id('chatGroupsContainer'));
  this.peerListsContainer = element(by.id('peerListsContainer'));
  this.firstChatGroup = element(by.repeater('chatGroup in chatGroups').row(0));
  this.firstPeerGroup = element(by.repeater('peerList in peerLists').row(0));
};

var elements;

describe("Target Selection Partial", function () {

  it("sets up the test page", function () {
    browser.get(indexFile + '#/createPoll/customize');
    elements = new Elements();
    expect(elements.targetSelectionContainer.isDisplayed()).toBeTruthy();
  });

  describe("Poll Target Selection section", function () {

    it("displays #targetSelectionContainer", function () {
      expect(elements.targetSelectionContainer.isDisplayed()).toBeTruthy();
    });

    describe("#targetPaneTabs", function(){
      it("displays the target tab container on the left", function () {
        expect(elements.targetPaneTabs.isDisplayed()).toBeTruthy();
      });

      it("displays three .targetTab : Peer, Group, List", function () {
        expect(elements.targetTabs.get(0).isDisplayed()).toBeTruthy();
        expect(elements.targetTabs.get(0).getText()).toEqual('Peer');
        expect(elements.targetTabs.get(1).isDisplayed()).toBeTruthy();
        expect(elements.targetTabs.get(1).getText()).toEqual('Group');
        expect(elements.targetTabs.get(2).isDisplayed()).toBeTruthy();
        expect(elements.targetTabs.get(2).getText()).toEqual('List');
      });

      describe("target tabs", function(){

        it("applies .targeting to the first tab, Peer, on page load", function(){
          browser.get(indexFile + '#/createPoll/customize');
          elements = new Elements();
          var targetingTabs = element.all(by.css('.targeting'));
          expect(targetingTabs.count()).toBe(1);
          expect(targetingTabs.first().getText()).toEqual('Peer');
        });

        it("applies .targeting to only the clicked tab", function(){
          var groupTab = element.all(by.css('.targetTab')).get(1);
          groupTab.click();
          var targetingTabs = element.all(by.css('.targeting'));
          expect(targetingTabs.count()).toBe(1);
          var firstTargetedTab = targetingTabs.first(); 
          expect(firstTargetedTab.getText()).toEqual(groupTab.getText());
        });

      });




    });

    describe("target list", function(){
      it("displays the right div #targetPaneList", function () {
        expect(elements.targetPaneList.isDisplayed()).toBeTruthy();
      });

      describe("target hint", function(){
        it("is displayed", function () {
          expect(elements.targetHint.isDisplayed()).toBeTruthy();
        });

        it("changes when .targetTab 's are clicked", function(){
          elements.targetTabs.get(0).click();
          expect(elements.targetHint.getText()).toEqual("Choose one target Peer:");
          elements.targetTabs.get(1).click();
          expect(elements.targetHint.getText()).toEqual("Choose one target Group:");
          elements.targetTabs.get(2).click();
          expect(elements.targetHint.getText()).toEqual("Choose one target Peer List:");
        });
      });

      describe("target select element", function(){
        it("is displayed", function () {
          expect(elements.targetSelect.isDisplayed()).toBeTruthy();
        });

        it("displays a list of peers after clicking the peer tab", function(){
          elements.targetTabs.get(0).click();
          var options = element.all(by.css("#targetPaneList option"));
          expect(options.first().getText()).toEqual("plato");
        });
        
        it("displays a list of groups after clicking the group tab", function(){
          elements.targetTabs.get(1).click();
          var options = element.all(by.css("#targetPaneList option"));
          expect(options.first().getText()).toEqual("Cambrian Devs");
        });
        
        it("displays a list of peerLists after clicking the list tab", function(){
          elements.targetTabs.get(2).click();
          var options = element.all(by.css("#targetPaneList option"));
          expect(options.first().getText()).toEqual("My Marketing List");
        });

        /* I think this needs to be a unit test so we can clear
         * $scope.targetChoices 
        it("disables the selector if targetChoices is empty", function(){
          elements.targetTabs.get(2).click();
        });
        */

      });

    });

    /*
    it("displays the container", function () {
      expect(elements..isDisplayed()).toBeTruthy();
    });
    */
  });


});
