var PollsListPanel = function () {

	this.entries = element.all(by.repeater("poll in polls"));
	this.listContainer = element(by.id('pollsListContainer'));
	this.completedStatus = this.entries.get(0).findElement(by.binding("poll.status"));
	this.completedTotalPolled = this.entries.get(0).findElement(by.binding("poll.nRecipients"));
	this.completedTotalResponded = this.entries.get(0).findElement(by.binding("poll.nResponses"));
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
	this.unstartedEditPollButton = this.entries.get(3).findElement(by.css(".editPollButton"));
	this.unstartedStartPollButton = this.entries.get(3).findElement(by.css(".startPollButton"));
	this.unstartedTotalPolled = this.entries.get(3).findElement(by.binding("poll.nRecipients"));
	this.unstartedTotalResponded = this.entries.get(3).findElement(by.binding("poll.nResponses"));
	this.unstartedPollDate = this.entries.get(3).findElement(by.binding("poll.dateStarted"));
	this.unstartedViewResultsButton = this.entries.get(3).findElement(by.css(".viewResultsButton"));

	this.get = function () {
		browser.get('default.htm');
	};

};

describe("polls listing", function () {

	it("has a listing of all saved polls", function () {
		var pollsListPanel = new PollsListPanel;
		pollsListPanel.get();
		expect(pollsListPanel.listContainer.isDisplayed()).toBeTruthy();
	});

	describe("entry", function () {

		it("displays the status", function () {
			var pollsListPanel = new PollsListPanel;
			pollsListPanel.get();
			expect(pollsListPanel.completedStatus.isDisplayed).toBeTruthy();
			expect(pollsListPanel.completedStatus.getText()).toEqual("started");
		});
		
		it("displays the total number polled", function () {
			var pollsListPanel = new PollsListPanel;
			pollsListPanel.get();
			expect(pollsListPanel.completedTotalPolled.isDisplayed).toBeTruthy();
			expect(pollsListPanel.completedTotalPolled.getText()).toEqual("100");
		});

		it("displays the total number responded", function () {
			var pollsListPanel = new PollsListPanel;
			pollsListPanel.get();
			expect(pollsListPanel.completedTotalResponded.isDisplayed).toBeTruthy();
			expect(pollsListPanel.completedTotalResponded.getText()).toEqual("82");
		});
		
		it("displays the poll date", function () {
			var pollsListPanel = new PollsListPanel;
			pollsListPanel.get();
			expect(pollsListPanel.completedPollDate.isDisplayed).toBeTruthy();
		});
		
		it("displays the poll type", function () {
			var pollsListPanel = new PollsListPanel;
			pollsListPanel.get();
			expect(pollsListPanel.completedPollType.isDisplayed).toBeTruthy();
			expect(pollsListPanel.completedPollType.getText()).toEqual("Battle Ping:");
		});
		
		it("displays the poll title", function () {
			var pollsListPanel = new PollsListPanel;
			pollsListPanel.get();
			expect(pollsListPanel.completedPollTitle.isDisplayed).toBeTruthy();
			expect(pollsListPanel.completedPollTitle.getText()).toEqual("Join Operation Red Dawn!");
		});

		it("has a copy button", function () {
			var pollsListPanel = new PollsListPanel;
			pollsListPanel.get();
			expect(pollsListPanel.completedCopyButton.isDisplayed()).toBeTruthy();
			expect(pollsListPanel.completedCopyButton.getText()).toEqual("Copy");
		});

		it("has a delete button", function () {
			var pollsListPanel = new PollsListPanel;
			pollsListPanel.get();
			expect(pollsListPanel.completedDeleteButton.isDisplayed()).toBeTruthy();
			expect(pollsListPanel.completedDeleteButton.getText()).toEqual("Delete");
		});

		describe("that is unstarted", function() {

			it("has an edit poll button", function () {
				var pollsListPanel = new PollsListPanel;
				pollsListPanel.get();
				expect(pollsListPanel.unstartedEditPollButton.isDisplayed()).toBeTruthy();
				expect(pollsListPanel.unstartedEditPollButton.getText()).toEqual("Edit Poll");
			});

			it("has a start poll button", function () {
				var pollsListPanel = new PollsListPanel;
				pollsListPanel.get();
				expect(pollsListPanel.unstartedStartPollButton.isDisplayed()).toBeTruthy();
				expect(pollsListPanel.unstartedStartPollButton.getText()).toEqual("Start Poll");
			});

			it("does not display number of responses", function () {
				var pollsListPanel = new PollsListPanel;
				pollsListPanel.get();
				expect(pollsListPanel.unstartedTotalPolled.isDisplayed()).toBeFalsy();
			});

			it("does not display number polled", function () {
				var pollsListPanel = new PollsListPanel;
				pollsListPanel.get();
				expect(pollsListPanel.unstartedTotalResponded.isDisplayed()).toBeFalsy();
			});

			it("does not display the poll date", function () {
				var pollsListPanel = new PollsListPanel;
				pollsListPanel.get();
				expect(pollsListPanel.unstartedPollDate.isDisplayed()).toBeFalsy();
			});

			it("does not display the view results button", function () {
				var pollsListPanel = new PollsListPanel;
				pollsListPanel.get();
				expect(pollsListPanel.unstartedViewResultsButton.isDisplayed()).toBeFalsy();
			});

		});

		describe("that is started or completed", function () {

			it("has a view results button", function() {
				var pollsListPanel = new PollsListPanel;
				pollsListPanel.get();
				expect(pollsListPanel.startedViewResultsButton.isDisplayed()).toBeTruthy();
				expect(pollsListPanel.startedViewResultsButton.getText()).toEqual("View Results");
				expect(pollsListPanel.completedViewResultsButton.isDisplayed()).toBeTruthy();
				expect(pollsListPanel.completedViewResultsButton.getText()).toEqual("View Results");
			});

			it("does not show edit poll button", function () {
				var pollsListPanel = new PollsListPanel;
				pollsListPanel.get();
				expect(pollsListPanel.startedEditPollButton.isDisplayed()).toBeFalsy();
				expect(pollsListPanel.completedEditPollButton.isDisplayed()).toBeFalsy();
			});

			it("does not show start poll button", function () {
				var pollsListPanel = new PollsListPanel;
				pollsListPanel.get();
				expect(pollsListPanel.startedStartPollButton.isDisplayed()).toBeFalsy();
				expect(pollsListPanel.completedStartPollButton.isDisplayed()).toBeFalsy();
			});
		});

	});
});