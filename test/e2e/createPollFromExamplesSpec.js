var Elements = function () {
  this.pollsFromExamplesContainer = element(by.id('pollsFromExamplesContainer'));
  this.firstPoll = element(by.repeater('examplePoll in examplePolls').row(0));
  this.firstPollType = this.firstPoll.findElement(by.binding('examplePoll.type'));
  this.firstPollTitle = this.firstPoll.findElement(by.binding('examplePoll.title'));
  this.firstPollCopyButton = this.firstPoll.findElement(by.css('.copyPollButton'));
};

var elements;

describe("The list of example polls", function () {

  it("sets up the tests", function () {
    browser.get("default.htm#/createPoll");
    element(by.id("examplesTab")).click();

    elements = new Elements();
    expect(elements.pollsFromExamplesContainer.isDisplayed()).toBeTruthy();
  });

  it("has poll type", function () {
    expect(elements.firstPollType.getText()).toEqual('Battle Ping');
  });

  it("has poll title", function () {
    expect(elements.firstPollTitle.getText()).toEqual('Join Operation Red Dawn!');
  });

  it("has a copy button", function () {
    expect(elements.firstPollCopyButton.isDisplayed()).toBeTruthy();
  });

});
