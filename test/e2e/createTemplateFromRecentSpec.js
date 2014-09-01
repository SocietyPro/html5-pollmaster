var Elements = function () {
  this.recentPollsTab = element(by.id('recentPollsTab'));
  this.recentPollsContainer = element(by.id('templatesFromRecentContainer'));
  this.firstPoll = element(by.repeater('recentPoll in recentPolls').row(0));
  this.firstPollType = this.firstPoll.findElement(by.binding('recentPoll.type'));
  this.firstPollTitle = this.firstPoll.findElement(by.binding('recentPoll.title'));
  this.firstPollForkButton = this.firstPoll.findElement(by.css('.forkTemplateButton'));
};

var elements;

describe("The list of recent polls in the template manager", function () {

  it("sets up the tests", function () {
    browser.get("index.html#/manageTemplates");
    elements = new Elements();
    elements.recentPollsTab.click();
    expect(elements.recentPollsContainer.isDisplayed()).toBeTruthy();
  });

  it("has the poll type", function () {
    expect(elements.firstPollType.getText()).toEqual('Battle Ping');
  });

  it("has the poll title", function () {
    expect(elements.firstPollTitle.getText()).toEqual('Join Operation Red Dawn!')
  });

  it("has a fork button", function () {
    expect(elements.firstPollForkButton.isDisplayed()).toBeTruthy();
    expect(elements.firstPollForkButton.getText()).toEqual('Fork this Template');
  });

  it("shows the edit template screen when 'for this template' is clicked", function () {
    elements.firstPollForkButton.click();
    var customizePollContainer = element(by.id('customizePollContainer'));
    expect(customizePollContainer.isDisplayed()).toBeTruthy();
    var title = element(by.model('poll.title'));
    expect(title.getAttribute('value')).toEqual('Join Operation Red Dawn!');
    var pollSaveCheckTemplate = element(by.id('pollSaveCheckTemplate'));
    expect(pollSaveCheckTemplate.isSelected()).toBeTruthy();
  });

});