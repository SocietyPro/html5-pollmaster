var Cambrian = Cambrian || {isMockCambrian:true}

/* MOCK DATA HERE */
/* MOCK JAPI CALLS BELOW */

Cambrian.pollApp = Cambrian.pollApp || {};

Cambrian.pollApp.mockPolls = [
  { 
    id: "UUID1",
    originator: "user1@xmpp.societypro.org",
    type: "Battle Ping",
    title: "Join Operation Red Dawn!",
    description: "We are going to burn the Russian Starbase. Scythe/Moa fleet is leaving at 21:00 from V-3.", 
    status: "started",
    dateStarted: new Date("2014-07-18"),
    dateStopped: null,
    stats: {
        sent: 100,
        responded: 82,
        pending: 18,
        invalid: 0
    },
    turnoutPercent: "82",
    allowComments: true,
    options: [{text: "I'll be there", count: 42}, {text: "I can't go", count: 40}],
    comments: [
        ["darlith", "I will be 10 minutes late.", new Date("2014-07-18")],
        ["frankenlaser", "This better pay off, last 3 deals with you were bum.", new Date("2014-07-18")],
        ["susan", "should I bring the backup fission reactor?", new Date("2014-07-18")],
        ["chewy", "send me 1 BTC off the recrod in this dialog and I will join up with my entire crew.", new Date("2014-07-18")],
    ]
  },
  { 
    id: "UUID2",
    originator: "user2@xmpp.societypro.org",
    type: "Poll",
    title: "What is your favorite Snack?",
    description: "We are about to restock the vending machine and want to know what y'all want in it.",
    status: "started",
    dateStarted: new Date("2014-07-15"),
    dateStopped: null,
    stats: {
        sent: 1000,
        responded: 950,
        pending: 50,
        invalid: 50
    },
    allowComments: false,
    options: [{text: "Tortrix BBQ", count: 100}, {text: "Tortrix Crema Agria", count: 630}, {text: "Lays BBQ", count: 100}, {text: "Lays Original", count: 120}],
    comments: []
  },
  { 
    id: "UUID3",
    originator: "user3@xmpp.societypro.org",
    type: "Vote",
    title: "Leonardo di Cambrian for President of the Organization",
    description: "Vote for me, I promise I won't do anything evil.",
    status: "complete",
    dateStarted: new Date("2014-07-14"),
    dateStopped: new Date("2014-07-15"),
    stats: {
        sent: 100,
        responded: 90,
        pending: 10,
        invalid: 0
    },
    allowComments: false,
    options: [{text: "Vote Yes", count: 50}, {text: "Vote No", count: 40}, {text: "This is an option that nobody has voted on because nobody will see it. It's just a really long line of text.", count: 0}],
    comments: []
  },
  { 
    id: "UUID4",
    originator: "user4@xmpp.societypro.org",
    type: "LocalTrader",
    title: "I have 2 BTC to sell immediately. Takers?",
    description: "bitstamp +5%",
    status: "unstarted",
    dateStarted: null,
    dateStopped: null,
    stats: {
        sent: 0,
        responded: 0,
        pending: 0,
        invalid: 0
    },
    allowComments: false,
    options: [{text: "Yes, I'll buy BTC now", count: 0}],
    comments: []
  },
  { 
    id: "UUID5",
    originator: "user5@xmpp.societypro.org",
    type: "Community",
    title: "Swarm protest at 1pm. Can you join?",
    description: "Location and slogans are opsec, we'll tell you if you commit to joining.",
    status: "unstarted",
    dateStarted: null,
    dateStopped: null,
    stats: {
        sent: 0,
        responded: 0,
        pending: 0,
        invalid: 0
    },
    allowComments: false,
    options: [{text: "Yes, I can join", count: 0}, {text: "Yes, I can join and bring my megaphone", count: 0}, {text: "No, but good luck!", count: 0}, {text: "No way. Swarm Rules!", count: 0}],
    comments: []
  },
];


