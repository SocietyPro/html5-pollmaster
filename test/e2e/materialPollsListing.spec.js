var Elements = function () {
  this.quickAddBox = element(by.id('quickAddBox'));
  this.quickAddTitle = element(by.id('quickAddTitle'));
  this.quickAddDescription = element(by.id('quickAddDescription'));
  this.quickAddButton = element(by.id('quickAddButton'));
  this.fab = element(by.css('.material-button-fab'));
  this.sidenav = element(by.css('material-sidenav'));
  this.menuDrawerButton = element(by.id('menu-drawer-button'));
  this.allFilterButton = element.all(by.css('.menu-sub-item')).get(0);
  this.votesFilterButton = element.all(by.css('.menu-sub-item')).get(1);
  this.runningFilterButton = element.all(by.css('.menu-sub-item')).get(2);
  this.unstartedFilterButton = element.all(by.css('.menu-sub-item')).get(3);
  this.completedFilterButton = element.all(by.css('.menu-sub-item')).get(4);
  this.viewButtons = element(by.id('viewButtons'));
  this.streamButton = element(by.id('streamButton'));
  this.quiltButton = element(by.id('quiltButton'));
  this.pollCards = element.all(by.css('.cardholder'));
  this.materialPollCards = element.all(by.css('.mainCard'));
  this.firstCard = element.all(by.css('.mainCard')).get(0);
  this.firstCardTitle = element.all(by.css('.mainCard')).get(0).findElement(by.css('.pollTitleLine'));
  this.firstCardMenuBar = this.firstCard.findElement(by.css('.cardMenuBar'));
  this.firstCardOverflowMenuButton = this.firstCardMenuBar.findElement(by.css('.overflowMenuButton'));
  this.firstCardOverflowMenu = element.all(by.css('.cardholder')).get(0).findElement(by.css('.overflowMenu'));
  this.firstCardDeleteAction = element.all(by.css('.cardholder')).get(0).findElement(by.css('.destroyAction'));
  this.firstCardCopyAction = element.all(by.css('.cardholder')).get(0).findElement(by.css('.copyAction'));
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
  this.saveAsTemplateCheckbox = element(by.model('isTemplate'));
  this.saveAsPollCheckbox = element(by.model('isPoll'));
  this.pollEndsOptions = element(by.css('.dialog-options-poll-ends'));
  this.ballotPreview = element(by.id('ballotPreview'));
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
  
  /*
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

  it("has an add poll fab", function () {
    expect(elements.fab.isDisplayed()).toBeTruthy();
    expect(browser.isElementPresent(by.model('poll.title'))).toBeFalsy();
    elements.fab.click();
    expect(browser.isElementPresent(by.model('poll.title'))).toBeTruthy();
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

    it("has buttons for poll filters", function () {
      expect(elements.allFilterButton.getText()).toEqual('All');
      expect(elements.votesFilterButton.getText()).toEqual('Votes');
      expect(elements.runningFilterButton.getText()).toEqual('Running');
      expect(elements.unstartedFilterButton.getText()).toEqual('Unstarted');
      expect(elements.completedFilterButton.getText()).toEqual('Completed');
    });

    it("filters the polls list when the poll filter buttons are clicked", function () {
      elements.menuDrawerButton.click();
      expect(elements.pollCards.count()).toEqual(5);
      elements.runningFilterButton.click();
      expect(elements.pollCards.count()).toEqual(2);
      elements.unstartedFilterButton.click();
      expect(elements.pollCards.count()).toEqual(2);
      elements.completedFilterButton.click();
      expect(elements.pollCards.count()).toEqual(1);
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
      });

    });

  });

  describe("card", function () {

    describe("for a running poll", function () {

      var firstRunningCard;

      beforeEach(function () {
        elements.menuDrawerButton.click();
        browser.sleep(500);
        elements.runningFilterButton.click();
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
        var pollTitle = firstRunningCard.findElement(by.binding('{{poll.title}}')).getText();
        element(by.css('material-backdrop')).click();
        browser.sleep(500);
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
        elements.menuDrawerButton.click();
        browser.sleep(500);
        elements.unstartedFilterButton.click();
        firstUnstartedCard = element.all(by.css('material-card')).get(0);
      });
      
      it("is white, displays the poll title, and displays the poll options", function () {
        expect(firstUnstartedCard.getCssValue('background-color')).toEqual('rgba(0, 0, 0, 0)');
        var pollTitle = firstUnstartedCard.findElement(by.css('.pollTitleLine'));
        var pollOriginator = firstUnstartedCard.findElement(by.css('.pollOriginatorLine'));
        expect(pollOriginator.isDisplayed()).toBeTruthy();
        expect(pollTitle.isDisplayed()).toBeTruthy();
        var optionPreview = firstUnstartedCard.findElement(by.css('.optionPreview'));
        expect(optionPreview.isDisplayed()).toBeTruthy();
      });

      it("zooms to a edit poll card when clicked", function () {
        var pollTitle = firstUnstartedCard.findElement(by.binding('{{poll.title}}')).getText();
        element(by.css('material-backdrop')).click();
        browser.sleep(500);
        firstUnstartedCard.click();
        var dialogTitleInput = element(by.inputName('pollTitleInput'));
        expect(dialogTitleInput.isDisplayed()).toBeTruthy();
        expect(dialogTitleInput.getAttribute('value')).toEqual(pollTitle);
      });

    });

    describe("for a completed poll", function () {
      
      var firstCompletedCard;
      
      beforeEach(function () {
        elements.menuDrawerButton.click();
        browser.sleep(500);
        elements.completedFilterButton.click();
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
        element(by.css('material-backdrop')).click();
        browser.sleep(500);
        firstCompletedCard.click();
        var zoomedPollInformation = element(by.css('.pollInformation'));
        expect(zoomedPollInformation.isDisplayed()).toBeTruthy();
        var zoomedTitle = zoomedPollInformation.findElement(by.binding('{{poll.title}}'));
        expect(zoomedTitle.getText()).toEqual(pollTitle);
      });

    });

  });
  
  describe("poll editing card", function () {
    
    var editCardElements;

    beforeEach(function () {
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

    it("has a next button", function () {
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

        it("has a checkbox and label for saving as a template", function () {
          expect(editCardElements.saveAsTemplateCheckbox.isDisplayed()).toBeTruthy();
          expect(editCardElements.saveAsTemplateCheckbox.getText()).toEqual('Save as Template');
          expect(editCardElements.saveAsTemplateCheckbox.getAttribute('aria-checked')).toEqual('false');
          editCardElements.saveAsTemplateCheckbox.click();
          expect(editCardElements.saveAsTemplateCheckbox.getAttribute('aria-checked')).toEqual('true');
        });

        it("has a checkbox and label for saving as a poll", function () {
          expect(editCardElements.saveAsPollCheckbox.isDisplayed()).toBeTruthy();
          expect(editCardElements.saveAsPollCheckbox.getText()).toEqual('Save as Poll');
          expect(editCardElements.saveAsPollCheckbox.getAttribute('aria-checked')).toEqual('true');
          editCardElements.saveAsPollCheckbox.click();
          expect(editCardElements.saveAsPollCheckbox.getAttribute('aria-checked')).toEqual('false');
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

  describe("target selection dialog", function () {

    beforeEach(function () {
      elements.fab.click();
      browser.sleep(500);
      element(by.id('nextButton')).click();
      browser.sleep(500);
    });

    it("has a target selection dropdown", function () {
      var targetSelect = element(by.model('poll.target'));
      expect(targetSelect.isDisplayed()).toBeTruthy();
    });

    it("has a close button", function () {
      var closeButton = element(by.id('closeButton'));
      expect(elements.pollCards.count()).toEqual(5);
      closeButton.click();
      browser.sleep(500);
      expect(elements.pollCards.count()).toEqual(5);
    });

    it("has a save button", function () {
      var saveButton = element(by.id('saveButton'));
      expect(elements.pollCards.count()).toEqual(5);
      saveButton.click();
      browser.sleep(500);
      expect(elements.pollCards.count()).toEqual(6);
    });

  });
  */

  describe('poll results card', function () {

    describe('for a running poll', function () {

      var RunningResultsElements = function () {
        this.materialDialogContent = element(by.css('.dialog-content'));
        this.pollEndDate = element(by.css('material-dialog')).element(by.binding('poll.endTime'));
        this.pollOriginator = element(by.css('material-dialog')).element(by.binding('poll.originator'));
        this.pollTitle = element(by.css('material-dialog')).element(by.binding('poll.title'));
        this.pollDescription = element(by.css('material-dialog')).element(by.binding('poll.description'));
        this.pollStatsTable = element(by.css('material-dialog')).element(by.id('pollStatsTable'));
        this.pollResultsTable = element(by.css('material-dialog')).element(by.id('pollResultsTable'));
        this.nvd3PieChart = element(by.css('material-dialog')).element(by.css('nvd3-pie-chart'));
        this.actionMenuBar = element(by.css('material-dialog')).element(by.id('actionMenuBar'));
        this.showCommentsButton = element(by.css('material-dialog')).element(by.id('showCommentsButton'));
        this.closeButton = element(by.css('material-dialog')).element(by.id('closeButton'));
      };

      var runningResultsElements;

      beforeEach(function () {
        elements.menuDrawerButton.click();
        browser.sleep(500);
        elements.runningFilterButton.click();
        element(by.css('material-backdrop')).click();
        browser.sleep(500);
        firstRunningCard = element.all(by.css('material-card')).get(0);
        firstRunningCard.click();
        runningResultsElements = new RunningResultsElements();
      });

      /*
      it('has the poll ending time and date', function () {
        expect(runningResultsElements.pollEndDate.isDisplayed()).toBeTruthy();
      });

      it('displays the poll originator', function () {
        expect(runningResultsElements.pollOriginator.isDisplayed()).toBeTruthy();
      });

      it('displays the poll title', function () {
        expect(runningResultsElements.pollTitle.isDisplayed()).toBeTruthy();
      });

      it('displays the poll description', function () {
        expect(runningResultsElements.pollDescription.isDisplayed()).toBeTruthy();
      });

      it('displays the poll response stats', function () {
        expect(runningResultsElements.pollStatsTable.isDisplayed()).toBeTruthy();
      });

      it('displays the poll options and counts', function () {
        expect(runningResultsElements.pollResultsTable.isDisplayed()).toBeTruthy();
      });

      it('displays a results pie chart', function () {
        expect(runningResultsElements.nvd3PieChart.isDisplayed()).toBeTruthy();
      });

      it('displays an action menu on hover', function () {
        expect(runningResultsElements.actionMenuBar.isDisplayed()).toBeFalsy();
        browser.actions().
        mouseMove(runningResultsElements.materialDialogContent.find()).
        perform();
        expect(runningResultsElements.actionMenuBar.isDisplayed()).toBeTruthy();
        browser.actions().
        mouseMove(elements.streamButton.find()).
        perform();
        expect(runningResultsElements.actionMenuBar.isDisplayed()).toBeFalsy();
      });
      */
      describe('action menu', function () {

        beforeEach(function () {        
          browser.actions().
          mouseMove(runningResultsElements.materialDialogContent.find()).
          perform();
        });

        it('has a view comments button if the poll allows comments', function () {
          expect(runningResultsElements.showCommentsButton.isDisplayed()).toBeTruthy();
          runningResultsElements.closeButton.click();
          browser.sleep(1000);
          var secondRunningCard = element.all(by.css('material-card')).get(1);
          secondRunningCard.click();
          runningResultsElements = new RunningResultsElements();
          browser.actions().
          mouseMove(runningResultsElements.materialDialogContent.find()).
          perform();
          expect(browser.isElementPresent(by.id('showCommentsButton'))).toBeFalsy();
        });

        xit('has a copy poll button', function () {

        });

        xit('has a delete poll button', function () {

        });
      });

    });

  });
  
});

