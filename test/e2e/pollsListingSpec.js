var Elements = function () {

  this.entries = element.all(by.repeater("poll in polls"));
  this.listContainer = element(by.id('pollsListContainer'));
  
  this.completedStatus = this.entries.get(0).findElement(by.binding("poll.status"));
  this.completedTotalPolled = this.entries.get(0).findElement(by.binding("poll.stats.sent"));
  this.completedTotalResponded = this.entries.get(0).findElement(by.binding("poll.stats.responded"));
  this.completedPollDate = this.entries.get(0).findElement(by.binding("poll.dateStarted"));
  this.completedPollType = this.entries.get(0).findElement(by.binding("poll.type"));
  this.completedPollTitle = this.entries.get(0).findElement(by.binding("poll.title"));
  this.completedCopyButton = this.entries.get(0).findElement(by.css(".copyPollButton"));
  this.completedDeleteButton = this.entries.get(0).findElement(by.css(".deletePollButton"));
  this.startedViewResultsButton = this.entries.get(0).findElement(by.css(".viewResultsButton"));
  this.completedViewResultsButton = this.entries.get(2).findElement(by.css(".viewResultsButton"));
  this.startedEditPollButton = this.entries.get(0).findElement(by.css(".editPollButton"));
  this.completedEditPollButton = this.entries.get(2).findElement(by.css(".editPollButton"));
  this.startedStartPollButton = this.entries.get(0).findElement(by.css(".startPollButton"));
  this.completedStartPollButton = this.entries.get(2).findElement(by.css(".startPollButton"));
  this.unstartedStatus = this.entries.get(3).findElement(by.binding("poll.status"));
  this.unstartedEditPollButton = this.entries.get(3).findElement(by.css(".editPollButton"));
  this.unstartedStartPollButton = this.entries.get(3).findElement(by.css(".startPollButton"));
  this.unstartedTotalPolled = this.entries.get(3).findElement(by.binding("poll.stats.sent"));
  this.unstartedTotalResponded = this.entries.get(3).findElement(by.binding("poll.stats.responded"));
  this.unstartedPollDate = this.entries.get(3).findElement(by.binding("poll.dateStarted"));
  this.unstartedViewResultsButton = this.entries.get(3).findElement(by.css(".viewResultsButton"));
};

describe("polls listing", function () {

  var pollsListPanel; 
  it("sets up the second page for tests", function(){
    browser.get('default.htm');
    pollsListPanel = new Elements();
    expect(pollsListPanel.hasOwnProperty("listContainer")).toEqual(true);    
  });

  it("displays a listing of all saved polls", function () {
    expect(pollsListPanel.listContainer.isDisplayed()).toBeTruthy();
  });

  describe("entry", function () {

    it("displays the status", function () {
      browser.debugger();
      expect(pollsListPanel.completedStatus.isDisplayed).toBeTruthy();
      expect(pollsListPanel.completedStatus.getText()).toEqual("started");
    });
    
    it("displays the total number polled", function () {
      expect(pollsListPanel.completedTotalPolled.isDisplayed).toBeTruthy();
      expect(pollsListPanel.completedTotalPolled.getText()).toEqual("100");
    });

    it("displays the total number responded", function () {
      expect(pollsListPanel.completedTotalResponded.isDisplayed).toBeTruthy();
      expect(pollsListPanel.completedTotalResponded.getText()).toEqual("82");
    });
    
    it("displays the poll date", function () {
      expect(pollsListPanel.completedPollDate.isDisplayed).toBeTruthy();
    });
    
    it("displays the poll type", function () {
      expect(pollsListPanel.completedPollType.isDisplayed).toBeTruthy();
      expect(pollsListPanel.completedPollType.getText()).toEqual("Battle Ping:");
    });
    
    it("displays the poll title", function () {
      expect(pollsListPanel.completedPollTitle.isDisplayed).toBeTruthy();
      expect(pollsListPanel.completedPollTitle.getText()).toEqual("Join Operation Red Dawn!");
    });

    it("has a copy button", function () {
      expect(pollsListPanel.completedCopyButton.isDisplayed()).toBeTruthy();
      expect(pollsListPanel.completedCopyButton.getText()).toEqual("Copy");
    });

    it("has a delete button", function () {
      expect(pollsListPanel.completedDeleteButton.isDisplayed()).toBeTruthy();
      expect(pollsListPanel.completedDeleteButton.getText()).toEqual("Delete");
    });

    describe("that is unstarted", function() {

      it("has an edit poll button", function () {
        expect(pollsListPanel.unstartedEditPollButton.isDisplayed()).toBeTruthy();
        expect(pollsListPanel.unstartedEditPollButton.getText()).toEqual("Edit Poll");
      });

      it("has a start poll button", function () {
        expect(pollsListPanel.unstartedStartPollButton.isDisplayed()).toBeTruthy();
        expect(pollsListPanel.unstartedStartPollButton.getText()).toEqual("Start Poll");
      });
      it("sets the poll status to start when the start button is clicked", function () {
        pollsListPanel.unstartedStartPollButton.click();
        expect(pollsListPanel.unstartedStatus.isDisplayed()).toBeTruthy();
        expect(pollsListPanel.unstartedStatus.getText()).toEqual("started");
      });

      it("reloads the page to reset the newly started poll", function(){
        /* Reload, since later tests need a virgin, unstarted poll */
        browser.get('default.htm');
        pollsListPanel = new Elements();
        expect(pollsListPanel.hasOwnProperty("listContainer")).toEqual(true);    
      });

      it("does not display number of responses", function () {
        expect(pollsListPanel.unstartedTotalPolled.isDisplayed()).toBeFalsy();
      });

      it("does not display number polled", function () {
        expect(pollsListPanel.unstartedTotalResponded.isDisplayed()).toBeFalsy();
      });

      it("does not display the poll date", function () {
        expect(pollsListPanel.unstartedPollDate.isDisplayed()).toBeFalsy();
      });

      it("does not display the view results button", function () {
        expect(pollsListPanel.unstartedViewResultsButton.isDisplayed()).toBeFalsy();
      });

    });

    describe("that is started or completed", function () {

      it("has a view results button", function() {
        expect(pollsListPanel.startedViewResultsButton.isDisplayed()).toBeTruthy();
        expect(pollsListPanel.startedViewResultsButton.getText()).toEqual("View Results");
        expect(pollsListPanel.completedViewResultsButton.isDisplayed()).toBeTruthy();
        expect(pollsListPanel.completedViewResultsButton.getText()).toEqual("View Results");
      });

      it("does not show edit poll button", function () {
        expect(pollsListPanel.startedEditPollButton.isDisplayed()).toBeFalsy();
        expect(pollsListPanel.completedEditPollButton.isDisplayed()).toBeFalsy();
      });

      it("does not show start poll button", function () {
        expect(pollsListPanel.startedStartPollButton.isDisplayed()).toBeFalsy();
        expect(pollsListPanel.completedStartPollButton.isDisplayed()).toBeFalsy();
      });

      it("displays a poll results screen for this poll when the View Results button is clicked", function () {
        var pollResultsScreen = element(by.id('pollResultsContainer'));
        expect(pollResultsScreen.isPresent()).toBeFalsy;
        pollsListPanel.completedViewResultsButton.click();
        expect(pollResultsScreen.isDisplayed()).toBeTruthy;
      });
    });

  });
});
