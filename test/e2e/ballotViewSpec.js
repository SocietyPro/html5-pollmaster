var Elements = function () {
  this.partial = element(by.id('ballotView'));
  this.titleConcatenation = element(by.binding('poll.title'));
  this.originatorLine = element(by.binding('poll.originator'));
  this.date = element(by.id('ballotDate'));
  this.description = element(by.binding('poll.description'));
  this.optionsContainer = element(by.id('ballotOptions'));
  this.options = element(by.repeater('option in poll.options'));
  this.closeButton = element(by.id('closeButton'));
  this.dismissButton = element(by.id('submitButton'))
  this.dismissText = element(by.binding('poll.dismissText'));
  this.submitText = element(by.binding('poll.submitText'));
};

var FormControls = function () {
  this.pollEditTitle = element(by.model('poll.title'));
  this.pollEditType = element(by.model('poll.type'));
  this.pollEditDescription = element(by.model('poll.description'));
  this.addNewOptionLink = element(by.id('addNewOptionLink'));
  this.allowMultipleOptions = element(by.model('poll.allowMultipleOptions'));
  this.autoJoinChatRoomInput = element(by.model('defaultChatRoom'));
  this.dismissLabelInput = element(by.id('dismissLabelInput'));
  this.submitLabelInput = element(by.id('submitLabelInput'));
  this.allowComments = element(by.model('poll.allowComments'));
};

describe("ballot view", function () {

  var ballotView, formControls;

  it("sets up the partial up for tests", function () {
    browser.get('default.htm');
    element(by.id('createPollButton')).click();
    element(by.id('newTemplateFromScratchButton')).click();
    ballotView = new Elements();
    formControls = new FormControls;
    expect(ballotView.partial.isDisplayed()).toBeTruthy();
  });

  it("displays the ballot title", function () {
    formControls.pollEditType.sendKeys('Battle Ping');
    formControls.pollEditTitle.sendKeys('Join Operation Red Dawn!')
    expect(ballotView.titleConcatenation.isDisplayed()).toBeTruthy();
    expect(ballotView.titleConcatenation.getText()).toEqual('Battle Ping: Join Operation Red Dawn!')
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

  it("does not display the ballot options container if there are no ballot options", function () {
    expect(ballotView.optionsContainer.isDisplayed()).toBeFalsy();
  });

  it("has a 'close' button if there are no ballot options", function () {
    expect(ballotView.closeButton.isDisplayed()).toBeTruthy;
    expect(ballotView.closeButton.getText()).toEqual('Close');
    expect(ballotView.dismissButton.isDisplayed()).toBeFalsy();
    expect(ballotView.submitButton.isDisplayed()).toBeFalsy();
  });

  it("displays the ballot options container if there are ballot options", function () {
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

  description("options container", function () {

    var OptionsListElements = function () {
      this.formOptions = element.all(by.repeater('option in poll.options')).get(0);
      this.ballotViewOptions = element.all(by.repeater('option in poll.options')).get(1);
      this.firstFormOptionText = this.formOptions.row(0).element(by.model('option'));
      this.firsBallotViewOptionText = this.ballotViewOptions.row(0).element(by.binding('option'));
      this.secondFormOptionText = this.formOptions.row(1).element(by.model('option'));
      this.secondBallotViewOptionText = this.ballotViewOptions.row(1).element(by.binding('option'));
    };

    var CommentBoxElements = function () {
      this.commentBoxContainer = element(by.id('commentBoxContainer'));
      this.commentBoxLable = element(by.binding('poll.originator || "BallotCreator'));
      this.commentBox = element(by.id('commentBox'));
    };

    var optionsListElements, commentBoxElements;

    it("has a 'selection instructions' heading that changes with the type of poll", function () {
      expect(ballotView.selectionInstructions.getText()).toEqual("Select One:");
      formControls.allowMultipleOptions.click();
      expect(ballotView.selectionInstructions.getText()).toEqual("Select One or More:");
    });

    it("shows the poll options with checkboxes for 'choose multiple'", function () {
      formControls.addNewOptionLink.click();
      optionsListElements = new OptionsListElements();
      optionsListElements.firstFormOptionText.sendKeys('Option1');
      expect(firsBallotViewOptionText.getTagName()).toEqual('input');
      expect(firsBallotViewOptionText.getAttribute('type')).toEqual('checkbox');
      expect(firsBallotViewOptionText.getText()).toEqual('Option1');
      optionsListElements.secondFormOptionText.sendKeys('Option2');
      expect(secondBallotViewOptionText.getText()).toEqual('Option2');
    });

    it("shows the poll options with radio buttons for 'choose one'", function () {
      formControls.allowMultipleOptions.click();
      expect(firsBallotViewOptionText.getAttribute('type')).toEqual('radio');
    });

    it("has a comment box if 'allow comments' is enabled", function () {
      commentBoxElements = new CommentBoxElements();
      expect(commentBoxElements.commentBoxContainer.isDisplayed()).toBeFalsy();
      formControls.allowComments.click();
      expect(commentBoxElements.commentBoxContainer.isDisplayed()).toBeTruthy();
      expect(commentBoxElements.commentBoxLable.getText()).toEqual('Send a note to BallotCreator:');
      expect(commentBoxElements.commentBox.getTagName()).toEqual('input');
      expect(commentBoxElements.commentBox.getAttribute('type')).toEqual('text');
    });

  });

});
