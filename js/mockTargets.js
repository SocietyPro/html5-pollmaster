var Cambrian = Cambrian || {};
Cambrian.pollApp = Cambrian.pollApp || {};

var mockTargets = {
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
}

Cambrian.pollApp.mockTargets = mockTargets;
