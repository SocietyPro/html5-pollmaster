var Elements = function () {
  this.quickAddBox = element(by.id('quickAddBox'));
  this.quickAddTitle = element(by.id('quickAddTitle'));
  this.quickAddDescription = element(by.id('quickAddDescription'));
  this.quickAddButton = element(by.id('quickAddButton'));
  this.tabs = element.all(by.tagName('material-tabs'));
  this.viewButtons = element(by.id('viewButtons'));
  this.streamButton = element(by.id('streamButton'));
  this.quiltButton = element(by.id('quiltButton'));
}
var elements;
describe('template manager', function () {
  beforeEach(function() {
    browser.get('index.html#/templates');
    elements = new Elements();
  });	

  it('has a quick add poll template form',function () {
    expect(browser.isElementPresent(by.model('template.title'))).toBeFalsy();
    expect(elements.quickAddBox.isDisplayed()).toBeTruthy();
    expect(elements.quickAddTitle.isDisplayed()).toBeTruthy();
    expect(elements.quickAddDescription.isDisplayed()).toBeFalsy();
    expect(elements.quickAddButton.isDisplayed()).toBeFalsy();
    elements.quickAddTitle.click();
    expect(elements.quickAddDescription.isDisplayed()).toBeTruthy();
    expect(elements.quickAddButton.isDisplayed()).toBeFalsy();
    elements.quickAddTitle.sendKeys('New Template Title');
    expect(elements.quickAddTitle.getCssValue('font-weight')).toEqual('bold');
    expect(elements.quickAddButton.isDisplayed()).toBeTruthy();
    elements.quickAddButton.click();
    expect(browser.isElementPresent(by.model('template.title'))).toBeTruthy();
    var newTemplateTitleInput = element(by.model('template.title'));
    var newTemplateDescriptionInput = element(by.model('template.description'));
    expect(newTemplateTitleInput.getAttribute('value')).toEqual('New Template Title');
    expect(newTemplateTitleInput.getCssValue('font-weight')).toEqual('bold');
    expect(newTemplateDescriptionInput.getAttribute('value')).toEqual('New Template Description');
    expect(elements.quickAddTitle.isDisplayed()).toBeTruthy();
    expect(elements.quickAddTitle.getAttribute('value')).toEqual('');
    expect(elements.quickAddDescription.isDisplayed()).toBeFalsy();
    expect(elements.quickAddButton.isDisplayed()).toBeFalsy();
  });

  describe('Tabs',function() {
    it('has tabs',function() {
      expect(browser.isElementPresent(by.tagName('material-tabs'))).toBeTruthy();
      expect(elements.tabs.count()).toEqual(4);
      expect(elements.tabs[0].getAttribute('label').toEqual('My Templates'));
      expect(elements.tabs[1].getAttribute('label').toEqual('Copy from Recent Polls'));
      expect(elements.tabs[2].getAttribute('label').toEqual('Copy from Examples'));
      expect(elements.tabs[3].getAttribute('label').toEqual('Copy from Peer Recommended'));      
    });
    describe('My Templates Tab',function(){
      elements.tabs[0].click();
      browser.sleep(500);
      var templates = element.all(by.repeater('template in templates'));
      it ('should show my templates', function () {
        var firstCard = element.all(by.css('.mainCard')).get(0);
        var firstCardMenuBar = firstCard.findElement(by.css('.cardMenuBar'));
        var title = element.all(by.css('.mainCard')).get(0).findElement(by.css('.pollTitleLine')).getText();
        expect(title).toEqual('Join Operation Red Dawn!');
        it("shows the action bar on hover", function () {
          expect(firstCardMenuBar.isDisplayed()).toBeFalsy();
          browser.actions().
            mouseMove(firstCard).
            perform();
          expect(firstCardMenuBar.isDisplayed()).toBeTruthy();
          browser.actions().
            mouseMove(streamButton.find()).
            perform();
          expect(firstCardMenuBar.isDisplayed()).toBeFalsy();
        });
        describe('overflow menu', function () {
          var firstCardOverflowMenuButton = firstCardMenuBar.findElement(by.css('.overflowMenuButton'));
          var firstCardOverflowMenu = element.all(by.css('.cardholder')).get(0).findElement(by.css('.overflowMenu'));
          it("is displayed when the overflow menu button is clicked", function () {
            expect(firstCardOverflowMenu.isDisplayed()).toBeFalsy();
            browser.actions().
              mouseMove(firstCard).
              perform();
            firstCardOverflowMenuButton.click();
            expect(firstCardOverflowMenu.isDisplayed()).toBeTruthy();
            browser.actions().
              mouseMove(streamButton.find()).
              perform();
            expect(firstCardOverflowMenu.isDisplayed()).toBeFalsy();
          });
          it("has a delete card action with confirmation dialog", function () {
            var firstCardDeleteAction = element.all(by.css('.cardholder')).get(0).findElement(by.css('.destroyAction'));
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
          it("has a edit card action", function () {
            var firstCardEditAction = element.all(by.css('.cardholder')).get(0).findElement(by.css('.editAction'));
            browser.actions().
              mouseMove(firstCard).
              perform();
            firstCardOverflowMenuButton.click();
            expect(firstCardEditAction.isDisplayed()).toBeTruthy();
            expect(firstCardEditAction.getText()).toEqual("Edit");
            firstCardEditAction.click();
            var dialogTitleInput = element(by.inputName('templateTitleInput'));
            expect(dialogTitleInput.isDisplayed()).toBeTruthy();
            expect(dialogTitleInput.getAttribute('value')).toEqual(title);
          });
          it("has a fork card action", function () {
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
    });
    describe('Copy from Recent Polls', function () {
      elements.tabs[1].click();
      browser.sleep(500);
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
      elements.tabs[2].click();
      browser.sleep(500);
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
      elements.tabs[3].click();
      browser.sleep(500);
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