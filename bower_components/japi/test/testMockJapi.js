console.log('testHarnessApp.js');
/*
describe("jasmine asynchronous spec", function() {
  it("takes a long time", function(done) {
    setTimeout(function() {
      expect(true).toBeTruthy();
      done();
    }, 2000);
  });
});
*/

var japi;
japi = new Cambrian.JAPI();

describe("mockJapi.js", function(){

  it("Synchronously instantiates JAPI", function(){
    // Moved instantiation above top describe block, so it's available if you
    // run a sibling spec solo.
    expect(japi.utils).not.toEqual({});
    expect(japi.utils).not.toEqual(undefined); // or .not.toBeDefined();
  });

  it("throws  a top-level 'function is undefined' exception", function(){
    function shouldThrow(){
      return japi.nonExistentCall();
    };
    expect(shouldThrow).toThrow();
  });

  it("throws a child-level 'function is undefined' exception", function(){
    function shouldThrow(){
      return japi.nonExistentProperty.nonExistentCall();
    };
    expect(shouldThrow).toThrow();
  });
});

describe("japi.peer", function(){
  it("exists", function(){
    expect(japi.peer).not.toEqual({});
    expect(japi.peer).not.toEqual(undefined); // or .not.toBeDefined();
  });

  describe(".ping()", function(){
    // Once implemented, ping will be called asynchronously
    it("exists", function(){
      expect(japi.peer.ping).not.toEqual({});
      expect(japi.peer.ping).not.toEqual(undefined); // or .not.toBeDefined();
    });

    it("returns a Number", function(){
      var time;
      function callback(err, timeMS){
        // time = timeMS
        // expect(typeof time).toEqual("number")
        // expect(time > 0).toBeTruthy()
        // done()
      }
      time = japi.peer.ping(callback);
      expect(typeof time).toEqual("number")
      expect(time > 0).toBeTruthy()
    });
  });

  describe(".poll.results()", function(){
    // Not yet specc'ed, putting here as a reminder
    var pollResultsSpec = undefined;
    it("is not specced", function(){
      expect(pollResultsSpec).not.toBeDefined();
    });
    it("is undefined", function(){
      expect(japi.peer.poll).not.toBeDefined();
    });
    it("throws when called", function(){
      function callPollChild(){
        results = japi.peer.poll.results()
      };
      expect(callPollChild).toThrow()
    });
  });
});

describe("japi.role", function(){
  it("exists", function(){
    expect(japi.role).not.toEqual({});
    expect(japi.role).not.toEqual(undefined); // or .not.toBeDefined();
  });

  describe(".peerList", function(){
    it("exists", function(){
      expect(japi.role.peerList).not.toEqual({});
      expect(japi.role.peerList).not.toEqual(undefined); // or .not.toBeDefined();
    });

    describe(".list()", function(){
      it("exists", function(){
        expect(japi.role.peerList.list).not.toEqual({});
        expect(japi.role.peerList.list).not.toEqual(undefined); // or .not.toBeDefined();
      });

      it("returns an Array", function(){
        lists = japi.role.peerList.list();
        expect(typeof lists).toEqual("object");
        expect(typeof lists.length).toEqual("number");
        expect(lists.pop).toBeDefined();
      });
    });

    describe(".save()", function(){
      it("exists", function(){
        expect(japi.role.peerList.save).not.toEqual({});
        expect(japi.role.peerList.save).not.toEqual(undefined); // or .not.toBeDefined();
      });

      it("returns true", function(){
        result = japi.role.peerList.save("UUID4", ["hiro", "plato"]);
        expect(result).toEqual(true);
      });
    });

    describe(".get()", function(){
      it("exists", function(){
        expect(japi.role.peerList.get).not.toEqual({});
        expect(japi.role.peerList.get).not.toEqual(undefined); // or .not.toBeDefined();
      });

      it("returns a peerList Array Object", function(){
        peerList = japi.role.peerList.get("UUID2");
        expect(typeof peerList).toEqual("object");
        expect(typeof peerList.length).toEqual("number");
        expect(peerList.pop).toBeDefined();
      });
    });

    describe(".delete()", function(){
      it("exists", function(){
        expect(japi.role.peerList.delete).not.toEqual({});
        expect(japi.role.peerList.delete).not.toEqual(undefined); // or .not.toBeDefined();
      });

      it("returns true", function(){
        result = japi.role.peerList.delete("UUID3");
        expect(result).toEqual(true);
      });
    });
  });

});

