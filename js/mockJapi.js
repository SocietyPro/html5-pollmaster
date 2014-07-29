var Cambrian = Cambrian || {}
Cambrian.JAPI = function(){
  // Define some children objects, this is necessary because trying to set
  // more than one deep of an undefined object fails.
  // {}.foo=true works but {}.foo.bar=true doesn't: 
  // TypeError: Cannot set property 'bar' of undefined

  var japi = {
    peer: {
      ping: {},
      recommendations: {},
      polls: {},
    },
    role: {
      peerList: {},
    },
    utils: {
    },
    polls: {
      myTemplates: {},
    },
  }

  /* 
   * JAPI PEER API
   * These functions involve communications with other Cambrian Peers
   */

  japi.peer.ping = function(callback){
    //setTimeout(function(){ callback(null, false) }, 200);
    return 33;
  }

  /* // NOT YET SPECCED:
  japi.peer.polls.results = function(cambrianID, UUID, callback){
    setTimeout(function(){ callback(null, false) }, 200);
  };
  */

  /*
   * JAPI ROLE API
   * These functions are like japi.utils. The difference is utils are
   * convenience functions that always do the same thing for every user and
   * role. japi.role is where we put functions that handle role-specific data.
   */

  japi.role.peerList.list = function(callback){
    //setTimeout(function(){ callback(null, false) }, 200);
    return [["hiro", "plato"], ["hiro", "henry", "harriet"]];
  };

  japi.role.peerList.save = function(UUID, peerListObj, callback){
//    setTimeout(function(){ callback(null, false) }, 200);
    return true;
  };
  japi.role.peerList.get = function(UUID, callback){
    //setTimeout(function(){ callback(null, false) }, 200);
    return ["hiro", "plato"];
  };
  japi.role.peerList.delete = function(UUID, callback){
    //setTimeout(function(){ callback(null, false) }, 200);
    return true;
  };
  
  /*
   * JAPI UTILS API
   * japi.utils is a collection of functions available without any permissions.
   * It includes only functions that don't manipulate data owned by a role.
   * Those functions are instead in japi.role
   */

  japi.utils.getUUID = function(){
    return "UUID1";
  };



  /*
   * JAPI POLLS API
   * japi.polls is a set of functions to create and use Poll objects.
   */

  japi.polls.build = function(source, callback){
    // This might be called with one source argument, one callback argument, one
    // of each, or something else invalid.
    var mockPoll = {
        id: japi.utils.getUUID(), 
        title: "Mock Poll",
        status: "deleted", 
        dateStarted: null,
        save: function(){},
        start: function(){},
        stop: function(){},
        getResults: function(){},
        delete: function(){},
      };

    function copyPoll(source){
      //  source might be a poll OR a template 
      // copy all properties from source:
      var tmp = {};
      for( prop in source ){
        if(source.hasOwnProperty(prop)){
          tmp[prop] = source[prop];
        };
      };
      // override some properties with defaults:
      tmp.id = "UUID2";
      tmp.status = "deleted";
      return tmp;
    };

    if(arguments.length === 0){ 
      // No arguments. Return a new poll synchronously.
      return mockPoll;
    } else if(arguments.length === 1 && typeof source === "function"){
      // One callback argument passed in. 
      // Return undefined now; call the callback asynchronously w/ the new poll.
      setTimeout(function(){ 
        callback(null, mockPoll) 
      }, 200);
      return undefined;
    } else if(arguments.length === 1 && typeof source === "object") {
      // One source object passed in.
      // Create a similar object from source object + defaults and return it sync.
      return copyPoll(source);
    } else if(typeof source !== "object" && typeof callback !== "function"){
      // Bad argument syntax
      return new Error("japi.polls.build() called with invalid arguments:\n"+arguments)
    } else {
      // we have at least 2 args AND source is an object AND callback is a fn
      // Create a similar object from source object + defaults;
      // Return undefined now; call the callback asynchronously w/ the new poll.
      setTimeout(function(){ 
        var newPoll = copyPoll(source);
        callback(null, newPoll) 
      }, 200);
      return undefined;
    };
  };

  japi.polls.getList = function(callback){
    //setTimeout(function(){ callback(null, false) }, 200);
    var poll1 = japi.polls.build();
    var poll2 = japi.polls.build();
    poll2.id = "UUID2";
    return [poll1, poll2];
  };

  japi.polls.get = function(UUID, callback){
    //setTimeout(function(){ callback(null, false) }, 200);
    if(UUID.match(/^UUID[0-9]$/)){ // Succeed on UUID0 to UUID9; otherwise fail
      var myPoll = japi.polls.build();
      myPoll.id = UUID;
      return myPoll;
    } else {
      return false;
    };
  };

  /* Not yet specced:
  japi.polls.myTemplates.save = function(UUID, XML, callback){
    setTimeout(function(){ callback(null, false) }, 200);
  };
  japi.polls.myTemplates.get = function(UUID, callback){
    setTimeout(function(){ callback(null, false) }, 200);
  };
  japi.polls.myTemplates.list = function(callback){
    setTimeout(function(){ callback(null, false) }, 200);
  };
  japi.polls.myTemplates.delete = function(UUID, callback){
    setTimeout(function(){ callback(null, false) }, 200);
  };
  */

  /* set aliases after defining everything: */
  japi.util = japi.utils;

  return japi;
}
