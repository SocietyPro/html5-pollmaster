var Elements = function () {
  this.pollsFromRecentContainer = element(by.id('pollsFromRecentContainer'));
  this.firstPoll = element(by.repeater('recentPoll in recentPolls').row(0));
  this.firstPollType = this.firstPoll.findElement(by.binding('recentPoll.type'));
  this.firstPollTitle = this.firstPoll.findElement(by.binding('recentPoll.title'));
  this.firstPollCopyButton = this.firstPoll.findElement(by.css('.copyPollButton'));
};

var elements;

describe("The list of recent polls", function () {

  it("sets up the tests", function () {
    browser.get("index.html#/createPoll");
    element(by.id("recentTab")).click();
    elements = new Elements();
    expect(elements.pollsFromRecentContainer.isDisplayed()).toBeTruthy();
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