describe("japi.utils", function(){
  it("exists", function(){
    expect(japi.utils).not.toEqual({});
    expect(japi.utils).not.toEqual(undefined); // or .not.toBeDefined();
  });
  it("is aliased as util", function(){
    var utils = japi.utils;
    var util = japi.util;
    expect(utils).toBe(util);
  });
  
  describe(".getUUID()", function(){
    it("exists", function(){
      expect(japi.utils.getUUID).not.toEqual({});
      expect(japi.utils.getUUID).not.toEqual(undefined); // or .not.toBeDefined();
    });
    it("returns a UUID", function(){
      var uuid = japi.utils.getUUID();
      expect(typeof uuid).toEqual("string");
      expect(uuid).toEqual("UUID1"); // mock testing only
    });

  });

});

describe("japi.polls", function(){
  it("exists", function(){
    expect(japi.polls).not.toEqual({});
    expect(japi.polls).not.toEqual(undefined); // or .not.toBeDefined();
  });

  describe(".build constructor", function(){
    describe(".build()", function(){
      it("exists", function(){
        expect(japi.polls.build).not.toEqual({});
        expect(japi.polls.build).not.toEqual(undefined); // or .not.tobedefined();
      });
      it("returns a skeleton poll object", function(){
        var mypoll = japi.polls.build();
        expect(typeof mypoll).toEqual("object");
        expect(mypoll.id).toEqual("UUID1");
        expect(mypoll.status).toEqual("deleted");
      });
    });

    describe(".build(oldPoll)", function(){
      var oldPoll;
      var newPoll;

      it("returns a newPoll object", function(){
        oldPoll = japi.polls.build();
        newPoll = japi.polls.build(oldPoll);
        expect(typeof newPoll).toEqual("object");
        expect(typeof newPoll.save).toEqual("function");
      });
      it("copies the appropriate properties from oldPoll to newPoll", function(){
        expect(newPoll.title).toEqual(oldPoll.title);
      });
      it("sets some properties of newPoll to .build() defaults", function(){
        expect(newPoll.id).not.toEqual(oldPoll.id);
        expect(newPoll.dateStarted).toBeNull();
        expect(newPoll.status).toEqual("deleted");
      });
    });

    describe(".build(pollTemplate)", function(){
      var pollTemplateSpec = undefined;
      it("is not specced", function(){
        expect(pollTemplateSpec).not.toBeDefined();
      });
    });

    describe("polls.getList()", function(){
      it("exists", function(){
        expect(japi.polls.getList).not.toEqual({});
        expect(japi.polls.getList).not.toEqual(undefined); // or .not.tobedefined();
      });

      it("returns an array of poll objects", function(){
        var myPolls = japi.polls.getList();
        expect(typeof myPolls).toEqual("object");
        expect(typeof myPolls.length).toEqual("number");
        expect(myPolls[0].id).not.toEqual(myPolls[1].id);
      });
    });

    describe("polls.get(id)", function(){
      it("exists", function(){
        expect(japi.polls.get).not.toEqual({});
        expect(japi.polls.get).not.toEqual(undefined); // or .not.tobedefined();
      });

      it("returns a found poll object by ID", function(){
        var myPoll = japi.polls.get("UUID1");
        expect(typeof myPoll).toEqual("object");
        expect(typeof myPoll.title).toEqual("string");
        expect(myPoll.id).toEqual("UUID1");
      });

      it("returns false if no poll object is found", function(){
        var myPoll = japi.polls.get("UUID100");
        expect(myPoll).toBe(false);
      });
    });

  });

});
