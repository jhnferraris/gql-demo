const planets = [
  {
    id: 1,
    name: 'Mercury',
    classification: 'terrestrial'
  },
  {
    id: 2,
    name: 'Venus',
    classification: 'terrestrial'
  },
  {
    id: 3,
    name: 'Pluto',
    classification: 'small'
  }
];
const systems = [
  {
    id: 1,
    name: 'Solar',
    planets: [1, 2, 3]
  }
];
const galaxies = [
  {
    id: 1,
    name: 'Milky Way',
    systems: [1]
  },
  {
    id: 2,
    name: 'Andromeda',
    systems: []
  }
];

module.exports = {
  planets,
  systems,
  galaxies
};
