var Elements = function () {
	this.pollHeader = element(by.id('pollHeader'));
	this.logo = element(by.css("img"));
	this.backButton = element(by.id("backButton"));
  this.helpButton = element(by.id("helpButton"));
  this.title = element(by.id("pollTitle"));
  this.type = element(by.id("pollType"));
  this.copyButton = element(by.css(".copyPollButton"));
  this.deleteButton = element(by.css(".deletePollButton"));
  this.ballotView = element(by.id("ballotView"));
  this.status = element(by.binding("poll.status"));
  this.tallyTable = element(by.id("tallyTable"));
  this.commentsTable = element(by.css('.commentsTable'));

  /* This was breaking under some circumstances:
  this.commentName = element.all(by.repeater("comment in poll.comments")).first().element(by.binding('comment[0]'));
  Further docs: 
  https://github.com/angular/protractor/blob/master/docs/locators.md#finding-sub-elements
  */
  this.commentName = element(by.repeater("comment in poll.comments").row(0)).element(by.binding('comment[0]'));
  this.commentComment = element(by.repeater("comment in poll.comments").row(0)).element(by.binding('comment[1]'));
  this.commentChatButton = element(by.repeater("comment in poll.comments").row(0)).element(by.css('.chatButton'));
};


var pollResults;

describe("javascript backend setup", function(){
  describe("pollResults, pre-setup", function(){
    it("is undefined", function(){
      expect(pollResults).not.toBeDefined();
    });
  });
  describe("Elements", function(){
    it("is in scope", function(){
      expect(Elements).not.toEqual({});
      expect(Elements).toBeDefined();
    });
  });
  describe("pollResults, post-setup", function(){
    it("is not undefined", function(){
      /* SETUP HERE: */
      browser.get("default.htm#/pollResults");
      pollResults = new Elements();
      expect(pollResults).toBeDefined();
    });
    it("instantiated as an object", function(){
      expect(typeof pollResults).toEqual("object");
    });
    it("has a property pollHeader", function(){
      expect(pollResults.hasOwnProperty("pollHeader")).toEqual(true);
    });
    it("has the pollHeader element as the value of the pollHeader property", function(){
      expect(pollResults.hasOwnProperty("pollHeader")).toEqual(true);
    });
  });

});

describe("poll results header", function () {

		
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
		pollResults = new Elements();
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
		pollResults = new Elements();
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
        pollResults = new Elements();
				expect(pollResults.commentName.getText()).toEqual("darlith");
			});
      
      it("has the comment in the middle", function () {
        browser.get("default.htm#/pollResults");
        pollResults = new Elements();
        expect(pollResults.commentComment.getText()).toEqual("I will be 10 minutes late.");
      });

      it("has a button to open a chat with this commenter on the right", function () {
        browser.get("default.htm#/pollResults");
        pollResults = new Elements();
        expect(pollResults.commentChatButton.isDisplayed()).toBeTruthy;
        expect(pollResults.commentChatButton.getText()).toEqual("Chat");
      });

		});

	});

});

