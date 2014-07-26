var Cambrian = Cambrian || {};
Cambrian.pollApp = {};

var pollData = [
  { 
    id: "UUID1",
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
    options: ["I'll be there", "I can't go"],
    comments: [
        ["darlith", "I will be 10 minutes late.", new Date("2014-07-18")],
        ["frankenlaser", "This better pay off, last 3 deals with you were bum.", new Date("2014-07-18")],
        ["susan", "should I bring the backup fission reactor?", new Date("2014-07-18")],
        ["chewy", "send me 1 BTC off the recrod in this dialog and I will join up with my entire crew.", new Date("2014-07-18")],
    ],
    counts: [42, 40],
  },
  { 
    id: "UUID2",
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
    options: ["Tortrix BBQ", "Tortrix Crema Agria", "Lays BBQ", "Lays Original"],
    comments: [],
    counts: [100, 630, 100, 120],
  },
  { 
    id: "UUID3",
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
    options: ["Vote Yes", "Vote No"],
    comments: [],
    counts: [50, 40],
  },
  { 
    id: "UUID4",
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
    options: ["Yes, I'll buy BTC now"],
    comments: [],
    counts: [0],
  },
  { 
    id: "UUID5",
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
    options: ["Yes, I can join", "Yes, I can join and bring my megaphone", "No, but good luck!", "No way. Swarm Rules!"],
    comments: [],
    counts: [0],
  },
]
Cambrian.pollApp.mocks = pollData;
