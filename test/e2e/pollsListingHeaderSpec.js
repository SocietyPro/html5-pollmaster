describe("pollAppCtrl", function () {

	browser.get("default.htm");

	it("has a logo on the far left", function () {
		var logo = element(by.css("img"));
		expect(logo.isDisplayed()).toBeTruthy();
	});

	it("has a peer lists button", function () {
    var peerLists = element(by.id("peerListsButton"));
		expect(peerLists.getText()).toEqual("Peer Lists");
	});

	it("shows the peer lists management screen when the peer lists button is clicked", function () {
    element(by.id('peerListsButton')).click();
		expect($("p.test").isDisplayed()).toBeTruthy();
	});

	it("has a manage templates button", function () {
    var manageTemplates = element(by.id("manageTemplatesButton"));
		expect(manageTemplates.getText()).toEqual("Manage Templates");
	});

	it("shows the manage templates screen when the manage templates button is clicked", function () {
    element(by.id('manageTemplatesButton')).click();
		expect($("p.test").isDisplayed()).toBeTruthy();
	});

	it("has a create new poll button", function () {
    var createPoll = element(by.id("createPollButton"));
		expect(createPoll.getText()).toEqual("Create Poll");
	});

	it("shows the create new poll screen when the create new poll button is clicked", function () {
    element(by.id('createPollButton')).click();
		expect($("p.test").isDisplayed()).toBeTruthy();
	});

	it("has a help button", function () {
    var help = element(by.id("helpButton"));
	});

	it("shows the help screen when the help button is clicked", function () {
    element(by.id('helpButton')).click();
		expect($("p.test").isDisplayed()).toBeTruthy();
	});
});
