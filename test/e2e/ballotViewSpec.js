var BallotView = function () {
  this.partial = element(by.id('ballotView'));
  this.title = element(by.id('ballotTitle'));
  this.originator = element(by.id('ballotOriginator'));
  this.date = element(by.id('ballotDate'));
  this.description = element(by.id('ballotDescription'));

};

describe("ballot view", function () {

  var ballotView;

  it("sets up the partial up for tests", function () {
    browser.get('default.htm');
    element(by.repeater('poll in polls').row(0)).element(by.css('.viewResultsButton')).click();
    ballotView = new BallotView();
  });

  it("has a ballot title", function () {
    expect(ballotView.title.isDisplayed()).toBeTruthy();
    expect(ballotView.title.getText()).toEqual('Battle Ping: Join Operation Red Dawn!')
  });

  it("has the originator line", function () {
    expect(ballotView.originator.isDisplayed()).toBeTruthy();
    expect(ballotView.originator.getText()).toEqual('BallotCreator says:')
  });

  it("has the ballot start date/time", function () {
    expect(ballotView.date.isDisplayed()).toBeTruthy();
  });

  it("has the ballot description", function () {
    expect(ballotView.description.isDisplayed()).toBeTruthy();
    expect(ballotView.description.getText()).toEqual("We are going to burn the Russian Starbase. Scythe/Moa fleet is leaving at 21:00 from V-3.")
  });

});