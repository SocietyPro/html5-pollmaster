var Elements = function () {
  this.fab = element(by.css('.material-button-fab'));
  this.pollCards = element.all(by.css('.mainCard'));
};

var EditCardElements = function () {
  this.materialDialog = element(by.css('material-dialog'));
  this.pollTitleInput = element(by.inputName('pollTitleInput'));
  this.pollDescriptionInput = element(by.model('poll.description'));
  this.addOptionInput = element(by.id('addOptionInput'));
  this.options = element.all(by.repeater('opt in poll.options'));
  this.closeButton = element(by.id('closeButton'));
  this.nextButton = element(by.id('nextButton'));
  this.menuDrawerButton = element(by.css('.menuDrawerButton'));
  this.ballotPreviewButton = element(by.css('.ballotPreviewButton'));
  this.optionsMenu = element(by.id('optionsMenu'));
  this.multipleSelectionsCheckbox = element(by.model('poll.allowMultipleChoices'));
  this.commentsCheckbox = element(by.model('poll.allowComments'));
  this.resultsOnBallotsCheckbox = element(by.model('poll.showResults'));
  this.saveAsTemplateCheckbox = element(by.model('saveMatrix[3]'));
  this.saveAsPollCheckbox = element(by.model('saveMatrix[1]'));
  this.pollEndsOptions = element(by.css('.dialog-options-poll-ends'));
  this.ballotPreview = element(by.id('ballotPreview'));
};  

var elements;
var editCardElements;

