var PollResults = function () {
	this.pollHeader = element(by.id('pollHeader'));
	this.logo = element(by.css("img"));
	this.backButton = element(by.id("backButton"));
  this.helpButton = element(by.id("helpButton"));
  this.title = element(by.binding("poll.title"));
  this.type = element(by.binding("poll.type"));
  this.copyButton = element(by.css(".copyPollButton"));
  this.deleteButton = element(by.css(".deletePollButton"));
  this.ballotView = element(by.id("ballotView"));
  this.status = element(by.binding("poll.status"));
  this.tallyTable = element(by.id("tallyTable"));
  this.commentsTable = element(by.css('.commentsTable'));
  this.commentName = element.all(by.repeater("comment in poll.comments")).first().element(by.binding('comment[0]'));
  this.commentComment = element.all(by.repeater("comment in poll.comments")).first().element(by.binding('comment[1]'));
  this.commentChatButton = element.all(by.repeater("comment in poll.comments")).first().element(by.css('.chatButton'));
};

/* This says those last three should work: https://github.com/angular/protractor/blob/master/docs/locators.md#finding-sub-elements */

var pollResults;

describe("poll results header", function () {

	it("sets up the page for testing", function () {
		browser.get("default.htm#/pollResults");
		pollResults = new PollResults();
		expect(pollResults.hasOwnProperty("pollHeader")).toEqual(true);
	});
		
	it("has a logo on the far left", function () {
		expect(pollResults.logo.isDisplayed()).toBeTruthy();
	});

	it("has a back to polls button", function () {
    expect(pollResults.backButton.getText()).toEqual("Back to Polls");
  });

  it("shows the polls list screen when the back to polls button is clicked", function () {
    pollResults.backButton.click();
    var pollsListContainer = element(by.id('pollsListContainer')); 
    expect(pollsListContainer.isDisplayed()).toBeTruthy();
  });

	it("has a help button", function () {
		browser.get("default.htm#/pollResults");
		pollResults = new PollResults();
    expect(pollResults.helpButton.isDisplayed()).toBeTruthy();
	});

	it("shows the help screen when the help button is clicked", function () {
    pollResults.helpButton.click();
		expect($("p.test").isDisplayed()).toBeTruthy();
	});
});

describe("poll results", function () {

	it("displays poll type", function () {
		browser.get("default.htm#/pollResults");
		pollResults = new PollResults();
		expect(pollResults.type.isDisplayed()).toBeTruthy();
		expect(pollResults.type.getText()).toEqual("Battle Ping:")
	});

	it("displays poll title", function () {
		expect(pollResults.title.isDisplayed()).toBeTruthy();
		expect(pollResults.title.getText()).toEqual("Join Operation Red Dawn!");
	});

	it("has a copy button", function () {
		expect(pollResults.copyButton.isDisplayed()).toBeTruthy();
		expect(pollResults.copyButton.getText()).toEqual("Copy");
	});

	it("has a delete button", function () {
		expect(pollResults.deleteButton.isDisplayed()).toBeTruthy();
		expect(pollResults.deleteButton.getText()).toEqual("Delete");
	});

	describe("left hand side", function () {

		it("has a ballot postview", function () {
			expect(pollResults.ballotView.isDisplayed()).toBeTruthy();
		});

	});

	describe("right hand side", function () {

		it("shows the poll status", function () {
			expect(pollResults.status.isDisplayed()).toBeTruthy();
			expect(pollResults.status.getText()).toEqual("started");
		});

		it("shows vote choices and tallys in a table", function () {
			expect(pollResults.tallyTable.isDisplayed()).toBeTruthy();
		});

		it("lists comments in a table", function () {
			expect(pollResults.commentsTable.isDisplayed()).toBeTruthy();
		});

		describe("comments table", function () {

			it("has the commenter's name on the left", function () {
        browser.get("default.htm#/pollResults");
        pollResults = new PollResults();
				expect(pollResults.commentName.getText()).toEqual("darlith");
			});
      
      it("has the comment in the middle", function () {
        browser.get("default.htm#/pollResults");
        pollResults = new PollResults();
        expect(pollResults.commentComment.getText()).toEqual("I will be 10 minutes late.");
      });

      it("has a button to open a chat with this commenter on the right", function () {
        browser.get("default.htm#/pollResults");
        pollResults = new PollResults();
        expect(pollResults.commentChatButton.isDisplayed()).toBeTruthy;
        expect(pollResults.commentChatButton.getText()).toEqual("Chat");
      });

		});

	});

});

