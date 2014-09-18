var Elements = function () {
  this.quickAddBox = element(by.id('quickAddBox'));
  this.quickAddTitle = element(by.id('quickAddTitle'));
  this.quickAddDescription = element(by.id('quickAddDescription'));
  this.quickAddButton = element(by.id('quickAddButton'));
  this.fab = element(by.css('.material-button-fab'));
  this.sidenav = element(by.css('material-sidenav'));
  this.menuDrawerButton = element(by.id('menu-drawer-button'));
  this.allFilterButton = element.all(by.css('.menu-sub-item')).get(2);
  this.votesFilterButton = element.all(by.css('.menu-sub-item')).get(3);
  this.runningFilterButton = element.all(by.css('.menu-sub-item')).get(4);
  this.unstartedFilterButton = element.all(by.css('.menu-sub-item')).get(5);
  this.completedFilterButton = element.all(by.css('.menu-sub-item')).get(6);
  this.pollsButton = element(by.id('pollsButton'));
  this.templatesButton = element(by.id('templatesButton'));
  this.viewButtons = element(by.id('viewButtons'));
  this.streamButton = element(by.id('streamButton'));
  this.quiltButton = element(by.id('quiltButton'));
  this.filterButton = element(by.id('filterButton'));
  this.pollCards = element.all(by.css('.cardholder'));
  this.materialPollCards = element.all(by.css('.mainCard'));
  this.firstCard = element.all(by.css('.mainCard')).get(0);
  this.firstCardTitle = element.all(by.css('.mainCard')).get(0).findElement(by.css('.pollTitleLine'));
  this.firstCardMenuBar = this.firstCard.findElement(by.css('.cardMenuBar'));
  this.firstCardOverflowMenuButton = this.firstCardMenuBar.findElement(by.css('.overflowMenuButton'));
  this.firstCardOverflowMenu = element.all(by.css('.cardholder')).get(0).findElement(by.css('.overflowMenu'));
  this.firstCardDeleteAction = element.all(by.css('.cardholder')).get(0).findElement(by.css('.destroyAction'));
  this.firstCardCopyAction = element.all(by.css('.cardholder')).get(0).findElement(by.css('.copyAction'));
  //this.firstCardForkAction = element.all(by.css('.cardholder')).get(0).findElement(by.css('.forkAction'));
};

var elements;

