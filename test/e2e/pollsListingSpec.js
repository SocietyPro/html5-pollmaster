browser.get('default.htm');

describe("polls listing", function () {

	it("has a listing of all saved polls", function () {
		var listContainer = element(by.id('pollsListContainer'));
		expect(listContainer.isDisplayed()).toBeTruthy();
	});

	describe("entry", function () {

		var entries = element.all(by.repeater("poll in polls"));
		var status = entries.get(0).findElement(by.binding("poll.status"));
		var totalPolled = entries.get(0).findElement(by.binding("poll.nRecipients"));
		var totalResponded = entries.get(0).findElement(by.binding("poll.nResponses"));
		var pollDate = entries.get(0).findElement(by.binding("poll.dateStarted"));
		var pollType = entries.get(0).findElement(by.binding("poll.type"));
		var pollTitle = entries.get(0).findElement(by.binding("poll.title"));

		it("displays the status", function () {
			expect(status.isDisplayed).toBeTruthy();
			expect(status.getText()).toEqual("started");
		});
		
		it("displays the total number polled", function () {
			expect(totalPolled.isDisplayed).toBeTruthy();
			expect(totalPolled.getText()).toEqual("100");
		});

		it("displays the total number responded", function () {
			expect(totalResponded.isDisplayed).toBeTruthy();
			expect(totalResponded.getText()).toEqual("82");
		});
		
		it("displays the poll date", function () {
			expect(pollDate.isDisplayed).toBeTruthy();
		});
		
		it("displays the poll type", function () {
			expect(pollType.isDisplayed).toBeTruthy();
			expect(pollType.getText()).toEqual("Battle Ping:");
		});
		
		it("displays the poll title", function () {
			expect(pollTitle.isDisplayed).toBeTruthy();
			expect(pollTitle.getText()).toEqual("Join Operation Red Dawn!");
		});

		it("has a copy button", function () {
			var copyButton = entries.get(0).findElement(by.css(".copyPollButton"));
			expect(copyButton.isDisplayed()).toBeTruthy();
			expect(copyButton.getText()).toEqual("Copy");
		});

		it("has a delete button", function () {
			var deleteButton = entries.get(0).findElement(by.css(".deletePollButton"));
			expect(deleteButton.isDisplayed()).toBeTruthy();
			expect(deleteButton.getText()).toEqual("Delete");
		});

		describe("that is unstarted", function() {

			it("has an edit poll button", function () {
				var editPollButton = entries.get(3).findElement(by.css(".editPollButton"));
				expect(editPollButton.isDisplayed()).toBeTruthy();
				expect(editPollButton.getText()).toEqual("Edit Poll");
			});

			it("has a start poll button", function () {
				var startPollButton = entries.get(3).findElement(by.css(".startPollButton"));
				expect(startPollButton.isDisplayed()).toBeTruthy();
				expect(startPollButton.getText()).toEqual("Start Poll");
			});

			it("does not display response data", function () {
				var totalPolled = entries.get(3).findElement(by.binding("poll.nRecipients"));
				var totalResponded = entries.get(3).findElement(by.binding("poll.nResponses"));
				expect(totalPolled.isDisplayed()).toBeFalsy();
				expect(totalResponded.isDisplayed()).toBeFalsy();
			});

			it("does not display the poll date", function () {
				var pollDate = entries.get(3).findElement(by.binding("poll.dateStarted"))
				expect(pollDate.isDisplayed()).toBeFalsy();
			});

			it("does not display the view results button", function () {
				var viewResultsButton = entries.get(3).findElement(by.css(".viewResultsButton"));
				expect(viewResultsButton.isDisplayed()).toBeFalsy();
			})

		});

		describe("that is started or completed", function () {

			it("has a view results button", function() {
				var startedViewResultsButton = entries.get(0).findElement(by.css(".viewResultsButton"));
				var completedViewResultsButton = entries.get(2).findElement(by.css(".viewResultsButton"));
				expect(startedViewResultsButton.isDisplayed()).toBeTruthy();
				expect(startedViewResultsButton.getText()).toEqual("View Results");
				expect(completedViewResultsButton.isDisplayed()).toBeTruthy();
				expect(completedViewResultsButton.getText()).toEqual("View Results");
			});

			it("does not show edit poll button", function () {
				var startedEditPollButton = entries.get(0).findElement(by.css(".editPollButton"));
				var completedEditPollButton = entries.get(2).findElement(by.css(".editPollButton"));
				expect(startedEditPollButton.isDisplayed()).toBeFalsy();
				expect(completedEditPollButton.isDisplayed()).toBeFalsy();
			});

			it("does not show start poll button", function () {
				var startedStartPollButton = entries.get(0).findElement(by.css(".startPollButton"));
				var completedStartPollButton = entries.get(2).findElement(by.css(".startPollButton"));
				expect(startedStartPollButton.isDisplayed()).toBeFalsy();
				expect(completedStartPollButton.isDisplayed()).toBeFalsy();
			});
		});

	});
});