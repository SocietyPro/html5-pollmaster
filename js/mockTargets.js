var Cambrian = Cambrian || {};
Cambrian.pollApp = {};

var mockTargets = {
  peers: [
    {
      id: "UID001",
      name: "plato",
    },
    {
      id: "UID001",
      name: "plato",
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
      id: "GID001",
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
      id: "LID001",
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
  ]
}

Cambrian.pollApp.mockTargets = mockTargets;
