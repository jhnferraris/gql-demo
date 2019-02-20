var express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { galaxies, planets, systems } = require('./models');
const _ = require('lodash');

var typeDefs = gql`
  type Planet {
    # giant, terrestrial, small
    name: String!
    classification: String!
    population: Int
  }

  type System {
    name: String!
    planets: [Planet!]
  }

  type Galaxy {
    name: String!
    systems: [System!]
  }

  type Query {
    galaxy(id: ID): Galaxy
    galaxies: [Galaxy]
  }

  type Mutation {
    addGalaxy(name: String!): Galaxy
  }
`;

var resolvers = {
  Query: {
    galaxy: (root, args, context) => {
      const { id: galaxyId } = args;
      const galaxy = _.clone(
        galaxies.find(galaxy => {
          return galaxy.id === parseInt(galaxyId);
        })
      );
      galaxy.systems = galaxy.systems.map(systemId => {
        const systemObject = systems.find(system => {
          return system.id === systemId;
        });

        const planetItems = systemObject.planets.map(planetId => {
          const planetObject = planets.find(planet => {
            return planet.id === planetId;
          });

          return planetObject;
        });

        return {
          name: systemObject.name,
          planets: planetItems
        };
      });

      return galaxy;
    },
    galaxies: () => {
      const clonedGalaxies = _.cloneDeep(galaxies);
      const responseGalaxies = clonedGalaxies.map(galaxy => {
        const galaxyResponse = {
          name: galaxy.name
        };

        galaxyResponse.systems = galaxy.systems.map(systemId => {
          const systemObject = systems.find(system => {
            return system.id === systemId;
          });

          const planetItems = systemObject.planets.map(planetId => {
            const planetObject = planets.find(planet => {
              return planet.id === planetId;
            });

            return planetObject;
          });

          return {
            name: systemObject.name,
            planets: planetItems
          };
        });

        return galaxyResponse;
      });
      return responseGalaxies;
    }
  },
  Mutation: {
    addGalaxy: (root, args, context) => {
      const lastGalaxy = _.clone(galaxies[galaxies.length]);
      const newGalaxy = {
        id: lastGalaxy + 1,
        name: args.name,
        systems: []
      };

      galaxies.push(newGalaxy);

      return newGalaxy;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app, path: '/demo/graphql' });

app.use('/', (req, res) => {
  res.json({
    app: 'GQL Demo'
  });
});

const port = 4000;

app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
