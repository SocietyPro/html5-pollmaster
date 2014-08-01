var Elements = function () {
  this.pollsFromPeerRecommendedContainer = element(by.id('pollsFromPeerRecommendedContainer'));
  this.firstPoll = element(by.repeater('peerPoll in peerPolls').row(0));
  this.firstPollType = this.firstPoll.findElement(by.binding('peerPoll.type'));
  this.firstPollTitle = this.firstPoll.findElement(by.binding('peerPoll.title'));
  this.firstPollCopyButton = this.firstPoll.findElement(by.css('.copyPollButton'));
};

var elements;

describe("The list of peer polls", function () {

  it("sets up the tests", function () {
    browser.get("default.htm#/createPoll");
    element(by.id("peerRecommendedTab")).click();

    elements = new Elements();
    expect(elements.pollsFromPeerRecommendedContainer.isDisplayed()).toBeTruthy();
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
