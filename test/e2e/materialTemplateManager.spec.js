var Elements = function () {
  this.quickAddBox = element(by.id('quickAddBox'));
  this.quickAddTitle = element(by.id('quickAddTitle'));
  this.quickAddDescription = element(by.id('quickAddDescription'));
  this.quickAddButton = element(by.id('quickAddButton'));
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

  describe('Tabs',function() {

    it('are displayed',function() {
      expect(browser.isElementPresent(by.tagName('material-tabs'))).toBeTruthy();
      expect(elements.tabs.count()).toEqual(4);
      expect(elements.tabs.get(0).getAttribute('label')).toEqual('My Templates');
      expect(elements.tabs.get(1).getAttribute('label')).toEqual('Copy From Recent Polls');
      expect(elements.tabs.get(2).getAttribute('label')).toEqual('Copy From Examples');
      expect(elements.tabs.get(3).getAttribute('label')).toEqual('Copy From Peer Recommended');      
    });

    describe('My Templates Tab',function(){

      it('should be default tab', function(){
        var firstTabLabel = element.all(by.css('material-tab-label')).get(0);
        expect(firstTabLabel.getAttribute("class")).toEqual('active');
      });

      var templates = element.all(by.css('.mainCard'));
      var firstCard = templates.get(0);
      var firstCardMenuBar = firstCard.findElement(by.css('.cardMenuBar'));
      var firstCardOverflowMenuButton = firstCardMenuBar.findElement(by.css('.overflowMenuButton'));
      var firstCardOverflowMenu = element.all(by.css('.cardholder')).get(0).findElement(by.css('.overflowMenu'));
      var firstCardDeleteAction = element.all(by.css('.cardholder')).get(0).findElement(by.css('.destroyAction'));

      it ('should show my templates', function () {
        var title = firstCard.findElement(by.css('.pollTitleLine'));
        expect(title.getText()).toEqual('Join Operation Red Dawn! Bring Many Ships!');
      });

      it("shows the action bar on hover", function () {
        expect(firstCardMenuBar.isDisplayed()).toBeFalsy();
        browser.actions().
          mouseMove(firstCard).
          perform();
        expect(firstCardMenuBar.isDisplayed()).toBeTruthy();
        browser.actions().
          mouseMove(elements.streamButton.find()).
          perform();
        expect(firstCardMenuBar.isDisplayed()).toBeFalsy();
      });

      describe('overflow menu', function () {
        
        it("is displayed when the overflow menu button is clicked", function () {
          expect(firstCardOverflowMenu.isDisplayed()).toBeFalsy();
          browser.actions().
            mouseMove(firstCard).
            perform();
          firstCardOverflowMenuButton.click();
          expect(firstCardOverflowMenu.isDisplayed()).toBeTruthy();
          browser.actions().
            mouseMove(elements.streamButton.find()).
            perform();
          expect(firstCardOverflowMenu.isDisplayed()).toBeFalsy();
        });

        it("has a delete card action with confirmation dialog", function () {
          browser.actions().
            mouseMove(firstCard).
            perform();
          firstCardOverflowMenuButton.click();
          expect(firstCardDeleteAction.isDisplayed()).toBeTruthy();
          expect(firstCardDeleteAction.getText()).toEqual("Delete");
          expect(templates.count()).toEqual(5);
          firstCardDeleteAction.click();
          var confirmationDialog = browser.switchTo().alert();
          confirmationDialog.accept();
          expect(templates.count()).toEqual(4);
        });

        it("has a fork card action", function () {
          var title = firstCard.findElement(by.css('.pollTitleLine')).getText();
          browser.actions().
            mouseMove(firstCard).
            perform();
          firstCardOverflowMenuButton.click();
          expect(firstCardForkAction.isDisplayed()).toBeTruthy();
          expect(firstCardForkAction.getText()).toEqual("Fork this Template");
          firstCardForkAction.click();
          var dialogTitleInput = element(by.inputName('pollTitleInput'));
          expect(dialogTitleInput.isDisplayed()).toBeTruthy();
          expect(dialogTitleInput.getAttribute('value')).toEqual(title);
        });

      });

    });
    
    describe('Copy from Recent Polls', function () {
      
      beforeEach(function () {      
        elements.tabs.get(1).click();
        browser.sleep(500);
      });
    
      it ('should show my recent polls', function () {
        var title = element.all(by.css('.mainCard')).get(1).findElement(by.css('.pollTitleLine')).getText();
        expect(title).toEqual('What is your favorite Snack?');
      });
    
      it("has a fork card action", function () {
        var firstCard = element.all(by.css('.mainCard')).get(0);
        var firstCardMenuBar = firstCard.findElement(by.css('.cardMenuBar'));
        var firstCardForkAction = element.all(by.css('.cardholder')).get(0).findElement(by.css('.forkAction'));
        browser.actions().
          mouseMove(firstCard).
          perform();
        firstCardOverflowMenuButton.click();
        expect(firstCardForkAction.isDisplayed()).toBeTruthy();
        expect(firstCardForkAction.getText()).toEqual("Fork this Template");
        firstCardForkAction.click();
        var dialogTitleInput = element(by.inputName('pollTitleInput'));
        expect(dialogTitleInput.isDisplayed()).toBeTruthy();
        expect(dialogTitleInput.getAttribute('value')).toEqual(title);
      });
    
    });

    describe('Copy from Examples', function() {
      
      beforeEach(function () {
        elements.tabs.get(2).click();
        browser.sleep(500);        
      });

      it ('should show my examples templates', function () {
        var title = element.all(by.css('.mainCard')).get(1).findElement(by.css('.pollTitleLine')).getText();
        expect(title).toEqual('President of the Organization');
      });

      it("has a fork card action", function () {
        var firstCard = element.all(by.css('.mainCard')).get(0);
        var firstCardMenuBar = firstCard.findElement(by.css('.cardMenuBar'));
        var firstCardForkAction = element.all(by.css('.cardholder')).get(0).findElement(by.css('.forkAction'));
        browser.actions().
          mouseMove(firstCard).
          perform();
        firstCardOverflowMenuButton.click();
        expect(firstCardForkAction.isDisplayed()).toBeTruthy();
        expect(firstCardForkAction.getText()).toEqual("Fork this Template");
        firstCardForkAction.click();
        var dialogTitleInput = element(by.inputName('pollTitleInput'));
        expect(dialogTitleInput.isDisplayed()).toBeTruthy();
        expect(dialogTitleInput.getAttribute('value')).toEqual(title);
      });

    });

    describe('Copy from Peer Recommended', function() {

      beforeEach(function () {
        elements.tabs.get(3).click();
        browser.sleep(500);
      });

      it ('should show peer recommendations', function () {
        var title = element.all(by.css('.mainCard')).get(0).findElement(by.css('.pollTitleLine')).getText();
        expect(title).toEqual('Can the Product Owner keep up?');
      });

      it("has a fork card action", function () {
        var firstCard = element.all(by.css('.mainCard')).get(0);
        var firstCardMenuBar = firstCard.findElement(by.css('.cardMenuBar'));
        var firstCardForkAction = element.all(by.css('.cardholder')).get(0).findElement(by.css('.forkAction'));
        browser.actions().
          mouseMove(firstCard).
          perform();
        firstCardOverflowMenuButton.click();
        expect(firstCardForkAction.isDisplayed()).toBeTruthy();
        expect(firstCardForkAction.getText()).toEqual("Fork this Template");
        firstCardForkAction.click();
        var dialogTitleInput = element(by.inputName('pollTitleInput'));
        expect(dialogTitleInput.isDisplayed()).toBeTruthy();
        expect(dialogTitleInput.getAttribute('value')).toEqual(title);
      });

    });

  });
  
  describe("top toolbar", function () {
  
    it("has list view buttons", function() {
      expect(elements.viewButtons.isDisplayed()).toBeTruthy();
      expect(elements.streamButton.getAttribute('class')).toEqual('viewButton material-button-icon inactive');
      expect(elements.quiltButton.getAttribute('class')).toEqual('viewButton material-button-icon active');
      elements.streamButton.click();
      expect(elements.streamButton.getAttribute('class')).toEqual('viewButton material-button-icon active');
      expect(elements.quiltButton.getAttribute('class')).toEqual('viewButton material-button-icon inactive');
    });

  });

});