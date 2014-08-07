var Elements = function () {
  this.templatesFromPeerRecommendedContainer = element(by.id('templatesFromPeerRecommendedContainer'));
  this.firstTemplate = element(by.repeater('peerPoll in peerPolls').row(0));
  this.firstTemplateType = this.firstTemplate.findElement(by.binding('peerPoll.type'));
  this.firstTemplateTitle = this.firstTemplate.findElement(by.binding('peerPoll.title'));
  this.firstTemplateForkButton = this.firstTemplate.findElement(by.css('.forkTemplateButton'));
};

var elements;

describe("The list of peer templates", function () {

  it("sets up the tests", function () {
    browser.get("default.htm#/manageTemplates");
    element(by.id("peerRecommendedTab")).click();

    elements = new Elements();
    expect(elements.templatesFromPeerRecommendedContainer.isDisplayed()).toBeTruthy();
  });

  it("has template type", function () {
    expect(elements.firstTemplateType.getText()).toEqual('Opinion');
  });

  it("has template title", function () {
    expect(elements.firstTemplateTitle.getText()).toEqual('Can the product owner keep up?');
  });

  it("has a 'fork this template' button", function () {
    expect(elements.firstTemplateForkButton.isDisplayed()).toBeTruthy();
  });

  it("shows the edit template screen when 'fork this template' is clicked", function () {
    elements.firstTemplateForkButton.click();
    var customizePollContainer = element(by.id('customizePollContainer'));
    expect(customizePollContainer.isDisplayed()).toBeTruthy();
    var title = element(by.model('poll.title'));
    expect(title.getAttribute('value')).toEqual("Can the product owner keep up?");
    var pollSaveCheckTemplate = element(by.id('pollSaveCheckTemplate'));
    expect(pollSaveCheckTemplate.isSelected()).toBeTruthy();
  });

});