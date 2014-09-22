var Elements  = function () {
  this.ballotCard = element(by.id('ballotCard'));
  this.ballotOriginator = element(by.id('ballotOriginator'));
  this.pollEndDate = element(by.id('pollEndDate'));
  this.ballotTitle = element(by.id('ballotTitle'));
  this.ballotDescription = element(by.id('ballotDescription'));
  this.ballotOptionsContainer = element(by.id('ballotOptionsContainer'));
  this.ballotOptions = element.all(by.css('.ballotOption'));
  this.dismissButton = element(by.id('dismissButton'));
  this.submitButton = element(by.id('submitButton'));
}

var elements;

ddescribe("voting booth", function () {

  beforeEach(function () {
    browser.get('index.html#/votingbooth/UUID1001');
    elements = new Elements();
  });

  it("displays a ballot card", function () {
    expect(elements.ballotCard.isDisplayed()).toBeTruthy();
  });

  describe("ballot card", function () {

    it("displays the ballot originator", function () {
      expect(elements.ballotOriginator.isDisplayed()).toBeTruthy();
      expect(elements.ballotOriginator.getText()).toEqual('user1@xmpp.societypro.org');
    });

    it("displays the ballot title", function () {
      expect(elements.ballotTitle.isDisplayed()).toBeTruthy();
      expect(elements.ballotTitle.getText()).toEqual('Join Operation Red Dawn!');
    });

    it("displays the ballot description", function () {
      expect(elements.ballotDescription.isDisplayed()).toBeTruthy();
      expect(elements.ballotDescription.getText()).toEqual("We are going to burn the Russian Starbase. Scythe/Moa fleet is leaving at 21:00 from V-3.")
    });

    it("displays the ballot options", function () {
      expect(elements.ballotOptionsContainer.isDisplayed()).toBeTruthy();
      expect(elements.ballotOptions.count()).toEqual(2);
      expect(elements.ballotOptions.get(0).getText()).toEqual("I'll be there");
      expect(elements.ballotOptions.get(1).getText()).toEqual("I can't go");
      var firstOptionRadio = elements.ballotOptions.get(0).findElement(by.css("input"));
      var secondOptionRadio = elements.ballotOptions.get(1).findElement(by.css("input"));
      expect(firstOptionRadio.isSelected()).toBeTruthy();
      expect(secondOptionRadio.isSelected()).toBeFalsy();
      secondOptionRadio.click();
      expect(firstOptionRadio.isSelected()).toBeFalsy();
      expect(secondOptionRadio.isSelected()).toBeTruthy();
    });

    it("has a link to display a text input if the poll allows comments", function () {
      expect(browser.isElementPresent(by.id('addCommentLink'))).toBeTruthy();
      expect(browser.isElementPresent(by.id('commentInput'))).toBeTruthy();
      var addCommentLink = element(by.id('addCommentLink'));
      var commentInput = element(by.id('commentInput'));
      expect(commentInput.isDisplayed()).toBeFalsy();
      addCommentLink.click();
      expect(browser.isElementPresent(by.id('commentInput'))).toBeTruthy();
      browser.get("index.html#/votingbooth/UUID1002");
      elements = new Elements();
      expect(browser.isElementPresent(by.id('addCommentLink'))).toBeFalsy();
    });

    it("displays a dismiss button", function () {
      expect(elements.dismissButton.isDisplayed()).toBeTruthy();
      expect(elements.dismissButton.getText()).toEqual('DISMISS');
      browser.get("index.html#/votingbooth/UUID1002");
      elements = new Elements();
      expect(elements.dismissButton.getText()).toEqual('NO SNACKS');
    });

    it("displays a submit button", function () {
      expect(elements.submitButton.isDisplayed()).toBeTruthy();
      expect(elements.submitButton.getText()).toEqual('SUBMIT');
      browser.get("index.html#/votingbooth/UUID1002");
      elements = new Elements();
      expect(elements.submitButton.getText()).toEqual('CRUNCH!');
    });

  });

});