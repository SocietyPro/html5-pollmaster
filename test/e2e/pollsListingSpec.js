describe("polls listing", function () {
	
	browser.get('default.htm');

	it("has a listing of all saved polls", function () {
		var listContainer = element(by.id('listContainer'));
		expect(listContainer.isDisplayed()).toBeTruthy();
	});

	describe("entry", function () {

		var entries = element.all(by.repeater("poll in polls"));
		var status = entries[0].findElement(by.binding("poll.status"));
		var totalPolled = entries[0].findElement(by.binding("poll.nRecipients"));
		var totalResponded = entries[0].findElement(by.binding("poll.nResponses"));
		var pollDate = entries[0].findElement(by.binding("poll.dateStarted"));
		var pollType = entries[0].findElement(by.binding("poll.type"));
		var pollTitle = entries[0].findElement(by.binding("poll.title"));
		var pollDescription = entries[0].findElement(by.binding("poll.description"));

		it("displays the status", function () {
			expect(status.isDisplayed).toBeTruthy();
			expect(status.getText()).toEqual("started");
		});
		
		it("displays the total number polled", function () {
			expect(totalPolled.isDisplayed).toBeTruthy();
			expect(totalPolled.getText()).toEqual(100);
		});

		it("displays the total number responded", function () {
			expect(totalResponded.isDisplayed).toBeTruthy();
			expect(totalResponded.getText()).toEqual(82);
		});
		
		it("displays the poll date", function () {
			expectedDate = new Date("2014-07-18");
			expect(pollDate.isDisplayed).toBeTruthy();
			expect(pollDate.getText()).toEqual(expectedDate);
		});
		
		it("displays the poll type", function () {
			expect(pollType.isDisplayed).toBeTruthy();
			expect(pollType.getText()).toEqual("Battle Ping");
		});
		
		it("displays the poll title", function () {
			expect(pollTitle.isDisplayed).toBeTruthy();
			expect(pollTitle.getText()).toEqual("Join Operation Red Dawn!");
		});
		
		it("displays the poll description", function () {
			expect(pollDescription.isDisplayed).toBeTruthy();
			expect(pollDescription.getText()).toEqual("We are going to burn the Russian Starbase. Scythe/Moa fleet is leaving at 21:00 from V-3.");
		});

		it("has a copy button", function () {
			var copyButton = entries[0].findElement(by.css(".copyPollButton"));
			expect(copyButton.isDisplayed()).toBeTruthy();
			expect(copyButton.getText()).toEqual("Copy");
		});

		it("has a delete button", function () {
			var deleteButton = entries[0].findElement(by.css(".deletePollButton"));
			expect(deleteButton.isDisplayed()).toBeTruthy();
			expect(deleteButton.getText()).toEqual("Delete");
		});

		describe("that is unstarted", function() {

			it("has an edit poll button", function () {
				var editPollButton = entries[3].findElement(by.css(".editPollButton"));
				expect(editPollButton.isDisplayed()).toBeTruthy();
				expect(editPollButton.getText()).toEqual("Edit Poll");
			});

			it("has a start poll button", function () {
				var startPollButton = entries[3].findElement(by.css(".startPollButton"));
				expect(startPollButton.isDisplayed()).toBeTruthy();
				expect(startPollButton.getText()).toEqual("Start Poll");
			});

			it("does not display the poll date", function () {
				var pollDate = entries[3].findElement(by.binding("poll.dateStarted"))
				expect(pollDate.isPresent()).toBeFalsy();
			});

		});

		describe("that is started or completed", function () {

			it("has a view results button", function() {
				var startedShowResultsButton = entries[0].findElement(by.css(".showResultsButton"));
				var completedShowResultsButton = entries[2].findElement(by.css(".showResultsButton"));
				expect(startedShowResultsButton.isPresent()).toBeTruthy();
				expect(startedShowResultsButton.getText()).toEqual("View Results");
			});
		});

	});
});