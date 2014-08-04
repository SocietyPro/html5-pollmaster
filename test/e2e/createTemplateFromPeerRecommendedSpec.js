var Elements = function () {
  this.templatesFromPeerRecommendedContainer = element(by.id('templatesFromPeerRecommendedContainer'));
  /*this.firstTemplate = element(by.repeater('peerTemplate in peerTemplates').row(0));
  this.firstTemplateType = this.firstTemplate.findElement(by.binding('peerTemplate.type'));
  this.firstTemplateTitle = this.firstTemplate.findElement(by.binding('peerTemplate.title'));
  this.firstTemplateForkButton = this.firstTemplate.findElement(by.css('.forkTemplateButton')); */
};

var elements;

describe("The list of peer templates", function () {

  it("sets up the tests", function () {
    browser.get("default.htm#/manageTemplates");
    element(by.id("peerRecommendedTab")).click();

    elements = new Elements();
    expect(elements.templatesFromPeerRecommendedContainer.isDisplayed()).toBeTruthy();
  });

  /* Templates are not yet specified

  it("has template type", function () {
    expect(elements.firstTemplateType.getText()).toEqual('Battle Ping');
  });

  it("has template title", function () {
    expect(elements.firstTemplateTitle.getText()).toEqual('Join Operation Red Dawn!');
  });

  it("has a copy button", function () {
    expect(elements.firstTemplateForkButton.isDisplayed()).toBeTruthy();
  });

  */

});