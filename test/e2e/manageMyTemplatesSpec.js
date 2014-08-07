var Elements = function () {
  this.myTemplatesContainer = element(by.id('myTemplatesContainer'));
  this.firstTemplate = element(by.repeater('myTemplate in myTemplates').row(0));
  this.firstTemplateType = this.firstTemplate.findElement(by.binding('myTemplate.type'));
  this.firstTemplateTitle = this.firstTemplate.findElement(by.binding('myTemplate.title'));
  this.firstTemplateEditButton = this.firstTemplate.findElement(by.css('.editTemplateButton'));
  this.firstTemplateDeleteButton = this.firstTemplate.findElement(by.css('.deleteTemplateButton'));
  this.firstTemplateForkButton = this.firstTemplate.findElement(by.css('.forkTemplateButton'));
};

var elements;

describe("The list of my templates in the template manager", function () {

  it("sets up the tests", function () {
    browser.get("default.htm#/manageTemplates");
    elements = new Elements;
    expect(elements.myTemplatesContainer.isDisplayed()).toBeTruthy();
  });

  it("has template type", function () {
    expect(elements.firstTemplateType.getText()).toEqual('Battle Ping');
  });

  it("has template title", function () {
    expect(elements.firstTemplateTitle.getText()).toEqual('Join Operation Red Dawn! Bring Ships!');
  });

  it("has a delete button", function () {
    expect(elements.firstTemplateDeleteButton.isDisplayed()).toBeTruthy();
    expect(elements.firstTemplateDeleteButton.getText()).toEqual('Delete');
  });

  it("has an edit button", function () {
    expect(elements.firstTemplateEditButton.isDisplayed()).toBeTruthy();
    expect(elements.firstTemplateEditButton.getText()).toEqual('Edit');
  });

  it("has a fork button", function () {
    expect(elements.firstTemplateForkButton.isDisplayed()).toBeTruthy();
    expect(elements.firstTemplateForkButton.getText()).toEqual('Fork this Template')
  });

  it("shows the edit template screen when 'for this template' is clicked", function () {
    elements.firstTemplateForkButton.click();
    var customizePollContainer = element(by.id('customizePollContainer'));
    expect(customizePollContainer.isDisplayed()).toBeTruthy();
    var title = element(by.model('poll.title'));
    expect(title.getAttribute('value')).toEqual('Join Operation Red Dawn! Bring Ships!');
    var pollSaveCheckTemplate = element(by.id('pollSaveCheckTemplate'));
    expect(pollSaveCheckTemplate.isSelected()).toBeTruthy();
  });

});