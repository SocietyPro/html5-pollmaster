var Elements = function () {
  this.menuDrawerButton = element(by.id('menu-drawer-button'));
  this.streamButton = element(by.id('streamButton'));
  this.allFilterButton = element.all(by.css('.menu-sub-item')).get(0);
  this.votesFilterButton = element.all(by.css('.menu-sub-item')).get(1);
  this.runningFilterButton = element.all(by.css('.menu-sub-item')).get(2);
  this.unstartedFilterButton = element.all(by.css('.menu-sub-item')).get(3);
  this.completedFilterButton = element.all(by.css('.menu-sub-item')).get(4);
  this.pollCards = element.all(by.css('.cardholder'));
};

describe('poll results card', function () {

  beforeEach(function () {
    browser.get('index.html');
    elements = new Elements();
  });

  describe('for a running or completed poll', function () {

    var ResultsElements = function () {
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
      this.copyPollButton = element(by.css('material-dialog')).element(by.id('copyPollButton'));
      this.deletePollButton = element(by.css('material-dialog')).element(by.id('deletePollButton'));
      this.closeButton = element(by.css('material-dialog')).element(by.id('closeButton'));
    };

    var resultsElements;
    var firstCard;
    var secondCard;

    beforeEach(function () {
      elements.menuDrawerButton.click();
      browser.sleep(500);
      elements.runningFilterButton.click();
      element(by.css('material-backdrop')).click();
      browser.sleep(500);
      firstCard = element.all(by.css('material-card')).get(0);
      secondCard = element.all(by.css('material-card')).get(2);
    });

    it('has the poll ending time and date', function () {
      firstCard.click();
      resultsElements = new ResultsElements();
      expect(resultsElements.pollEndDate.isDisplayed()).toBeTruthy();
    });

    it('displays the poll originator', function () {
      var originator = element.all(by.css('.mainCard')).get(0).findElement(by.binding('poll.originator')).getText();
      firstCard.click();
      resultsElements = new ResultsElements();
      expect(resultsElements.pollOriginator.isDisplayed()).toBeTruthy();
      expect(resultsElements.pollOriginator.getText()).toEqual(originator);
    });

    it('displays the poll title', function () {
      var title = element.all(by.css('.mainCard')).get(0).findElement(by.binding('poll.title')).getText();
      firstCard.click();
      resultsElements = new ResultsElements();
      expect(resultsElements.pollTitle.isDisplayed()).toBeTruthy();
      expect(resultsElements.pollTitle.getText()).toEqual(title);
    });

    it('displays the poll description', function () {
      firstCard.click();
      resultsElements = new ResultsElements();
      expect(resultsElements.pollDescription.isDisplayed()).toBeTruthy();
    });

    it('displays the poll response stats', function () {
      firstCard.click();
      resultsElements = new ResultsElements();
      expect(resultsElements.pollStatsTable.isDisplayed()).toBeTruthy();
    });

    it('displays the poll options and counts', function () {
      firstCard.click();
      resultsElements = new ResultsElements();
      expect(resultsElements.pollResultsTable.isDisplayed()).toBeTruthy();
    });

    it('displays a results pie chart', function () {
      firstCard.click();
      resultsElements = new ResultsElements();
      expect(resultsElements.nvd3PieChart.isDisplayed()).toBeTruthy();
    });

    it('displays an action menu on hover', function () {
      firstCard.click();
      resultsElements = new ResultsElements();
      expect(resultsElements.actionMenuBar.isDisplayed()).toBeFalsy();
      browser.actions().
      mouseMove(resultsElements.materialDialogContent.find()).
      perform();
      expect(resultsElements.actionMenuBar.isDisplayed()).toBeTruthy();
      browser.actions().
      mouseMove(elements.streamButton.find()).
      perform();
      expect(resultsElements.actionMenuBar.isDisplayed()).toBeFalsy();
    });
    
    describe('action menu', function () {

      it('has a view comments button if the poll allows comments', function () {
        firstCard.click();
        resultsElements = new ResultsElements();        
        browser.actions().
        mouseMove(resultsElements.materialDialogContent.find()).
        perform();
        expect(browser.isElementPresent(by.id('pollCommentsTable'))).toBeFalsy();
        expect(resultsElements.showCommentsButton.isDisplayed()).toBeTruthy();
        resultsElements.showCommentsButton.click();
        browser.sleep(200);
        expect(browser.isElementPresent(by.id('pollCommentsTable'))).toBeTruthy();
      });

      it('does not have a view comments button if the poll does not allow comments', function () {
        secondCard.click();
        resultsElements = new ResultsElements();        
        browser.actions().
        mouseMove(resultsElements.materialDialogContent.find()).
        perform();
        expect(browser.isElementPresent(by.id('showCommentsButton'))).toBeFalsy();
      });

      it('has a copy poll button', function () {
        firstCard.click();
        resultsElements = new ResultsElements();        
        browser.actions().
        mouseMove(resultsElements.materialDialogContent.find()).
        perform();
        expect(resultsElements.copyPollButton.isDisplayed()).toBeTruthy();
        var title = resultsElements.pollTitle.getText();
        resultsElements.copyPollButton.click();
        expect(browser.isElementPresent(by.css('material-dialog'))).toBeTruthy();
        var titleInput = element(by.css('material-dialog')).element(by.model('poll.title'));
        expect(titleInput.isDisplayed()).toBeTruthy();
        expect(titleInput.getAttribute('value')).toEqual(title);
      });

      it('has a delete poll button', function () {
        firstCard.click();
        resultsElements = new ResultsElements();        
        browser.actions().
        mouseMove(resultsElements.materialDialogContent.find()).
        perform();
        expect(resultsElements.deletePollButton.isDisplayed()).toBeTruthy();
        expect(elements.pollCards.count()).toEqual(2);
        resultsElements.deletePollButton.click();        
        var confirmationDialog = browser.switchTo().alert();
        confirmationDialog.accept();
        expect(elements.pollCards.count()).toEqual(1);
        expect(browser.isElementPresent(by.css('material-dialog'))).toBeFalsy();
      });

    });

    describe('comments dialog', function () {

      var CommentsElements = function () {
        this.pollEndDate = element(by.css('material-dialog')).element(by.binding('poll.endTime'));
        this.pollOriginator = element(by.css('material-dialog')).element(by.binding('poll.originator'));
        this.pollTitle = element(by.css('material-dialog')).element(by.binding('poll.title'));
        this.pollDescription = element(by.css('material-dialog')).element(by.binding('poll.description'));
        this.pollCommentsTable = element(by.css('material-dialog')).element(by.id('pollCommentsTable'));
        this.backToResultsButton = element(by.css('material-dialog')).element(by.id('backToResultsButton'));
        this.closeButton = element(by.css('material-dialog')).element(by.id('closeButton'));
      };

      beforeEach(function () {
        firstCard.click();
        browser.sleep(500);
        resultsElements.showCommentsButton.click();
        commentsElements = new CommentsElements();
      });

      it('displays the poll end time, originator, title, and description', function () {
        expect(commentsElements.pollEndDate.isDisplayed()).toBeTruthy();
        expect(commentsElements.pollOriginator.isDisplayed()).toBeTruthy();
        expect(commentsElements.pollTitle.isDisplayed()).toBeTruthy();
        expect(commentsElements.pollDescription.isDisplayed()).toBeTruthy();
      });

      it('displays the comments for the poll', function () {
        expect(commentsElements.pollCommentsTable.isDisplayed()).toBeTruthy();
      });

      it('displays a button to return to poll results', function () {
        expect(commentsElements.backToResultsButton.isDisplayed()).toBeTruthy();
        expect(browser.isElementPresent(by.id('pollStatsTable'))).toBeFalsy();
        commentsElements.backToResultsButton.click();
        browser.sleep(500);
        expect(browser.isElementPresent(by.id('pollStatsTable'))).toBeTruthy();
      });

      it('displays a close dialog button', function () {
        expect(commentsElements.closeButton.isDisplayed()).toBeTruthy();
        expect(browser.isElementPresent(by.css('material-dialog'))).toBeTruthy();
        commentsElements.closeButton.click();
        browser.sleep(500);
        expect(browser.isElementPresent(by.css('material-dialog'))).toBeFalsy();
      });

    });

  });

});