Cambrian.pollApp.mockTargets = {
  peers: [
    {
      id: "UID001",
      name: "plato",
    },
    {
      id: "UID002",
      name: "voodoo",
    },
    {
      id: "UID003",
      name: "hiro",
    }
  ],

  groups: [
    {
      id: "GID001",
      name: "Cambrian Devs",
      peers: [
        {
          id: "UID001",
          name: "plato",
        },
        {
          id: "UID002",
          name: "hiro",
        }
      ],
    },
    {
      id: "GID002",
      name: "Cambrian Sprouts",
      peers: [
        {
          id: "UID003",
          name: "paulo",
        },
        {
          id: "UID004",
          name: "future dev",
        }
      ],
    },
  ],

  peerLists: [
    {
      id: "LID001",
      name: "My Marketing List",
      peers: [
        {
          id: "UID001",
          name: "plato",
        },
        {
          id: "UID002",
          name: "hiro",
        }
      ],
    },
    {
      id: "LID002",
      name: "People I know with cars",
      peers: [
        {
          id: "UID003",
          name: "paulo",
        },
        {
          id: "UID004",
          name: "future dev",
        }
      ],
    },
    {
      id: "LID003",
      name: "My Enemies",
      peers: [
        {
          id: "UID003",
          name: "paulo",
        },
        {
          id: "UID004",
          name: "future dev",
        }
      ],
    },
  ]
};


Cambrian.pollApp.mockTemplates = [
  { 
    id: "UUID101",
    type: "Battle Ping",
    title: "Join Operation Red Dawn! Bring Ships!",
    description: "We are going to burn the Russian Starbase. Scythe/Moa fleet is leaving at 21:00 from V-3.",
    options: [{text: "I'll be there"}, {text: "I can't go"}],
    allowMultipleChoices: false,
    allowComments: false,
    dismissText: "Dismiss",
    submitText: "Submit",
  },
  { 
    id: "UUID102",
    type: "Poll",
    title: "What is your favorite Snack?",
    description: "We are about to restock the vending machine and want to know what y'all want in it.",
    options: [{text: "Tortrix BBQ"}, {text: "Tortrix Crema Agria"}, {text: "Lays BBQ"}, {text: "Lays Original"}],
    allowMultipleChoices: false,
    allowComments: false,
    dismissText: "Dismiss",
    submitText: "Submit",
  },
  { 
    id: "UUID103",
    type: "Vote",
    title: "Leonardo di Cambrian for President of the Organization",
    description: "Vote for me, I promise I won't do anything evil.",
    options: [{text: "Vote Yes"}, {text: "Vote No"}],
    allowMultipleChoices: false,
    allowComments: false,
    dismissText: "Dismiss",
    submitText: "Submit",
  },
  { 
    id: "UUID104",
    type: "LocalTrader",
    title: "I have 2 BTC to sell immediately. Takers?",
    description: "bitstamp +5%",
    options: [{text: "Yes, I'll buy BTC now"}],
    allowMultipleChoices: false,
    allowComments: false,
    dismissText: "Dismiss",
    submitText: "Submit",
  },
  { 
    id: "UUID105",
    type: "Community",
    title: "Swarm protest at 1pm. Can you join?",
    description: "Location and slogans are opsec, we'll tell you if you commit to joining.",
    options: [{text: "Yes, I can join"}, {text: "Yes, I can join and bring my megaphone"}, {text: "No, but good luck!"}, {text: "No way. Swarm Rules!"}],
    allowMultipleChoices: false,
    allowComments: false,
    dismissText: "Dismiss",
    submitText: "Submit",
  },
];

