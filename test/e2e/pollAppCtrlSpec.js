describe("pollAppCtrl", function () {

	browser.get("default.htm");

	it("has a logo on the far left", function () {
		var logo = element(by.css("img"));
		expect(logo.isDisplayed()).toBeTruthy;
	});

	it("has a peer lists button", function () {

	});

	it("shows the peer lists management screen when the peer lists button is clicked", function () {

	});

	it("has a manage templates button", function () {

	});

	it("shows the manage templates screen when the manage templates button is clicked", function () {

	});

	it("has a create new poll button", function () {

	});

	it("shows the create new poll screen when the create new poll button is clicked", function () {

	});

	it("has a help button", function () {

	});

	it("shows the help screen when the help button is clicked", function () {

	});
});