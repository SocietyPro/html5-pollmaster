var Elements = function () {
  this.templateManager = element(by.id('templateManager'));
  this.sectionTabs = element(by.id('sectionTabs'));
  this.myTemplatesTab = element(by.id('myTemplatesTab'));
  this.myTemplatesTabContent = element(by.id('myTemplatesTabContent'));
  this.recentPollsTab = element(by.id('recentPollsTab'));
  this.recentPollsTabContent = element(by.id('recentPollsTabContent'));
  this.examplesTab = element(by.id('examplesTab'));
  this.examplesTabContent = element(by.id('examplesTabContent'));
  this.peerRecommendedTab = element(by.id('peerRecommendedTab'));
  this.peerRecommendedTabContent = element(by.id('peerRecommendedTabContent'));
  this.createTemplateFromScratchButton = element(by.id('createTemplateFromScratchButton'));
};

var elements;

describe("templates manager page", function () {

  it("sets up the page for testing", function () {
    browser.get('default.htm#/manageTemplates');
    elements = new Elements();
    expect(elements.templateManager.isDisplayed()).toBeTruthy();
  });

  describe("template manager", function () {

    it("has tabbed sections", function () {
      expect(elements.sectionTabs.isDisplayed()).toBeTruthy();
    });

    it("shows the role's templates when the My Templates tab is clicked", function () {
      elements.recentPollsTab.click();
      expect(elements.myTemplatesTabContent.isDisplayed()).toBeFalsy();
      elements.myTemplatesTab.click();
      expect(elements.myTemplatesTabContent.isDisplayed()).toBeTruthy();
    });

    it("shows the 'copy from recent polls' tab when that tab is clicked", function () {
      expect(elements.recentPollsTabContent.isDisplayed()).toBeFalsy();
      elements.recentPollsTab.click();
      expect(elements.recentPollsTabContent.isDisplayed()).toBeTruthy();
    });

    it("shows the 'copy from examples' tab when that tab is clicked", function () {
      expect(elements.examplesTabContent.isDisplayed()).toBeFalsy();
      elements.examplesTab.click();
      expect(elements.examplesTabContent.isDisplayed()).toBeTruthy();
    });

    it("shows the 'copy from peer recommended' tab when that tab is clicked", function () {
      expect(elements.peerRecommendedTabContent.isDisplayed()).toBeFalsy();
      elements.peerRecommendedTab.click();
      expect(elements.peerRecommendedTabContent.isDisplayed()).toBeTruthy();
    });

    it("has a 'create new template from scratch' button", function () {
      expect(elements.createTemplateFromScratchButton.isDisplayed()).toBeTruthy();
    });

  });

});