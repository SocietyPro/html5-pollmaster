var Elements = function () {
  this.customizePollContainer = element(by.id('customizePollContainer'));
  this.pollEditingSection = element(by.id('pollEditingSection'));
  this.pollEditTitle = element(by.model('poll.title'));
  this.pollEditType = element(by.model('poll.type'));
  this.pollEditDescription = element(by.model('poll.description'));
  this.addNewOptionLink = element(by.id('addNewOptionLink'));
  this.pollOptionsList = element(by.id('pollOptionsList'));
  this.allowMultipleChoices = element(by.id('allowMultipleChoices'));
  this.autoJoinChatRoomInput = element(by.id('autoJoinChatRoomInput'));
  this.dismissLabelInput = element(by.id('dismissLabelInput'));
  this.submitLabelInput = element(by.id('submitLabelInput'));
  this.allowComments = element(by.id('allowComments'));
  this.pollPreviewContainer = element(by.id('pollPreviewContainer'));
  this.pollSaveButton = element(by.id('pollSaveButton'));
  this.pollSaveWidget = element(by.id('pollSaveWidget'));
  this.pollSaveCheckboxes = element.all(by.css('#pollSaveWidget input[type=checkbox]'));
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
        this.subtracts = element.all(by.css('.subtract'));
      };

      it("accepts added options", function () {
        expect(elements.addNewOptionLink.isDisplayed()).toBeTruthy();
        expect(elements.addNewOptionLink.getText()).toEqual("+ Add Additional Answer");
        elements.addNewOptionLink.click();
        optionListElements = new OptionListElements();
        expect(optionListElements.firstOptionOption.isDisplayed()).toBeTruthy();
        expect(optionListElements.firstOptionOption.getTagName()).toEqual('input');
        expect(optionListElements.firstOptionOption.getAttribute('type')).toEqual('text');
      });

      it("removes subtracted options", function () {
        expect(optionListElements.subtracts.count()).toEqual(1);
        optionListElements.firstOptionSubtract.click();
        expect(optionListElements.subtracts.count()).toEqual(0);
      });

    });

    it("has an 'allow multiple selections' checkbox", function () {
      expect(elements.allowMultipleChoices.isDisplayed()).toBeTruthy();
      expect(elements.allowMultipleChoices.getAttribute("type")).toEqual("checkbox");
    });

    it("has an 'auto join chat room' input", function () {
      expect(elements.autoJoinChatRoomInput.isDisplayed()).toBeTruthy();
      expect(elements.autoJoinChatRoomInput.getTagName()).toEqual('input');
      expect(elements.autoJoinChatRoomInput.getAttribute('type')).toEqual('text');
    });

    it("has a dismiss label customization input", function () {
      expect(elements.dismissLabelInput.isDisplayed()).toBeTruthy();
      expect(elements.dismissLabelInput.getTagName()).toEqual('input');
      expect(elements.dismissLabelInput.getAttribute('type')).toEqual('text');
    });

    it("has a submit label customization input", function () {
      expect(elements.submitLabelInput.isDisplayed()).toBeTruthy();
      expect(elements.submitLabelInput.getTagName()).toEqual('input');
      expect(elements.submitLabelInput.getAttribute('type')).toEqual('text');
    });

    it("has an 'allow comments' checkbox", function () {
      expect(elements.allowComments.isDisplayed()).toBeTruthy();
      expect(elements.allowComments.getAttribute("type")).toEqual('checkbox');
    });

  });

  describe("poll preview section", function () {

    it("is displayed", function () {
      expect(elements.pollPreviewContainer.isDisplayed()).toBeTruthy();
    });
  });

  describe("bottom", function () {

    var check1, check2, check3;

    it("has a container for save controls", function(){
      expect(elements.pollSaveWidget.isDisplayed()).toBeTruthy();
    });


    describe("Checkboxes", function () {
      beforeEach(function(){
        browser.get('default.htm#/createPoll/customize');
        elements = new Elements();
        check1 = elements.pollSaveCheckboxes.get(0);
        check2 = elements.pollSaveCheckboxes.get(1);
        check3 = elements.pollSaveCheckboxes.get(2);
      });
      
      it("has a 'Save as Template' checkbox, checked by default", function(){
        expect(check1.isDisplayed()).toBeTruthy();
        expect(check1.isSelected()).toBeTruthy();
      });
   
      it("has a 'Save as Poll' checkbox, unchecked by default", function(){
        expect(check2.isDisplayed()).toBeTruthy();
        expect(check2.isSelected()).toBeFalsy();
      });
   
      it("has a 'Start Now' checkbox, unchecked by default", function(){
        expect(check3.isDisplayed()).toBeTruthy();
        expect(check3.isSelected()).toBeFalsy();
      });
    
      it("Sets the 'Start Now' checkbox to false, if 'Save as Poll' is false", function(){
        expect(check1.isSelected()).toBeTruthy();
        check1.click(); // Click the Save as Poll checkbox, toggling off
        expect(check1.isSelected()).toBeFalsy();

        expect(check3.isSelected()).toBeFalsy();
        check1.click(); // Click the Save as Poll checkbox, toggling back on
      });
  
      it("Disables the 'Start Now' checkbox, if 'Save as Poll' is false", function(){
        expect(check1.isSelected()).toBeTruthy();
        check1.click(); // Click the Save as Poll checkbox, toggling off
        expect(check1.isSelected()).toBeFalsy();

        expect(check3.getAttribute('disabled')).toBeTruthy();
        check1.click(); // Click the Save as Poll checkbox, toggling back on
        expect(check3.getAttribute('disabled')).toBeFalsy();
      });
   
      it("Greys out the 'Start Now' label text, if 'Save as Poll' is false", function(){
        expect(check1.isSelected()).toBeTruthy();
        check1.click(); // Click the Save as Poll checkbox, toggling off
        expect(check1.isSelected()).toBeFalsy();

        var greyLabels = element.all(by.css('#pollSaveWidget label.greyedOut'));
        expect(greyLabels.count()).toBe(1);
        var label = greyLabels.get(0);

        expect(label.getText()).toEqual('Start Now')
        check1.click(); // Click the Save as Poll checkbox, toggling back on
        expect(check1.isSelected()).toBeTruthy();

        var greyLabels = element.all(by.css('#pollSaveWidget label.greyedOut'));
        expect(greyLabels.count()).toBe(0);
      });
   
      it("Disables the 'Save' button, if 'Save as Poll' and 'Save as Template' are both false", function(){
        expect(check1.isSelected()).toBeTruthy();
        expect(check2.isSelected()).toBeFalsy();
        check1.click(); // Click the Save as Poll checkbox, toggling off
        expect(check1.isSelected()).toBeFalsy();
        expect(elements.pollSaveButton.getAttribute('disabled')).toBeTruthy();

        check1.click(); // Click the Save as Poll checkbox, toggling back on
      });

    });

    describe("Save Button", function () {
      it("has a 'save' button", function () {
        expect(elements.pollSaveButton.isDisplayed()).toBeTruthy();
        expect(elements.pollSaveButton.getTagName()).toEqual('button');
        expect(elements.pollSaveButton.getText()).toMatch(/Save/); // sometimes is "Save and Start"
      });

      it("switches the view to the polls list screen when clicked", function () {
        elements.pollSaveButton.click();
        // Look for a known ID:
        expect(element(by.id("pollsListContainer")).isDisplayed()).toBeTruthy();
      });

    });

  });

});