Cambrian.pollApp.exampleTemplates = [
  { 
    id: "UUID201",
    type: "Battle Ping",
    title: "Join Operation Red Dawn! Bring Ships!",
    description: "We are going to burn the Russian Starbase. Scythe/Moa fleet is leaving at 21:00 from V-3.",
    options: [{text: "I'll be there"}, {text: "I can't go"}],
    allowMultipleChoices: false,
    allowComments: false,
    dismissText: "Dismiss",
    submitText: "Submit",
  },
  { 
    id: "UUID202",
    type: "Vote",
    title: "President of the Organization",
    description: "Who should be made President for Life?",
    options: [{text: "Voodoo"}, {text: "Hiro"}, {text: "Plato"}, {text: "Rafael"}, {text: "Dan"}, {text: "Ceasar"}],
    allowMultipleChoices: false,
    allowComments: false,
    dismissText: "Dismiss",
    submitText: "Submit",
  },
  { 
    id: "UUID203",
    type: "Poll",
    title: "What should we call the new product geared toward developer teams?",
    description: "We need a snappy name for the new time management tool.",
    options: [{text: "The Whippenator"}, {text: "Iron Maiden"}, {text: "The Rack"}],
    allowMultipleChoices: false,
    allowComments: false,
    dismissText: "Dismiss",
    submitText: "Submit",
  },
  { 
    id: "UUID204",
    type: "Opinion",
    title: "Does Gavin have the skills and vision to lead the developer team?",
    description: "Well, does he?",
    options: [{text: "Yes"}, {text: "no"}],
    allowMultipleChoices: false,
    allowComments: false,
    dismissText: "Dismiss",
    submitText: "Submit",
  },
  { 
    id: "UUID205",
    type: "Help",
    title: "Can someone please help me install the latest version of the software?",
    description: "I keep getting missing dependencies errors.",
    options: [{text: "Yes, I can help the noob"}],
    allowMultipleChoices: false,
    allowComments: false,
    dismissText: "Dismiss",
    submitText: "Submit",
  },
  { 
    id: "UUID206",
    type: "Emergency",
    title: "Tsunami has subsided. Who can help bring these supplies?",
    description: "We need supplies from your warehouses at the rally point.",
    options: [{text: "I can bring water (# pallets in comments)"}, {text: "I can bring blankets (# comments)"}, {text: "I can bring batteries (#/types in comments)"}, {text: "I can bring MREs (# pallets in comments)"}],
    allowMultipleChoices: true,
    allowComments: true,
    dismissText: "Dismiss",
    submitText: "Submit",
  },
];

Cambrian.pollApp.mockPeerTemplates = [
  { 
    id: "UUID301",
    type: "Opinion",
    title: "Can the Product Owner keep up?",
    description: "We are burning through the backlog. Will there be enough work backlogged?",
    options: [{text: "Yes, he'll add make-work stories."}, {text: "Yes, he'll quit playing 'Software Tycoon' and get to work."}, {text: "No."}],
    allowMultipleChoices: false,
    allowComments: false,
    dismissText: "Dismiss",
    submitText: "Submit",
  },
  { 
    id: "UUID302",
    type: "Vote",
    title: "President of the Organization",
    description: "Who should be made President for Life?",
    options: [{text: "Voodoo"}, {text: "Hiro"}, {text: "Plato"}, {text: "Rafael"}, {text: "Dan"}, {text: "Ceasar"}],
    allowMultipleChoices: false,
    allowComments: false,
    dismissText: "Dismiss",
    submitText: "Submit",
  },
];



/* Mock JAPI calls below here */

Cambrian.idSeed = 1000;