describe("material polls listing", function () {

  beforeEach(function () {
    browser.get("index.html");
    elements = new Elements();
  });

  by.addLocator('inputName', function (name) {
    var using = document,
        inputs = using.querySelectorAll('input');
    return Array.prototype.filter.call(inputs, function (input) {
      return input.name === name;
    })
  }); 
  it("has a quick add poll form", function () {
    expect(browser.isElementPresent(by.model('poll.title'))).toBeFalsy();
    expect(elements.quickAddBox.isDisplayed()).toBeTruthy();
    expect(elements.quickAddTitle.isDisplayed()).toBeTruthy();
    expect(elements.quickAddDescription.isDisplayed()).toBeFalsy();
    expect(elements.quickAddButton.isDisplayed()).toBeFalsy();
    elements.quickAddTitle.click();
    expect(elements.quickAddDescription.isDisplayed()).toBeTruthy();
    elements.quickAddTitle.sendKeys('New Poll Title');
    expect(elements.quickAddTitle.getCssValue('font-weight')).toEqual('bold');
    expect(elements.quickAddButton.isDisplayed()).toBeTruthy();
    elements.quickAddDescription.sendKeys('New Poll Description');
    elements.quickAddButton.click();
    expect(browser.isElementPresent(by.model('poll.title'))).toBeTruthy();
    var newPollTitleInput = element(by.model('poll.title'));
    var newPollDescriptionInput = element(by.model('poll.description'));
    expect(newPollTitleInput.getAttribute('value')).toEqual('New Poll Title');
    expect(newPollTitleInput.getCssValue('font-weight')).toEqual('bold');
    expect(newPollDescriptionInput.getAttribute('value')).toEqual('New Poll Description');
    expect(elements.quickAddTitle.isDisplayed()).toBeTruthy();
    expect(elements.quickAddTitle.getAttribute('value')).toEqual('');
    expect(elements.quickAddDescription.isDisplayed()).toBeFalsy();
    expect(elements.quickAddButton.isDisplayed()).toBeFalsy();
  });

  describe("quick add poll form", function () {

    it("starts the dialog sequence of making a new poll", function () {
      expect(elements.pollCards.count()).toEqual(5);
      elements.quickAddTitle.click();
      elements.quickAddTitle.sendKeys('New Poll Title');
      elements.quickAddDescription.sendKeys('New Poll Description');
      elements.quickAddButton.click();
      browser.sleep(500);
      element(by.id('nextButton')).click();
      element(by.id('saveButton')).click();
      expect(elements.pollCards.count()).toEqual(6);
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.templatesButton.click();
      var templateCards = element.all(by.css('.mainCard'));
      expect(templateCards.count()).toEqual(5);
    });

    it("starts the dialog sequence of making a new poll and template", function () {
      expect(elements.pollCards.count()).toEqual(5);
      elements.quickAddTitle.click();
      elements.quickAddTitle.sendKeys('New Poll Title');
      elements.quickAddDescription.sendKeys('New Poll Description');
      elements.quickAddButton.click();
      browser.sleep(500);
      element(by.css('.menuDrawerButton')).click();
      element(by.model('saveMatrix[3]')).click();
      element(by.id('nextButton')).click();
      element(by.id('saveButton')).click();
      expect(elements.pollCards.count()).toEqual(6);
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.templatesButton.click();
      var templateCards = element.all(by.css('.mainCard'));
      expect(templateCards.count()).toEqual(6);
    });

    it("starts the dialog sequence of making a new template", function () {
      expect(elements.pollCards.count()).toEqual(5);
      elements.quickAddTitle.click();
      elements.quickAddTitle.sendKeys('New Poll Title');
      elements.quickAddDescription.sendKeys('New Poll Description');
      elements.quickAddButton.click();
      browser.sleep(500);
      element(by.css('.menuDrawerButton')).click();
      element(by.model('saveMatrix[3]')).click();
      element(by.model('saveMatrix[1]')).click();
      element(by.id('saveButton')).click();
      expect(elements.pollCards.count()).toEqual(6);
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.templatesButton.click();
      var templateCards = element.all(by.css('.mainCard'));
      expect(templateCards.count()).toEqual(6);
    });

  });

  it("has an add poll fab", function () {
    expect(elements.fab.isDisplayed()).toBeTruthy();
    expect(browser.isElementPresent(by.model('poll.title'))).toBeFalsy();
    elements.fab.click();
    expect(browser.isElementPresent(by.model('poll.title'))).toBeTruthy();
  });

  describe("add poll fab", function () {

    it("starts the dialog sequence of making a new poll", function () {
      expect(elements.pollCards.count()).toEqual(5);
      elements.fab.click();    
      var newPollTitleInput = element(by.model('poll.title'));
      var newPollDescriptionInput = element(by.model('poll.description'));
      newPollTitleInput.sendKeys('New Poll Title');
      newPollDescriptionInput.sendKeys('New Poll Description');
      element(by.id('nextButton')).click();
      element(by.id('saveButton')).click();
      expect(elements.pollCards.count()).toEqual(6);
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.templatesButton.click();
      var templateCards = element.all(by.css('.mainCard'));
      expect(templateCards.count()).toEqual(5);
    });

    it("starts the dialog sequence of making a new poll and template", function () {
      expect(elements.pollCards.count()).toEqual(5);
      elements.fab.click();    
      var newPollTitleInput = element(by.model('poll.title'));
      var newPollDescriptionInput = element(by.model('poll.description'));
      newPollTitleInput.sendKeys('New Poll Title');
      newPollDescriptionInput.sendKeys('New Poll Description');
      element(by.css('.menuDrawerButton')).click();
      element(by.model('saveMatrix[3]')).click();
      element(by.id('nextButton')).click();
      element(by.id('saveButton')).click();
      expect(elements.pollCards.count()).toEqual(6);
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.templatesButton.click();
      var templateCards = element.all(by.css('.mainCard'));
      expect(templateCards.count()).toEqual(6);
    });

    it("starts the dialog sequence of making a new template", function () {
      expect(elements.pollCards.count()).toEqual(5);
      elements.fab.click();    
      var newPollTitleInput = element(by.model('poll.title'));
      var newPollDescriptionInput = element(by.model('poll.description'));
      newPollTitleInput.sendKeys('New Poll Title');
      newPollDescriptionInput.sendKeys('New Poll Description');
      element(by.css('.menuDrawerButton')).click();
      element(by.model('saveMatrix[3]')).click();
      element(by.model('saveMatrix[1]')).click();
      element(by.id('saveButton')).click();
      expect(elements.pollCards.count()).toEqual(6);
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.templatesButton.click();
      var templateCards = element.all(by.css('.mainCard'));
      expect(templateCards.count()).toEqual(6);
    });

  });

  describe("sidenav menu", function () {

    it("is closed by default", function () {
      expect(elements.sidenav.isDisplayed()).toBeTruthy();
      expect(elements.sidenav.getAttribute('class')).toEqual('material-sidenav-left material-whiteframe-z2 ng-isolate-scope');
    });

    it("can be opened with the menu drawer button", function () {
      expect(elements.menuDrawerButton.isDisplayed()).toBeTruthy();
      elements.menuDrawerButton.click();
      expect(elements.sidenav.getAttribute('class')).toEqual('material-sidenav-left material-whiteframe-z2 ng-isolate-scope open');
    });

    it("has buttons for polls and templates view", function () {
      expect(elements.pollsButton.getText()).toEqual('Polls');
      expect(elements.templatesButton.getText()).toEqual('Templates');
    });

    it("changes to polls when clicking Polls button", function () {
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.pollsButton.click();
      expect(elements.pollCards.count()).toEqual(5);
    });

    it("changes to templates when clicking templates button", function () {
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.templatesButton.click();
      var firstCardTitle = element.all(by.css('.mainCard')).get(0).findElement(by.css('.pollTitleLine')).getText();
      expect(firstCardTitle).toEqual("Join Operation Red Dawn! Bring Ships!");
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

    it("has button for poll filters", function () {
      expect(elements.filterButton.isDisplayed()).toBeTruthy();
    });

    it("filters the polls list when the poll filter buttons are clicked", function () {
      elements.filterButton.click();
      browser.sleep(500);
      elements.runningFilterButton.click();
      browser.sleep(500);
      expect(elements.pollCards.count()).toEqual(2);
      elements.filterButton.click();
      browser.sleep(500);
      elements.unstartedFilterButton.click();
      expect(elements.pollCards.count()).toEqual(2);
      elements.filterButton.click();
      browser.sleep(500);
      elements.completedFilterButton.click();
      expect(elements.pollCards.count()).toEqual(1);
    });

  });

  describe("default card", function () {

    it("shows the action bar on hover", function () {
      expect(elements.firstCardMenuBar.isDisplayed()).toBeFalsy();
      browser.actions().
        mouseMove(elements.firstCard).
        perform();
      expect(elements.firstCardMenuBar.isDisplayed()).toBeTruthy();
      browser.actions().
        mouseMove(elements.streamButton.find()).
        perform();
      expect(elements.firstCardMenuBar.isDisplayed()).toBeFalsy();
    });

    describe('overflow menu', function () {

      it("is displayed when the overflow menu button is clicked", function () {
        expect(elements.firstCardOverflowMenu.isDisplayed()).toBeFalsy();
        browser.actions().
          mouseMove(elements.firstCard).
          perform();
        elements.firstCardOverflowMenuButton.click();
        browser.sleep(500);
        expect(elements.firstCardOverflowMenu.isDisplayed()).toBeTruthy();
        browser.actions().
          mouseMove(elements.streamButton.find()).
          perform();
        expect(elements.firstCardOverflowMenu.isDisplayed()).toBeFalsy();
      });

      it("has a delete card action with confirmation dialog", function () {
        browser.actions().
          mouseMove(elements.firstCard).
          perform();
        elements.firstCardOverflowMenuButton.click();
        expect(elements.firstCardDeleteAction.isDisplayed()).toBeTruthy();
        expect(elements.firstCardDeleteAction.getText()).toEqual("Delete");
        expect(elements.pollCards.count()).toEqual(5);
        elements.firstCardDeleteAction.click();
        var confirmationDialog = browser.switchTo().alert();
        confirmationDialog.accept();
        expect(elements.pollCards.count()).toEqual(4);
      });

      it("has a copy card action", function () {
        expect(elements.pollCards.count()).toEqual(5);
        var title = elements.firstCardTitle.getText();
        expect(browser.isElementPresent(by.model('poll.title'))).toBeFalsy();
        browser.actions().
          mouseMove(elements.firstCard).
          perform();
        elements.firstCardOverflowMenuButton.click();
        expect(elements.firstCardCopyAction.isDisplayed()).toBeTruthy();
        expect(elements.firstCardCopyAction.getText()).toEqual("Make a Copy");
        elements.firstCardCopyAction.click();
        var dialogTitleInput = element(by.inputName('pollTitleInput'));
        expect(dialogTitleInput.isDisplayed()).toBeTruthy();
        expect(dialogTitleInput.getAttribute('value')).toEqual(title);
        element(by.id('nextButton')).click();
        browser.sleep(500);
        element(by.id('saveButton')).click();
        expect(elements.pollCards.count()).toEqual(6);
      });

      /*xit("has a fork as template action", function () {
        elements.menuDrawerButton.click();
        browser.sleep(500);
        elements.templatesButton.click();    
        var templateCards = element.all(by.css('.maincard'));
        expect(templateCards.count()).toEqual(5);
        elements.pollsButton.click();
        element(by.css('material-backdrop')).click();
        elements = new Elements();
        browser.actions().
          mouseMove(elements.firstCard).
          perform();
        elements.firstCardOverflowMenuButton.click();
        expect(elements.firstCardForkAction.isDisplayed()).toBeTruthy();
        expect(elements.firstCardForkAction.getText()).toEqual("Fork as a Template");
        firstCardForkAction.click();
        browser.sleep(500);
        element(by.id('saveButton')).click();
        elements.menuDrawerButton.click();
        browser.sleep(500);
        elements.templatesButton.click();    
        templateCards = element.all(by.css('.maincard'));
        expect(templateCards.count()).toEqual(6);
      });*/

    });

  });

  describe("card", function () {

    describe("for a running poll", function () {

      var firstRunningCard;

      beforeEach(function () {
        elements.filterButton.click();
        browser.sleep(500);
        elements.runningFilterButton.click();
        browser.sleep(500);
        firstRunningCard = element.all(by.css('material-card')).get(0);
      });
      

      it("is green, displays the poll title, displays options and current counts, and displays a results pie chart", function () {
        expect(firstRunningCard.getCssValue('background-color')).toEqual('rgba(146, 228, 201, 1)');
        var pollTitle = firstRunningCard.findElement(by.css('.pollTitleLine'));
        var optionCounts = firstRunningCard.findElement(by.css('.optionCounts'));
        var pollOriginator = firstRunningCard.findElement(by.css('.pollOriginatorLine'));
        expect(pollOriginator.isDisplayed()).toBeTruthy();
        expect(optionCounts.isDisplayed()).toBeTruthy();
        expect(pollTitle.isDisplayed()).toBeTruthy();
        var pieChart = firstRunningCard.findElement(by.css('.pieChartContainer'));
        expect(pieChart.isDisplayed()).toBeTruthy();
      });

      it("zooms to a zoomed poll card when clicked", function () {
        var pollTitle = element.all(by.css('.mainCard')).get(0).findElement(by.css('.pollTitleLine')).getText();
        //element(by.css('material-backdrop')).click();
        //browser.sleep(500);
        firstRunningCard.click();
        var zoomedPollInformation = element(by.css('.pollInformation'));
        expect(zoomedPollInformation.isDisplayed()).toBeTruthy();
        var zoomedTitle = zoomedPollInformation.findElement(by.binding('{{poll.title}}'));
        expect(zoomedTitle.getText()).toEqual(pollTitle);
      });

    });

    describe("for an unstarted poll", function () {

      var firstUnstartedCard;

      beforeEach(function () {
        elements.filterButton.click();
        browser.sleep(500);
        elements.unstartedFilterButton.click();
        browser.sleep(500);
        firstUnstartedCard = element.all(by.css('material-card')).get(0);
      });
      
      it("is white, displays the poll title, and displays the poll options", function () {
        expect(firstUnstartedCard.getCssValue('background-color')).toEqual('rgba(255, 255, 255, 1)');
        var pollTitle = firstUnstartedCard.findElement(by.css('.pollTitleLine'));
        var pollOriginator = firstUnstartedCard.findElement(by.css('.pollOriginatorLine'));
        expect(pollOriginator.isDisplayed()).toBeTruthy();
        expect(pollTitle.isDisplayed()).toBeTruthy();
        var optionPreview = firstUnstartedCard.findElement(by.css('.optionPreview'));
        expect(optionPreview.isDisplayed()).toBeTruthy();
      });

      it("zooms to a edit poll card when clicked", function () {
        var pollTitle = firstUnstartedCard.findElement(by.binding('{{poll.title}}')).getText();
        //element(by.css('material-backdrop')).click();
        //browser.sleep(500);
        firstUnstartedCard.click();
        var dialogTitleInput = element(by.inputName('pollTitleInput'));
        expect(dialogTitleInput.isDisplayed()).toBeTruthy();
        expect(dialogTitleInput.getAttribute('value')).toEqual(pollTitle);
      });

    });

    describe("for a completed poll", function () {
      
      var firstCompletedCard;
      
      beforeEach(function () {
        elements.filterButton.click();
        browser.sleep(500);
        elements.completedFilterButton.click();
        browser.sleep(100);
        firstCompletedCard = element.all(by.css('material-card')).get(0);
      });

      it("is blue, displays the poll title, displays options and final counts, and displays a results pie chart", function () {
        expect(firstCompletedCard.getCssValue('background-color')).toEqual('rgba(201, 209, 255, 1)');
        var pollOriginator = firstCompletedCard.findElement(by.css('.pollOriginatorLine'));
        expect(pollOriginator.isDisplayed()).toBeTruthy();
        var pollTitle = firstCompletedCard.findElement(by.css('.pollTitleLine'));
        expect(pollTitle.isDisplayed()).toBeTruthy();
        var optionCounts = firstCompletedCard.findElement(by.css('.optionCounts'));
        expect(optionCounts.isDisplayed()).toBeTruthy();
        var pieChart = firstCompletedCard.findElement(by.css('.pieChartContainer'));
        expect(pieChart.isDisplayed()).toBeTruthy();
      });

      it("zooms to a zoomed poll card when clicked", function () {
        var pollTitle = firstCompletedCard.findElement(by.binding('{{poll.title}}')).getText();
        //element(by.css('material-backdrop')).click();
        //browser.sleep(500);
        firstCompletedCard.click();
        var zoomedPollInformation = element(by.css('.pollInformation'));
        expect(zoomedPollInformation.isDisplayed()).toBeTruthy();
        var zoomedTitle = zoomedPollInformation.findElement(by.binding('{{poll.title}}'));
        expect(zoomedTitle.getText()).toEqual(pollTitle);
      });

    });

  });
    
});