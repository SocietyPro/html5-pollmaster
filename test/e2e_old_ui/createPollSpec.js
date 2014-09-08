var Elements = function () {
  	this.templateManager = element(by.id('templateManager'));
    this.sectionTabs = element(by.id('sectionTabs'));
    this.recentTab = element(by.id('recentTab'));
    this.recentTabContent = element(by.id('recentTabContent'));
    this.myTemplatesTab = element(by.id('myTemplatesTab'));
    this.myTemplatesTabContent = element(by.id('myTemplatesTabContent'));
    this.examplesTab = element(by.id('examplesTab'));
    this.examplesTabContent = element(by.id('examplesTabContent'));
    this.peerRecommendedTab = element(by.id('peerRecommendedTab'));
    this.peerRecommendedTabContent = element(by.id('peerRecommendedTabContent'));
};

var pollTemplates;

describe("new poll using a template page", function () {

    it("sets up the page for testing", function () {
        browser.get('index.html#/createPoll');
        pollTemplates = new Elements();
        expect(pollTemplates.templateManager.isDisplayed()).toBeTruthy();
    });

    describe("template manager", function () {

        it("has tabbed sections", function () {
            expect(pollTemplates.sectionTabs.isDisplayed()).toBeTruthy();
        });
    });

    it("shows recent polls when the Recent tab is clicked", function () {
        pollTemplates.recentTab.click();
        expect(pollTemplates.recentTabContent.isDisplayed()).toBeTruthy();
    });

    it("shows the role's templates when the My Templates tab is clicked", function () {
        pollTemplates.myTemplatesTab.click();
        expect(pollTemplates.myTemplatesTabContent.isDisplayed()).toBeTruthy();
    });

    it("shows the example templates when the Examples tab is clicked", function () {
        pollTemplates.examplesTab.click();
        expect(pollTemplates.examplesTabContent.isDisplayed()).toBeTruthy();
    });

    it("shows peer recommended templates when the Peer Recommended tab is clicked", function () {
        pollTemplates.peerRecommendedTab.click();
        expect(pollTemplates.peerRecommendedTabContent.isDisplayed()).toBeTruthy();
    });

});