Cambrian.mockJAPI = function(){
  // Define some children objects, this is necessary because trying to set
  // more than one deep of an undefined object fails.
  // {}.foo=true works but {}.foo.bar=true doesn't: 
  // TypeError: Cannot set property 'bar' of undefined

  var japi = {
    groups: {
    },
    me: {
    },
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
      templates: {},
      myTemplates: {},
    },
  }
  
  /*
   * JAPI UTILS API
   * japi.utils is a collection of functions available without any permissions.
   * It includes only functions that don't manipulate data owned by a role.
   * Those functions are instead in japi.role
   */

  japi.utils.getUUID = function(){
    Cambrian.idSeed++;
    return "UUID" + Cambrian.idSeed.toString();
  };

  var savePoll = function (poll) {
    poll.status = "unstarted";
    for (var i = 0; i < listOfPolls.length; i++) {
      if (listOfPolls[i].id === poll.id) {
        listOfPolls[i] = poll;
        return undefined;
      };
    }
    listOfPolls.push(poll);
    return undefined;
  };

  var destroyPoll = function (poll) {
    var index = listOfPolls.indexOf(poll);

    if (index > -1) {
      listOfPolls.splice(index, 1);
    }
  };

  /* Our mock polls don't have a start or delete function but we need it for testing. Adding
   * here:
   */
  var d = new Date();
  var futureDate = d.setDate(d.getDate() + 2);
  var pastDate = d.setDate(d.getDate() - 2);
  var listOfPollMocks = Cambrian.pollApp.mockPolls;
  var listOfPolls = listOfPollMocks.map(function(mock){
    mock.endTime = "12:00";
    if (mock.status === 'started') {
      mock.endDate = new Date(futureDate);
    } else if (mock.status === 'complete') {
      mock.endDate = new Date(pastDate);
    };
    mock.id = japi.utils.getUUID();
    mock.save = function () {
      console.log('Saving mock');
      savePoll(this);
    };
    mock.destroy = function () {
      console.log('Destroying mock');
      destroyPoll(this);
    };
    mock.start = function(){
      console.log('Starting mock');
      mock.status = 'started';
      mock.dateStarted = new Date();
    };
    return mock;
  });

  var destroyTemplate = function (template) {
    var index = listOfTemplates.indexOf(template);

    if (index > -1) {
      listOfTemplates.splice(index, 1);
    }
  };

  var listOfTemplateMocks = Cambrian.pollApp.mockTemplates;
  var listOfTemplates = listOfTemplateMocks.map(function(mock){
    mock.destroy = function () {
      console.log("Destroying mock");
      destroyTemplate(this);
    };
    return mock;
  });
  var listOfExampleTemplates = Cambrian.pollApp.exampleTemplates;
  var listOfRecommendedTemplates = Cambrian.pollApp.mockPeerTemplates;
  
  /* 
   * JAPI GROUP API
   * These functions provide group administration functions
   */

  japi.groups.build = function(src){
    var newGroup = {
      name: '',
      type: '',
      members: Cambrian.pollApp.mockTargets.peers,
      save: function(){
        console.log("Group saved");
      },
      destroy: function(){
        console.log("Group destroyed");
      },
      addPeer: function(peer){
        this.members.push(peer);
      },
      removePeer: function(peer){
        var index = this.members.indexOf(peer);
        var found = (  index == -1 )
          ? false : true;
          
        if(found){
          var left = this.members.slice(0, index);
          var right = this.members.slice(index+1);
          this.members = left.concat(right);
        }
      },
    };

    if(typeof src === 'string'){
      newGroup.type = src;
    };
    
    return newGroup;
  }

  /* 
   * JAPI ME API
   * These functions give apps access to context about the current role
   */

  japi.me.peers = Cambrian.pollApp.mockTargets.peers;

  japi.me.groups = Cambrian.pollApp.mockTargets.groups;

  japi.me.peerLists = Cambrian.pollApp.mockTargets.peerLists;

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
   * JAPI POLLS API
   * japi.polls is a set of functions to create and use Poll objects.
   */

  japi.polls.build = function(source, callback){
    // This might be called with one source argument, one callback argument, one
    // of each, or something else invalid.
    var mockPoll = {
        id: japi.utils.getUUID(), 
        title: "",
        status: "unsaved", 
        dateStarted: null,
        options: [],
        save: function(){
          savePoll(this);
        },
        start: function(){
          console.log("Starting Poll");
          this.dateStarted = new Date();
          this.status = "started";
        },
        stop: function(){},
        getResults: function(){},
        destroy: function(){
          destroyPoll(this);
        },
      };

    var savePoll = function (poll) {
      poll.status = "unstarted";
      for (var i = 0; i < listOfPolls.length; i++) {
        if (listOfPolls[i].id === poll.id) {
          listOfPolls[i] = poll;
          return undefined;
        };
      }
      listOfPolls.push(poll);
      return undefined;
    };

    var startPoll = function (poll) {
      poll.dateStarted = new Date();
      poll.status = "started";
      return undefined;
    }

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
      tmp.id = japi.utils.getUUID();
      tmp.status = "unsaved";
      tmp.save = tmp.save || function(){savePoll(this)};
      tmp.start = tmp.start || function(){startPoll(this)};
      tmp.destroy = tmp.destroy || function(){destroyPoll(this)};
      //listOfPolls.push(tmp);
      return tmp;
    };

    if(arguments.length === 0){ 
      // No arguments. Return a new poll synchronously.
      var builtPoll = mockPoll;
      return builtPoll;
    } else if(arguments.length === 1 && typeof source === "function"){
      // One callback argument passed in. 
      // Return undefined now; call the callback asynchronously w/ the new poll.
      setTimeout(function(){ 
        callback(null, function () {
          var builtPoll = mockPoll;
          return builtPoll;
        }); 
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
    //var poll1 = japi.polls.build();
    //var poll2 = japi.polls.build();
    return listOfPolls;
  };

  japi.polls.get = function(UUID, callback){
    //setTimeout(function(){ callback(null, false) }, 200);
    /*if(UUID.match(/^UUID[0-9]$/)){ // Succeed on UUID0 to UUID9; otherwise fail
      var myPoll = japi.polls.build();
      myPoll.id = UUID;
      return myPoll;
    } else {
      return false;
    }; */

    for (var i = 0; i < listOfPolls.length; i++) {
      if (listOfPolls[i].id === UUID) {
        return listOfPolls[i];
      }
      return false;
    }
  };

  japi.polls.templates.listExamples = function(){
    return listOfPolls;
  };

  japi.polls.templates.listPeerRecommended = function(){
    return listOfRecommendedTemplates;
  };

  japi.polls.templates.list = function(){
    return listOfTemplates;
  };

  japi.polls.templates.listExamples = function () {
    return listOfExampleTemplates;
  };


  japi.polls.templates.build = function(source, callback){
    // This might be called with one source argument, one callback argument, one
    // of each, or something else invalid.
    var mockTemplate = {
        id: japi.utils.getUUID(), 
        title: "", 
        options: [],
        allowMultipleChoices: false,
        allowComments: false,
        dismissText: "Dismiss",
        submitText: "Submit",
        save: function(){
          saveTemplate(this)
        },
        destroy: function(){
          destroyTemplate(this);
        },
      };

    var saveTemplate = function (template) {
      for (var i = 0; i < listOfTemplates.length; i++) {
        if (listOfTemplates[i].id === template.id) {
          listOfTemplates[i] = template;
          return undefined;
        };
        listOfTemplates.push(template);
        return undefined;
      }
    };

    function copyTemplate(source){
      //  source might be a poll OR a template 
      // copy all properties from source:
      var tmp = {};
      for( prop in source ){
        if(source.hasOwnProperty(prop)){
          tmp[prop] = source[prop];
        };
      };
      // override some properties with defaults:
      tmp.id = japi.utils.getUUID();
      listOfTemplates.push(tmp);
      return tmp;
    };

    if(arguments.length === 0){ 
      // No arguments. Return a new poll synchronously.
      var builtTemplate = mockTemplate;
      return builtTemplate;
    } else if(arguments.length === 1 && typeof source === "function"){
      // One callback argument passed in. 
      // Return undefined now; call the callback asynchronously w/ the new poll.
      setTimeout(function(){ 
        callback(null, function () {
          var builtTemplate = mockTemplate;
          return builtTemplate;
        }); 
      }, 200);
      return undefined;
    } else if(arguments.length === 1 && typeof source === "object") {
      // One source object passed in.
      // Create a similar object from source object + defaults and return it sync.
      return copyTemplate(source);
    } else if(typeof source !== "object" && typeof callback !== "function"){
      // Bad argument syntax
      return new Error("japi.polls.templates.build() called with invalid arguments:\n"+arguments)
    } else {
      // we have at least 2 args AND source is an object AND callback is a fn
      // Create a similar object from source object + defaults;
      // Return undefined now; call the callback asynchronously w/ the new poll.
      setTimeout(function(){ 
        var newTemplate = copyTemplate(source);
        callback(null, newTemplate) 
      }, 200);
      return undefined;
    };
  };

  /* set aliases after defining everything: */
  japi.util = japi.utils;

  return japi;
}
