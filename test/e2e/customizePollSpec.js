var Elements = function () {
  this.customizePollContainer = element(by.id('customizePollContainer'));
  this.pollEditingSection = element(by.id('pollEditingSection'));
  this.pollEditTitle = element(by.model('poll.title'));
  this.pollEditType = element(by.model('poll.type'));
  this.pollEditDescription = element(by.model('poll.description'));
  this.pollOptionsList = element(by.id('pollOptionsList'));
  this.allowMultipleOptions = element(by.id('allowMultipleOptions'));
  this.autoJoinChatRoomInput = element(by.id('autoJoinChatRoomInput'));
  this.dismissLabelInput = element(by.id('dismissLabelInput'));
  this.submitLabelInput = element(by.id('submitLabelInput'));
};

var elements;

describe("Customize poll/template screen", function () {

  it("sets up the test page", function () {
    browser.get('default.htm#/createPoll/customize');
    elements = new Elements();
    expect(elements.customizePollContainer.isDisplayed()).toBeTruthy();
  });

  describe("poll editing section", function() {

    it("is displayed", function () {
      expect(elements.pollEditingSection.isDisplayed()).toBeTruthy();
    });

    it("has a place to edit the poll title", function () {
      expect(elements.pollEditTitle.isDisplayed()).toBeTruthy();
      expect(elements.pollEditTitle.getTagName()).toEqual('input');
      expect(elements.pollEditTitle.getAttribute('type')).toEqual('text');  
    });

    it("has a place to edit the poll type", function () {
      expect(elements.pollEditType.isDisplayed()).toBeTruthy();
      expect(elements.pollEditType.getTagName()).toEqual('input');
      expect(elements.pollEditType.getAttribute('type')).toEqual('text');
    });

    it("has a place to edit the poll description", function () {
      expect(elements.pollEditDescription.isDisplayed()).toBeTruthy();
      expect(elements.pollEditDescription.getTagName()).toEqual('input');
      expect(elements.pollEditDescription.getAttribute('type')).toEqual('text');
    });

    it("has a place to list the poll options", function () {
      expect(elements.pollOptionsList.isDisplayed()).toBeTruthy();
    });

    describe("poll options list", function () {

      var OptionListElements = function () {
        this.firstOption = element(by.repeater('option in poll.options').row(0));
        this.firstOptionOption = this.firstOption.element(by.model('option.text'));
        this.firstOptionSubtract = this.firstOption.element(by.css('.subtract'));
      };

      it("accepts added options", function () {
        expect(elements.newOptionInput.isDisplayed()).toBeTruthy();
        expect(elements.newOptionInput.getTagName()).toEqual('input');
        expect(elements.newOptionInput.getAttribute('type')).toEqual('text');
        elements.newOptionInput.sendKeys("Option1");
        expect(elements.addOption.isDisplayed()).toBeTruthy();
        expect(elements.newOptionInput.getTagName()).toEqual('button');
        expect(elements.newOptionInput.getText()).toEqual('Add');
        elements.addOption.click();
        optionListElements = new OptionListElements();
        expect(optionListElements.firstOption.isDisplayed()).toBeTruthy();
        expect(optionListElements.firstOptionOption.getText()).toEqual("Option1");
      });

      it("removes subtracted options", function () {
        expect(optionListElements.firstOption.isDisplayed()).toBeTruthy();
        optionListElements.firstOptionSubtract.click();
        expect(optionListElements.firstOption.isDisplayed()).toBeFalsy();
      });

    });

    it("has an 'allow multiple selections' checkbox", function () {
      expect(elements.allowMultipleOptions.isDisplayed()).toBeTruthy();
      expect(elements.allowMultipleOptions.getAttribute("type")).toEqual("checkbox");
    });

    it("has an 'auto join chat room' input", function () {
      expect(elements.autoJoinChatRoomInput.isDisplayed()).toBeTruthy();
    });

    it("has a dismiss label customization input", function () {
      expect(elements.dismissLabelInput.isDisplayed()).toBeTruthy();
    });

    it("has a submit label customization input", function () {
      expect(elements.submitLabelInput.isDisplayed()).toBeTruthy();
    });

    it("has an 'allow comments' checkbox", function () {
      expect(elements.allowComments.isDisplayed()).toBeTruthy();
      expect(elements.allowComments.getAttribute("type")).toEqual('checkbox');
    });

  });

});
