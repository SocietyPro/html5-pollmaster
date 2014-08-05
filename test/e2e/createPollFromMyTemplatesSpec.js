var Elements = function () {
  this.pollsFromMyTemplatesContainer = element(by.id('pollsFromMyTemplatesContainer'));
  this.firstPoll = element(by.repeater('myTemplate in myTemplates').row(0));
  this.firstPollType = this.firstPoll.findElement(by.binding('myTemplate.type'));
  this.firstPollTitle = this.firstPoll.findElement(by.binding('myTemplate.title'));
  this.firstPollEditButton = this.firstPoll.findElement(by.css('.editPollButton'));
  this.firstPollCopyButton = this.firstPoll.findElement(by.css('.copyPollButton'));
  this.firstPollDeleteButton = this.firstPoll.findElement(by.css('.deletePollButton'));
  this.newTemplateFromScratchButton = element(by.id("newTemplateFromScratchButton"));
};

var elements;

describe("The list of recent polls", function () {

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

    it("has an edit button", function () {
      expect(elements.firstPollEditButton.isDisplayed()).toBeTruthy();
    });

    it("has a copy button", function () {
      expect(elements.firstPollCopyButton.isDisplayed()).toBeTruthy();
    });

    it("has a delete button", function () {
      expect(elements.firstPollDeleteButton.isDisplayed()).toBeTruthy();
    });

    it("has a delete button", function () {
      expect(elements.firstPollDeleteButton.isDisplayed()).toBeTruthy();
    });

  });

  describe("New Template From Scratch button", function(){
    it("is displayed", function(){
      expect(elements.newTemplateFromScratchButton.isDisplayed()).toBeTruthy();
    });
    it("navigates to the Create New Template / Create New Poll page when clicked", function(){
      elements.newTemplateFromScratchButton.click();
      var containerElement = element(by.id("customizePollContainer"));
      expect(containerElement.isDisplayed()).toBeTruthy();
    });
  });

});
