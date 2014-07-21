var PollsListHeader = function () {
	this.pollHeader = element(by.id('pollHeader'));
	this.logo = element(by.css("img"));
	this.peerLists = element(by.id("peerListsButton"));
	this.manageTemplates = element(by.id("manageTemplatesButton"));
	this.createPoll = element(by.id("createPollButton"));
    this.help = element(by.id("helpButton"));
};

describe("polls listing header", function () {
	var pollsListHeader;

	it("sets up the page for testing", function () {
		browser.get("default.htm");
		pollsListHeader = new PollsListHeader();
		expect(pollsListHeader.hasOwnProperty("pollHeader")).toEqual(true);
	});
		
	it("has a logo on the far left", function () {
		expect(pollsListHeader.logo.isDisplayed()).toBeTruthy();
	});

	it("has a peer lists button", function () {
		expect(pollsListHeader.peerLists.getText()).toEqual("Peer Lists");
	});

	it("shows the peer lists management screen when the peer lists button is clicked", function () {
    	element(by.id('peerListsButton')).click();
		expect($("p.test").isDisplayed()).toBeTruthy();
	});

	it("has a manage templates button", function () {
		expect(pollsListHeader.manageTemplates.getText()).toEqual("Manage Templates");
	});

	it("shows the manage templates screen when the manage templates button is clicked", function () {
    	element(by.id('manageTemplatesButton')).click();
		expect($("p.test").isDisplayed()).toBeTruthy();
	});

	it("has a create new poll button", function () {
		expect(pollsListHeader.createPoll.getText()).toEqual("Create Poll");
	});

	it("shows the create new poll screen when the create new poll button is clicked", function () {
    	element(by.id('createPollButton')).click();
		expect($("p.test").isDisplayed()).toBeTruthy();
	});

	it("has a help button", function () {
    	expect(pollsListHeader.help.isDisplayed()).toBeTruthy();
	});

	it("shows the help screen when the help button is clicked", function () {
    	element(by.id('helpButton')).click();
		expect($("p.test").isDisplayed()).toBeTruthy();
	});
});

