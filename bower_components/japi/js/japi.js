if(Cambrian === undefined){
  throw("japi.js needs a root object Cambrian.")
};
if(Cambrian.isMockCambrian === true){
  throw("Mocks detected; japi.js aborting")
}
var Cambrian = Cambrian || {}
Cambrian.JAPI = function(){
  // Define some children objects, this is necessary because trying to set
  // more than one deep of an undefined object fails.
  // {}.foo=true works but {}.foo.bar=true doesn't: 
  // TypeError: Cannot set property 'bar' of undefined

  var japi = {
    apps: Cambrian.apps || {},
    config: {
      audioEnabled: Cambrian.Settings.AudioEnabled,
      developerAppsDirectory: Cambrian.Settings.DeveloperAppsDirectory,
    }, 
    groups: Cambrian.groups,
    me: Cambrian.me,
    peer: {
      ping: {},
      recommendations: {},
      polls: {},
    },
    polls: {
      templates: {},
    },
    role: {
      peerList: {},
    },
    utils: {},
  }

  /* 
   * JAPI PEER API
   * These functions involve communications with other Cambrian Peers
   */

  /*
  japi.peer.ping = function(callback){
    //setTimeout(function(){ callback(null, false) }, 200);
    return 33;
  }
  */

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

  /*
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
  */
  
  /*
   * JAPI UTILS API
   * japi.utils is a collection of functions available without any permissions.
   * It includes only functions that don't manipulate data owned by a role.
   * Those functions are instead in japi.role
   */

  /*
  japi.utils.getUUID = function(){
    return "UUID1";
  };
  */

  japi.utils.formatDivide = function(numerator, denominator, decimalPlaces){
    // All three inputs should be Numbers
    // Output: A string representing the division result formatted to decimalPlaces.
    // e.g. formatDivide(1,4,4) => "0.2500" 
    // Division by 0 should yield "NaN", 
    // EXCEPT in the case where numerator also equals 0,
    // in which case, yield "0.000..." formatted to decimalPlaces.

    if( (typeof arguments[0] !== "number")
      ||(typeof arguments[1] !== "number")
      ||(typeof arguments[2] !== "number") )
      { throw new Error("ArgumentError: formatDivide takes three Numbers") };


    var result;

    if(numerator == 0 && denominator == 0){
      result = 0;
    } else if (denominator == 0) {
      return "NaN"
    } else {
      result = (numerator / denominator);
    };

    var zeroes = "";
    while(zeroes.length < decimalPlaces){
      zeroes += "0";
    };

    var str = result.toString();
    var strMatch = str.match(/\./);

    if(strMatch){ // found a decimal point
      // make sure there's enough zeroes at the end e.g. 10.1 > "10.100" :
      str += zeroes; 
      // Slice any excess characters:
      var sliceEnd = strMatch.index + 1 + decimalPlaces;
      str = str.slice(0, sliceEnd); 
    } else { 
      // no decimal point found, add a decimal point and decimalPlaces zeroes
      str = str + '.' + zeroes;
    };

    //For the special case where decimalPlaces == 0, remove the trailing decimal point:
    if(decimalPlaces == 0){ str = str.slice(0, -1); };

    return str;
  }

  japi.utils.formatPercent = function(numerator, denominator, decimalPlaces){
    if(arguments[2] == undefined){ decimalPlaces = 0 };
    var percent = japi.utils.formatDivide(numerator * 100, denominator, decimalPlaces);
    percent += " %";
    return percent;
  };



  /*
   * JAPI POLLS API
   * japi.polls is a set of functions to create and use Poll objects.
   */

  japi.polls.build = function(source, callback){
    // This might be called with one source argument, one callback argument, one
    // of each, or something else invalid.

    if(arguments.length === 0){ 
      // No arguments. Return a new poll synchronously.
      return Cambrian.polls.build();
    } else if(arguments.length === 1 && typeof source === "function"){
      // One callback argument passed in. 
      // Return undefined now; call the callback asynchronously w/ the new poll.
      Cambrian.polls.build(function(err, newPoll){ 
        callback(err, newPoll) 
      });
      return undefined;
    } else if(arguments.length === 1 && typeof source === "object") {
      // One source object passed in.
      // Create a similar object from source object + defaults and return it sync.
      return Cambrian.polls.build(source);
    } else if(typeof source !== "object" && typeof callback !== "function"){
      // Bad argument syntax
      return new Error("japi.polls.build() called with invalid arguments:\n"+arguments)
    } else {
      // we have at least 2 args AND source is an object AND callback is a fn
      // Create a similar object from source object + defaults;
      // Return undefined now; call the callback asynchronously w/ the new poll.
      Cambrian.polls.build(source, function(err, newPoll){
        callback(err, newPoll);
      });
      return undefined;
    };
  };

  japi.polls.get = function(UUID, callback){
    //setTimeout(function(){ callback(null, false) }, 200);
    myPoll = Cambrian.polls.get(UUID);
    return myPoll;
  };

  japi.polls.getList = function(callback){
    //setTimeout(function(){ callback(null, false) }, 200);
    var list = Cambrian.polls.getList();
    return list;
  };

  japi.polls.templates.listExamples = function(){
    return [];
  };

  japi.polls.templates.listPeerRecommended = function(){
    return [];
  };

  japi.polls.templates.get = function(UUID, callback){
    return {};
  };
  japi.polls.templates.list = function(callback){
    return [];
  };
  japi.polls.templates.build = function(source, callback){
    return {};
  };

  /* set aliases after defining everything: */
  japi.util = japi.utils;

  return japi;
}