describe("poll editing card", function () {

  beforeEach(function () {
    browser.get('index.html');
    elements = new Elements();
    elements.fab.click();
    browser.sleep(500);
    editCardElements = new EditCardElements();
  });

  it("has inputs for poll title and poll description", function () {
    expect(editCardElements.pollTitleInput.isDisplayed()).toBeTruthy();
    expect(editCardElements.pollDescriptionInput.isDisplayed()).toBeTruthy();
  });

  it("has an input to add options", function () {
    expect(editCardElements.options.count()).toEqual(0);
    editCardElements.addOptionInput.sendKeys('a');
    expect(editCardElements.options.count()).toEqual(1);
  });

  it("removes options when all text is deleted", function () {
    editCardElements.addOptionInput.sendKeys('a');
    editCardElements.addOptionInput.sendKeys('b');

    var firstOptionInput = element.all(by.css('.optionsLine')).get(0).findElement(by.model('opt.text'));
    var firstOptionCheckbox = element.all(by.css('.optionsLine')).get(0).findElement(by.model('opt.remove'));
    var secondOptionInput = element.all(by.css('.optionsLine')).get(1).findElement(by.model('opt.text'));
    var secondOptionCheckbox = element.all(by.css('.optionsLine')).get(1).findElement(by.model('opt.remove'));

    firstOptionInput.sendKeys(" - Option to remove");
    secondOptionInput.sendKeys(" - Option to save");
    expect(editCardElements.options.count()).toEqual(2);
    expect(firstOptionInput.getAttribute('value')).toEqual("a - Option to remove");
    firstOptionInput.clear();
    expect(editCardElements.options.count()).toEqual(2);
    expect(firstOptionInput.getAttribute('value')).toEqual("");
    firstOptionInput.sendKeys(protractor.Key.BACK_SPACE);
    firstOptionInput.sendKeys(protractor.Key.BACK_SPACE);
    browser.sleep(500);
    firstOptionInput = element.all(by.css('.optionsLine')).get(0).findElement(by.model('opt.text'));
    expect(editCardElements.options.count()).toEqual(1);
    expect(firstOptionInput.getAttribute('value')).toEqual("b - Option to save");
  });

  it("has a close dialog button", function () {
    expect(editCardElements.materialDialog.isDisplayed()).toBeTruthy();
    expect(editCardElements.closeButton.isDisplayed()).toBeTruthy();
    editCardElements.closeButton.click();
    expect(browser.isElementPresent(by.css('material-dialog'))).toBeFalsy();
  });

  it("has a next button if save as poll option is selected", function () {
    expect(browser.isElementPresent(by.model('poll.target'))).toBeFalsy();
    expect(editCardElements.nextButton.isDisplayed()).toBeTruthy();
    editCardElements.nextButton.click();
    browser.sleep(500);
    expect(browser.isElementPresent(by.model('poll.target'))).toBeTruthy();
  });
  
  describe("advanced options menu", function () {

    it("is closed by default and opened and closed by the menuDrawerButton", function () {
      expect(browser.isElementPresent(by.id('ballotPreview'))).toBeFalsy();
      expect(editCardElements.menuDrawerButton.isDisplayed()).toBeTruthy();
      editCardElements.menuDrawerButton.click();
      browser.sleep(500);
      expect(browser.isElementPresent(by.id('ballotPreview'))).toBeFalsy();
      editCardElements.menuDrawerButton.click();
      browser.sleep(500);
      expect(browser.isElementPresent(by.id('ballotPreview'))).toBeFalsy();
    });

    describe("ballot options section", function () {

      beforeEach(function () {        
        editCardElements.menuDrawerButton.click();
        browser.sleep(500);
      });

      it("has a checkbox and label for multiple selections", function () {
        expect(editCardElements.multipleSelectionsCheckbox.isDisplayed()).toBeTruthy();
        expect(editCardElements.multipleSelectionsCheckbox.getText()).toEqual('Multiple selections');
        expect(editCardElements.multipleSelectionsCheckbox.getAttribute('aria-checked')).toEqual('false');
        editCardElements.multipleSelectionsCheckbox.click();
        expect(editCardElements.multipleSelectionsCheckbox.getAttribute('aria-checked')).toEqual('true');
      });

      it("has a checkbox and label for allowing commments", function () {
        expect(editCardElements.commentsCheckbox.isDisplayed()).toBeTruthy();
        expect(editCardElements.commentsCheckbox.getText()).toEqual('Comments');
        expect(editCardElements.commentsCheckbox.getAttribute('aria-checked')).toEqual('false');
        editCardElements.commentsCheckbox.click();
        expect(editCardElements.commentsCheckbox.getAttribute('aria-checked')).toEqual('true');
      });

      it("has a checkbox and label for showing results on ballots", function () {
        expect(editCardElements.resultsOnBallotsCheckbox.isDisplayed()).toBeTruthy();
        expect(editCardElements.resultsOnBallotsCheckbox.getText()).toEqual('Show results on ballots');
        expect(editCardElements.resultsOnBallotsCheckbox.getAttribute('aria-checked')).toEqual('false');
        editCardElements.resultsOnBallotsCheckbox.click();
        expect(editCardElements.resultsOnBallotsCheckbox.getAttribute('aria-checked')).toEqual('false');
      });

    });

    describe("save options section", function () {

      beforeEach(function () {        
        editCardElements.menuDrawerButton.click();
        browser.sleep(500);
      });

      it("has a checkbox and label for saving as a poll", function () {
        expect(editCardElements.saveAsPollCheckbox.isDisplayed()).toBeTruthy();
        expect(editCardElements.saveAsPollCheckbox.getText()).toEqual('Save as Poll');
        expect(editCardElements.saveAsPollCheckbox.getAttribute('aria-checked')).toEqual('true');
        expect(browser.isElementPresent(by.id('nextButton'))).toBeTruthy();
        editCardElements.saveAsPollCheckbox.click();
        expect(editCardElements.saveAsPollCheckbox.getAttribute('aria-checked')).toEqual('false');
        expect(browser.isElementPresent(by.id('nextButton'))).toBeFalsy();
      });

      it("has a checkbox and label for saving as a template", function () {
        expect(editCardElements.saveAsTemplateCheckbox.isDisplayed()).toBeTruthy();
        expect(editCardElements.saveAsTemplateCheckbox.getText()).toEqual('Save as Template');
        expect(editCardElements.saveAsTemplateCheckbox.getAttribute('aria-checked')).toEqual('false');
        expect(browser.isElementPresent(by.id('saveButton'))).toBeFalsy();
        editCardElements.saveAsTemplateCheckbox.click();
        expect(editCardElements.saveAsTemplateCheckbox.getAttribute('aria-checked')).toEqual('true');
        expect(browser.isElementPresent(by.id('saveButton'))).toBeFalsy();
        editCardElements.saveAsPollCheckbox.click();
        expect(browser.isElementPresent(by.id('saveButton'))).toBeTruthy();
      });

    });

    describe("poll ends section", function () {

      beforeEach(function () {        
        editCardElements.menuDrawerButton.click();
        browser.sleep(500);
      });

      it("has date and time inputs", function () {
        expect(editCardElements.pollEndsOptions.isDisplayed()).toBeTruthy();
      });

    });
    
  });

  describe("ballot preview", function () {

    it("is closed by default and opened and closed with the ballot preview button", function () {
      expect(editCardElements.ballotPreviewButton.isDisplayed()).toBeTruthy();
      expect(browser.isElementPresent(by.id('ballotPreview'))).toBeFalsy();
      editCardElements.ballotPreviewButton.click();
      browser.sleep(500);
      expect(browser.isElementPresent(by.id('ballotPreview'))).toBeTruthy();
    });

  });
  
});

ddescribe("target selection dialog", function () {

  beforeEach(function () {
    browser.get('index.html');
    elements.fab.click();
    browser.sleep(500);
    element(by.id('nextButton')).click();
    browser.sleep(500);
    var targetSelect = element(by.model('poll.target'));
    var startImmediatelyCheckbox = element(by.id('startImmediatelyCheckbox'));
    var closeButton = element(by.id('closeButton'));
    var saveButton = element(by.id('saveButton'));
  });

  it("has a target selection dropdown", function () {
    expect(targetSelect.isDisplayed()).toBeTruthy();
  });

  it("has a 'start immediately' option", function () {
    expect(startImmediatelyCheckbox.isDisplayed()).toBeTruthy();
    expect(startImmediatelyCheckbox.getAttribute('disabled')).toBeTruthy();
    targetSelect.select[0];
    expect(startImmediatelyCheckbox.getAttribute('disabled')).toBeFalsy();
  });

  it("has a close button", function () {
    expect(elements.pollCards.count()).toEqual(5);
    closeButton.click();
    browser.sleep(500);
    expect(elements.pollCards.count()).toEqual(5);
  });

  it("has a save button", function () {
    expect(elements.pollCards.count()).toEqual(5);
    saveButton.click();
    browser.sleep(500);
    expect(elements.pollCards.count()).toEqual(6);
  });

});