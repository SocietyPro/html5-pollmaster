var indexFile = "index.html";
var Elements = function () {
  this.partial = element(by.id('ballotView'));
  this.titleConcatenation = element(by.binding('poll.title'));
  this.originatorLine = element(by.id('ballotOriginator'));
  this.date = element(by.id('ballotDate'));
  this.description = element(by.binding('poll.description'));
  this.optionsContainer = element(by.id('ballotOptions'));
  this.options = element(by.repeater('option in poll.options'));
  this.closeButton = element(by.id('closeButton'));
  this.submitButton = element(by.id('submitButton'));
  this.dismissButton = element(by.id('dismissButton'));
}

var FormControls = function () {
  this.pollEditTitle = element(by.model('poll.title'));
  this.pollEditType = element(by.model('poll.type'));
  this.pollEditDescription = element(by.model('poll.description'));
  this.addNewOptionLink = element(by.id('addNewOptionLink'));
  this.allowMultipleChoices = element(by.model('poll.allowMultipleChoices'));
  this.autoJoinChatRoomInput = element(by.model('defaultChatRoom'));
  this.dismissLabelInput = element(by.id('dismissLabelInput'));
  this.submitLabelInput = element(by.id('submitLabelInput'));
  this.allowComments = element(by.model('poll.allowComments'));
};

var selectDropdownbyNum = function ( element, optionNum ) {
  if (optionNum){
    var options = element.findElements(by.tagName('option'))   
      .then(function(options){
        options[optionNum].click();
      });
  }
};

describe("ballot view", function () {

  var ballotView, formControls;

  it("sets up the partial up for tests", function () {
    browser.get(indexFile);
    element(by.id('createPollButton')).click();
    element(by.id('newPollFromScratchButton')).click();
    ballotView = new Elements();
    formControls = new FormControls;
    expect(ballotView.partial.isDisplayed()).toBeTruthy();
  });

  it("displays the ballot title", function () {
    formControls.pollEditTitle.sendKeys('Join Operation Red Dawn!')
    selectDropdownbyNum(formControls.pollEditType, 1);
    expect(ballotView.titleConcatenation.isDisplayed()).toBeTruthy();
    expect(ballotView.titleConcatenation.getText()).toEqual('Eve Battle Ping: Join Operation Red Dawn!')
  });

  it("displays the originator line", function () {
    expect(ballotView.originatorLine.isDisplayed()).toBeTruthy();
    expect(ballotView.originatorLine.getText()).toEqual('BallotCreator says:')
  });

  it("displays the ballot start date/time", function () {
    expect(ballotView.date.isDisplayed()).toBeTruthy();
  });

  it("displays the ballot description", function () {
    formControls.pollEditDescription.sendKeys("We are going to burn the Russian Starbase. Scythe/Moa fleet is leaving at 21:00 from V-3.")
    expect(ballotView.description.isDisplayed()).toBeTruthy();
    expect(ballotView.description.getText()).toEqual("We are going to burn the Russian Starbase. Scythe/Moa fleet is leaving at 21:00 from V-3.")
  });

  it("has a 'close' button if there are no ballot options", function () {
    expect(ballotView.closeButton.isDisplayed()).toBeTruthy;
    expect(ballotView.closeButton.getText()).toEqual('Close');
    expect(ballotView.dismissButton.isDisplayed()).toBeFalsy();
    expect(ballotView.submitButton.isDisplayed()).toBeFalsy();
  });

  it("displays the ballot options container if there are ballot options", function () {
    expect(ballotView.optionsContainer.isDisplayed()).toBeFalsy();
    formControls.addNewOptionLink.click();
    expect(ballotView.optionsContainer.isDisplayed()).toBeTruthy();
  });

  it("has 'submit' and 'dismiss' buttons if there are ballot options", function () {
    expect(ballotView.submitButton.isDisplayed()).toBeTruthy();
    expect(ballotView.submitButton.getText()).toEqual('Submit');
    formControls.submitLabelInput.sendKeys('Respond');
    expect(ballotView.submitButton.getText()).toEqual('Respond');
    expect(ballotView.dismissButton.isDisplayed()).toBeTruthy();
    expect(ballotView.dismissButton.getText()).toEqual('Dismiss');
    formControls.dismissLabelInput.sendKeys('Ignore');
    expect(ballotView.dismissButton.getText()).toEqual('Ignore');
  });

  describe("options container", function () {

    var OptionsFormElements = function () {
      this.firstFormOptionText = element.all(by.model('option.text')).get(0);
      this.secondFormOptionText = element.all(by.model('option.text')).get(1);
    };

    var OptionsListElements = function () {
      this.selectOne = element(by.id('selectOne'));
      this.selectMultiple = element(by.id('selectMultiple'));
      this.selectOneOptionOne = element.all(by.binding('option.text')).get(0);
      this.selectOneOptionTwo = element.all(by.binding('option.text')).get(1);
      this.selectMultipleOptionOne = element.all(by.binding('option.text')).get(2);
      this.selectMultipleOptionTwo = element.all(by.binding('option.text')).get(3);
    };

    var CommentBoxElements = function () {
      this.commentBoxContainer = element(by.id('commentBoxContainer'));
      this.commentBoxLabel = element(by.id('commentBoxLabel'));
      this.commentBox = element(by.id('commentBox'));
    };

    var optionsFormElements, optionsListElements, commentBoxElements;

    it("shows a multiple choice form if multiple selections are not allowed", function () {
      formControls.addNewOptionLink.click();
      optionsFormElements = new OptionsFormElements();
      optionsListElements = new OptionsListElements();
      optionsFormElements.firstFormOptionText.sendKeys('Option1');
      optionsFormElements.secondFormOptionText.sendKeys('Option2');
      expect(optionsListElements.selectOne.isDisplayed()).toBeTruthy();
      expect(optionsListElements.selectMultiple.isDisplayed()).toBeFalsy();
      expect(optionsListElements.selectOneOptionOne.getText()).toEqual('Option1');
      expect(optionsListElements.selectOneOptionTwo.getText()).toEqual('Option2');
    });

    it("shows a multiple selection form if multiple selections are allowed", function () {
      formControls.allowMultipleChoices.click();
      expect(optionsListElements.selectOne.isDisplayed()).toBeFalsy();
      expect(optionsListElements.selectMultiple.isDisplayed()).toBeTruthy();
      expect(optionsListElements.selectMultipleOptionOne.getText()).toEqual('Option1');
      expect(optionsListElements.selectMultipleOptionTwo.getText()).toEqual('Option2');
    });

    it("has a comment box if 'allow comments' is enabled", function () {
      commentBoxElements = new CommentBoxElements();
      expect(commentBoxElements.commentBoxContainer.isDisplayed()).toBeFalsy();
      formControls.allowComments.click();
      expect(commentBoxElements.commentBoxContainer.isDisplayed()).toBeTruthy();
      expect(commentBoxElements.commentBoxLabel.getText()).toEqual('Send a note to BallotCreator:');
      expect(commentBoxElements.commentBox.getTagName()).toEqual('input');
      expect(commentBoxElements.commentBox.getAttribute('type')).toEqual('text');
    });

  });

});
