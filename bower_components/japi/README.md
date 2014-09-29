japi
================
This repo holds `japi.js` and its associated test suite.

## japi.js
`japi.js` is a javascript API for Society<sup>PRO</sup> users. 

Society<sup>PRO</sup> is written in C++, and natively provides some Javascript API calls that wrap C++ functions. These wrapped functions can be accessed in any Javascript global scope in an object called
`SO_PRO`.

`japi.js` provides a wrapper over these API calls, offering developers access to
Society<sub>PRO</sub>'s capabilities using standard Javascript conventions.

When loaded, `japi.js` creates a Javascript function object `SO_PRO.JAPI`. 
When `SO_PRO.JAPI` is invoked `()` it returns a client-side module, documented
on [the Society<sub>PRO</sub>
wiki](http://group.cambrian.org/wiki/doku.php?id=japi.js).

## Expected japi.js use 
(Note, the name change from `Cambrian` to `SO_PRO` is not yet
committed; use Cambrian.JAPI)

    <script src="js/japi.js" type="text/javascript></script>

    // Subsequent script:
    //var japi = SO_PRO.JAPI(); 
    var japi = Cambrian.JAPI(); 
    console.log(japi.me.name); // "plato-dev"
    var thisAppPermissionGranted
        = japi.permissions.role.getAllNymRoles; //false
    
    japi.role.getAllNymRoles()
    // Throws Error: "Permission Denied: japi.role.getAllNymRoles()"
    
    japi.$.asset("PlatoBTC").qty("0.00001").sendTo("hiro-dev"); 
    // If I have permissions, pops up a wallet UI with everything prefilled
    // If I don't, throws Permission Denied error


japi calls currently return their results synchronously. 

Future work: asynchronous japi, asynchronous japi mocks, asynchronous japi tests

## Tests against japi.js
These tests are written with the Jasmine library.

 * [japi.js library] (https://github.com/CambrianExp/japi/tree/master/js/japi.js)
 * [tests against japi.js](https://github.com/CambrianExp/japi/tree/master/js/testJapiJS.js)
 * [mockJapi.js mock object](https://github.com/CambrianExp/japi/tree/master/js/mockJapi.js)
 * [tests against mockJapi.js](https://github.com/CambrianExp/japi/tree/master/js/testMockJapi.js)

###To run the tests against the mock japi API:  
Clone the repo `git clone git@github.com:SocietyPro/japi.git`  
Load `test/testMock.html` in your favorite browser `firefox japi/test/mock.html`  

###To run the tests in Cambrian against the real JAPI:  
Navigate to `~/.Cambrian/Apps`  
Clone the repo `git clone git@github.com:SocietyPro/japi.git`  
Start Cambrian  
Open Tools > JAPI Tests  

## Example JAPI Function

    var Cambrian = Cambrian || {}
    Cambrian.JAPI = function(){
      var japi = {
        polls: {},
      }
      japi.polls.get = function(UUID, callback){
        //setTimeout(function(){ callback(null, false) }, 200);
        myPoll = Cambrian.polls.get(UUID);
        return myPoll;
      };
    }

## Example JAPI Test

    describe("japi.polls.get(testPoll.id)", function(){
      it("exists", function(){
        expect(japi.polls.get).not.toEqual({});
        expect(japi.polls.get).not.toEqual(undefined);
      });

      it("returns a found poll object by ID", function(){
        var idToSearch = testPoll.id;
        var foundPoll = japi.polls.get(idToSearch);
        expect(typeof foundPoll).toEqual("object");
        expect(foundPoll.id).toEqual(idToSearch);
      });

      it("returns null if no poll object is found", function(){
        var myPoll = japi.polls.get("UUID100");
        expect(myPoll).toBe(null);
      });

    });

## Example Mock JAPI Function

    var Cambrian = Cambrian || {}
    Cambrian.JAPI = function(){
      var japi = {
        peer: {
          ping: {},
        }
      };
       ...
      japi.peer.ping = function(callback){
        //setTimeout(function(){ callback(null, false) }, 200);
        return 33;
      }
       ...
      return japi;
    }

## Example Mock JAPI Test

    describe(".ping()", function(){
      // Once implemented, ping will be called asynchronously
      it("exists", function(){
        expect(japi.peer.ping).not.toEqual({});
        expect(japi.peer.ping).not.toEqual(undefined); // or toBeDefined();
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


