var Elements = function () {
  this.pollsFromMyTemplatesContainer = element(by.id('pollsFromMyTemplatesContainer'));
  this.firstPoll = element(by.repeater('myTemplate in myTemplates').row(0));
  this.firstPollType = this.firstPoll.findElement(by.binding('myTemplate.type'));
  this.firstPollTitle = this.firstPoll.findElement(by.binding('myTemplate.title'));
  this.firstPollForkButton = this.firstPoll.findElement(by.css('.forkPollButton'));
  this.newTemplateFromScratchButton = element(by.id("newTemplateFromScratchButton"));
};

var elements;

describe("The list of my templates", function () {

  it("sets up the tests", function () {
    browser.get("default.htm#/createPoll");
    elements = new Elements();
    element(by.id("myTemplatesTab")).click();
    expect(elements.pollsFromMyTemplatesContainer.isDisplayed()).toBeTruthy();
  });

  describe("The first poll in the list", function(){

    it("has poll type", function () {
      expect(elements.firstPollType.getText()).toEqual('Battle Ping');
    });

    it("has poll title", function () {
      expect(elements.firstPollTitle.getText()).toEqual('Join Operation Red Dawn! Bring Ships!');
    });

    it("has a 'fork as new poll' button", function () {
      expect(elements.firstPollForkButton.isDisplayed()).toBeTruthy();
    });

    describe("fork as new poll button", function () {

      it("shows the customize poll screen when clicked", function () {
        elements.firstPollForkButton.click();
        var customizePollContainer = element(by.id('customizePollContainer'));
        expect(customizePollContainer.isDisplayed()).toBeTruthy();
        var title = element(by.model('poll.title'));
        expect(title.getAttribute('value')).toEqual("Join Operation Red Dawn! Bring Ships!");
        var pollSaveCheckPoll = element(by.id('pollSaveCheckPoll'));
        var pollSaveCheckTemplate = element(by.id('pollSaveCheckTemplate'));
        expect(pollSaveCheckPoll.isSelected()).toBeTruthy();
        expect(pollSaveCheckTemplate.isSelected()).toBeFalsy();
      });

    });

  });

  describe("New Template From Scratch button", function(){
    it("is displayed", function(){    
      browser.get("default.htm#/createPoll");
      elements = new Elements();
      element(by.id("myTemplatesTab")).click();
      expect(elements.newTemplateFromScratchButton.isDisplayed()).toBeTruthy();
    });
    it("navigates to the Create New Template / Create New Poll page when clicked", function(){
      elements.newTemplateFromScratchButton.click();
      var containerElement = element(by.id("customizePollContainer"));
      expect(containerElement.isDisplayed()).toBeTruthy();
    });
  });

});
