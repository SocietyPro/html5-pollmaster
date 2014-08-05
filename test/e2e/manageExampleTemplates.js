var Elements = function () {
  this.examplesTab = element(by.id('examplesTab'));
  this.exampleTemplatesContainer = element(by.id('exampleTemplatesContainer'));
  this.firstTemplate = element(by.repeater('exampleTemplate in exampleTemplates').row(0));
  this.firstTemplateType = this.firstTemplate.findElement(by.binding('exampleTemplate.type'));
  this.firstTemplateTitle = this.firstTemplate.findElement(by.binding('exampleTemplate.title'));
  this.firstTemplateForkButton = this.firstTemplate.findElement(by.css('.forkTemplateButton'));
};

var elements;

describe("The list of example templates in the template manager", function () {

  it("sets up the tests", function () {
    browser.get("default.htm#/manageTemplates");
    elements = new Elements();
    elements.examplesTab.click();
    expect(elements.exampleTemplatesContainer.isDisplayed()).toBeTruthy();
  });

  it("has template type", function () {
    expect(elements.firstTemplateType.getText()).toEqual('Battle Ping');
  });

  it("has template title", function () {
    expect(elements.firstTemplateTitle.getText()).toEqual('Join Operation Red Dawn! Bring Ships!');
  });
  it("has a fork button", function () {
    expect(elements.firstTemplateForkButton.isDisplayed()).toBeTruthy();
    expect(elements.firstTemplateForkButton.getText()).toEqual('Fork this Template')
  });

});