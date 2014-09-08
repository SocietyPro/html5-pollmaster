var Elements = function () {
  this.pollsFromExamplesContainer = element(by.id('pollsFromExamplesContainer'));
  this.firstTemplate = element(by.repeater('exampleTemplate in exampleTemplate').row(0));
  this.firstTemplateType = this.firstTemplate.findElement(by.binding('exampleTemplate.type'));
  this.firstTemplateTitle = this.firstTemplate.findElement(by.binding('exampleTemplate.title'));
  this.firstPollCopyButton = this.firstTemplate.findElement(by.css('.copyPollButton'));
};

var elements;

describe("The list of example polls", function () {

  it("sets up the tests", function () {
    browser.get("index.html#/createPoll");
    element(by.id("examplesTab")).click();

    elements = new Elements();
    expect(elements.pollsFromExamplesContainer.isDisplayed()).toBeTruthy();
  });

  it("has poll type", function () {
    expect(elements.firstTemplateType.getText()).toEqual('Battle Ping');
  });

  it("has poll title", function () {
    expect(elements.firstTemplateTitle.getText()).toEqual('Join Operation Red Dawn! Bring Ships!');
  });

  it("has a copy button", function () {
    expect(elements.firstPollCopyButton.isDisplayed()).toBeTruthy();
  });

});
