var Elements = function () {
  this.menuDrawerButton = element(by.id('menu-drawer-button'));
  this.pollsButton = element(by.id('pollsButton'));
  this.templatesButton = element(by.id('templatesButton'));
  this.quickAddBox = element(by.id('quickAddBox'));
  this.quickAddTitle = element(by.id('quickAddTitle'));
  this.quickAddDescription = element(by.id('quickAddDescription'));
  this.quickAddButton = element(by.id('quickAddButton'));
  this.fab = element(by.css('.material-button-fab'));
  this.templateCards = element.all(by.css('.mainCard'));
  this.tabs = element.all(by.tagName('material-tab'));
  this.viewButtons = element(by.id('viewButtons'));
  this.streamButton = element(by.id('streamButton'));
  this.quiltButton = element(by.id('quiltButton'));
};

var elements;

describe('template manager', function () {

  beforeEach(function() {
    browser.get('index.html#/templates');
    elements = new Elements();
  });	

  by.addLocator('inputName', function (name) {
    var using = document,
        inputs = using.querySelectorAll('input');
    return Array.prototype.filter.call(inputs, function (input) {
      return input.name === name;
    })
  });

  it('has a quick add poll template form',function () {
    expect(elements.quickAddBox.isDisplayed()).toBeTruthy();
    expect(elements.quickAddTitle.isDisplayed()).toBeTruthy();
    expect(elements.quickAddDescription.isDisplayed()).toBeFalsy();
    expect(elements.quickAddButton.isDisplayed()).toBeFalsy();
    elements.quickAddTitle.click();
    expect(elements.quickAddDescription.isDisplayed()).toBeTruthy();
    expect(elements.quickAddButton.isDisplayed()).toBeFalsy();
    elements.quickAddTitle.sendKeys('New Template Title');
    elements.quickAddDescription.sendKeys('New Template Description');
    expect(elements.quickAddTitle.getCssValue('font-weight')).toEqual('bold');
    expect(elements.quickAddButton.isDisplayed()).toBeTruthy();
    expect(browser.isElementPresent(by.model('poll.title'))).toBeFalsy();
    elements.quickAddButton.click();
    expect(browser.isElementPresent(by.model('poll.title'))).toBeTruthy();
    var newTemplateTitleInput = element(by.model('poll.title'));
    var newTemplateDescriptionInput = element(by.model('poll.description'));
    expect(newTemplateTitleInput.getAttribute('value')).toEqual('New Template Title');
    expect(newTemplateTitleInput.getCssValue('font-weight')).toEqual('bold');
    expect(newTemplateDescriptionInput.getAttribute('value')).toEqual('New Template Description');
    expect(elements.quickAddTitle.isDisplayed()).toBeTruthy();
    expect(elements.quickAddTitle.getAttribute('value')).toEqual('');
    expect(elements.quickAddDescription.isDisplayed()).toBeFalsy();
    expect(elements.quickAddButton.isDisplayed()).toBeFalsy();
  });

  describe("quick add template form", function () {

    it("starts the dialog sequence of making a new template", function () {
      expect(elements.templateCards.count()).toEqual(5);
      elements.quickAddTitle.click();
      elements.quickAddTitle.sendKeys('New Template Title');
      elements.quickAddDescription.sendKeys('New Template Description');
      elements.quickAddButton.click();
      browser.sleep(500);
      element(by.id('saveButton')).click();
      expect(elements.templateCards.count()).toEqual(6);
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.pollsButton.click();
      var pollCards = element.all(by.css('.mainCard'));
      expect(pollCards.count()).toEqual(5);
    });

    it("starts the dialog sequence of making a new poll and template", function () {
      expect(elements.templateCards.count()).toEqual(5);
      elements.quickAddTitle.click();
      elements.quickAddTitle.sendKeys('New Template Title');
      elements.quickAddDescription.sendKeys('New Template Description');
      elements.quickAddButton.click();
      browser.sleep(500);
      element(by.css('.menuDrawerButton')).click();
      element(by.model('saveMatrix[1]')).click();
      element(by.id('nextButton')).click();
      element(by.id('saveButton')).click();
      expect(elements.templateCards.count()).toEqual(6);
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.pollsButton.click();
      var pollCards = element.all(by.css('.mainCard'));
      expect(pollCards.count()).toEqual(6);
    });

    it("starts the dialog sequence of making a new poll", function () {
      expect(elements.templateCards.count()).toEqual(5);
      elements.quickAddTitle.click();
      elements.quickAddTitle.sendKeys('New Template Title');
      elements.quickAddDescription.sendKeys('New Template Description');
      elements.quickAddButton.click();
      browser.sleep(500);
      element(by.css('.menuDrawerButton')).click();
      element(by.model('saveMatrix[3]')).click();
      element(by.model('saveMatrix[1]')).click();
      element(by.id('nextButton')).click();
      element(by.id('saveButton')).click();
      expect(elements.templateCards.count()).toEqual(5);
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.pollsButton.click();
      var pollCards = element.all(by.css('.mainCard'));
      expect(pollCards.count()).toEqual(6);
    });

  });

  it("has an add template fab", function () {
    expect(elements.fab.isDisplayed()).toBeTruthy();
    expect(browser.isElementPresent(by.model('poll.title'))).toBeFalsy();
    elements.fab.click();
    expect(browser.isElementPresent(by.model('poll.title'))).toBeTruthy();
  });

  describe("add template fab", function () {

    it("starts the dialog sequence of making a new template", function () {
      expect(elements.templateCards.count()).toEqual(5);
      elements.fab.click();    
      var newPollTitleInput = element(by.model('poll.title'));
      var newPollDescriptionInput = element(by.model('poll.description'));
      newPollTitleInput.sendKeys('New Template Title');
      newPollDescriptionInput.sendKeys('New Template Description');
      element(by.id('saveButton')).click();
      expect(elements.templateCards.count()).toEqual(6);
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.pollsButton.click();
      var pollCards = element.all(by.css('.mainCard'));
      expect(pollCards.count()).toEqual(5);
    });

    it("starts the dialog sequence of making a new poll and template", function () {
      expect(elements.templateCards.count()).toEqual(5);
      elements.fab.click();    
      var newPollTitleInput = element(by.model('poll.title'));
      var newPollDescriptionInput = element(by.model('poll.description'));
      newPollTitleInput.sendKeys('New Template Title');
      newPollDescriptionInput.sendKeys('New Template Description');
      element(by.css('.menuDrawerButton')).click();
      element(by.model('saveMatrix[1]')).click();
      element(by.id('nextButton')).click();
      element(by.id('saveButton')).click();
      expect(elements.templateCards.count()).toEqual(6);
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.pollsButton.click();
      var pollCards = element.all(by.css('.mainCard'));
      expect(pollCards.count()).toEqual(6);
    });

    it("starts the dialog sequence of making a new poll", function () {
      expect(elements.templateCards.count()).toEqual(5);
      elements.fab.click();    
      var newPollTitleInput = element(by.model('poll.title'));
      var newPollDescriptionInput = element(by.model('poll.description'));
      newPollTitleInput.sendKeys('New Template Title');
      newPollDescriptionInput.sendKeys('New Template Description');
      element(by.css('.menuDrawerButton')).click();
      element(by.model('saveMatrix[3]')).click();
      element(by.model('saveMatrix[1]')).click();
      element(by.id('nextButton')).click();
      element(by.id('saveButton')).click();
      expect(elements.templateCards.count()).toEqual(5);
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.pollsButton.click();
      var pollCards = element.all(by.css('.mainCard'));
      expect(pollCards.count()).toEqual(6);
    });

  });

  describe('Tabs',function() {

    it('are displayed',function() {
      expect(browser.isElementPresent(by.tagName('material-tabs'))).toBeTruthy();
      expect(elements.tabs.count()).toEqual(4);
      expect(elements.tabs.get(0).getAttribute('label')).toEqual('My Templates');
      expect(elements.tabs.get(1).getAttribute('label')).toEqual('Copy From Recent Polls');
      expect(elements.tabs.get(2).getAttribute('label')).toEqual('Copy From Examples');
      expect(elements.tabs.get(3).getAttribute('label')).toEqual('Copy From Peer Recommended');      
    });
  
  });

  describe('tab for my templates',function(){

    it('is the default tab', function(){
      var firstTabLabel = element.all(by.css('material-tab-label')).get(0);
      expect(firstTabLabel.getAttribute("class")).toEqual('active');
    });

    it ('shows my templates', function () {
      var expectedTitle = "Join Operation Red Dawn! Bring Ships!";
      var title = element.all(by.css('.mainCard')).get(0).findElement(by.css('.pollTitleLine'));
      expect(title.getText()).toEqual(expectedTitle);
    });

  });
  
  describe('tab for Copy from Recent Polls', function () {
      
    it ('shows my recent polls', function () {    
      var expectedTitle = "What is your favorite Snack?";
      elements.tabs.get(1).click();
      browser.sleep(500);
      var title = element.all(by.css('.mainCard')).get(1).findElement(by.css('.pollTitleLine')).getText();
      expect(title).toEqual(expectedTitle);
    });
  
  });

  describe('tab for Copy from Examples', function() {

    it ('shows my examples templates', function () {
      var expectedTitle = "President of the Organization";
      elements.tabs.get(2).click();
      browser.sleep(500);  
      var title = element.all(by.css('.mainCard')).get(1).findElement(by.css('.pollTitleLine')).getText();
      expect(title).toEqual(expectedTitle);
    });

  });

  describe('tab for Copy from Peer Recommended', function() {

    it ('shows peer recommendations', function () {
      var expectedTitle = "Can the Product Owner keep up?";
      elements.tabs.get(3).click();
      browser.sleep(500);
      var title = element.all(by.css('.mainCard')).get(0).findElement(by.css('.pollTitleLine')).getText();
      expect(title).toEqual(expectedTitle);
    });

  });

  describe('template card', function () {

    var TemplateCardElements = function () {
      this.firstCard = element.all(by.css('.mainCard')).get(0);
      this.firstCardMenuBar = this.firstCard.findElement(by.css('.cardMenuBar'));
      this.firstCardOverflowMenuButton = this.firstCardMenuBar.findElement(by.css('.overflowMenuButton'));
      this.firstCardOverflowMenu = element.all(by.css('.cardholder')).get(0).findElement(by.css('.overflowMenu'));
      this.firstCardForkAction = element.all(by.css('.cardholder')).get(0).findElement(by.css('.forkAction'));
    }

    var templateCardElements;

    beforeEach(function () {
      templateCardElements = new TemplateCardElements();
    });

    it("shows the action bar on hover", function () {
      expect(templateCardElements.firstCardMenuBar.isDisplayed()).toBeFalsy();
      browser.actions().
        mouseMove(templateCardElements.firstCard).
        perform();
      expect(templateCardElements.firstCardMenuBar.isDisplayed()).toBeTruthy();
      browser.actions().
        mouseMove(elements.streamButton.find()).
        perform();
      expect(templateCardElements.firstCardMenuBar.isDisplayed()).toBeFalsy();
    });

    describe('overflow menu', function () {
      
      it("is displayed when the overflow menu button is clicked", function () {
        expect(templateCardElements.firstCardOverflowMenu.isDisplayed()).toBeFalsy();
        browser.actions().
          mouseMove(templateCardElements.firstCard).
          perform();
        templateCardElements.firstCardOverflowMenuButton.click();
        expect(templateCardElements.firstCardOverflowMenu.isDisplayed()).toBeTruthy();
        browser.actions().
          mouseMove(elements.streamButton.find()).
          perform();
        expect(templateCardElements.firstCardOverflowMenu.isDisplayed()).toBeFalsy();
      });

      it("does not have a delete card action if the card is not for one of my templates", function () {
        element.all(by.css('material-tab')).get(1).click();
        var templateCardElements = new TemplateCardElements();
        browser.actions().
          mouseMove(templateCardElements.firstCard).
          perform();
        templateCardElements.firstCardOverflowMenuButton.click();
        expect(browser.isElementPresent(by.css('.destroyAction'))).toBeFalsy();
      });

      it("has a delete card action with confirmation dialog if the card is for one of my templates", function () {
        browser.actions().
          mouseMove(templateCardElements.firstCard).
          perform();
        templateCardElements.firstCardOverflowMenuButton.click();
        var firstCardDeleteAction = element.all(by.css('.cardholder')).get(0).findElement(by.css('.destroyAction'));
        expect(firstCardDeleteAction.isDisplayed()).toBeTruthy();
        expect(firstCardDeleteAction.getText()).toEqual("Delete");
        expect(element.all(by.css('.mainCard')).count()).toEqual(5);
        firstCardDeleteAction.click();
        var confirmationDialog = browser.switchTo().alert();
        confirmationDialog.accept();
        expect(element.all(by.css('.mainCard')).count()).toEqual(4);
      });

      it("has a fork card action", function () {
        var title = templateCardElements.firstCard.findElement(by.css('.pollTitleLine')).getText();
        browser.actions().
          mouseMove(templateCardElements.firstCard).
          perform();
        templateCardElements.firstCardOverflowMenuButton.click();
        expect(templateCardElements.firstCardForkAction.isDisplayed()).toBeTruthy();
        expect(templateCardElements.firstCardForkAction.getText()).toEqual("Fork this Template");
        templateCardElements.firstCardForkAction.click();
        var dialogTitleInput = element(by.inputName('pollTitleInput'));
        expect(dialogTitleInput.isDisplayed()).toBeTruthy();
        expect(dialogTitleInput.getAttribute('value')).toEqual(title);
      });

    });
    
    it("zooms to the template edit dialog if the card is for one of my templates", function () {
      expect(browser.isElementPresent(by.model('poll.title'))).toBeFalsy();
      templateCardElements.firstCard.click();
      expect(browser.isElementPresent(by.model('poll.title'))).toBeTruthy();      
    });

    it("zooms to the template details card if the card is not for one of my templates", function () {
      element.all(by.css('material-tab')).get(1).click();
      var templateCardElements = new TemplateCardElements();
      templateCardElements.firstCard.click();
      expect(browser.isElementPresent(by.model('poll.title'))).toBeFalsy();
    });

  });

});