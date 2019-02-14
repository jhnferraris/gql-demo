var express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

var typeDefs = gql`
  # plane fragments

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
    andromeda: Galaxy
    hello: String
  }
`;

var resolvers = {
  Query: {
    hello: () => 'Hello world!',
    galaxy: (root, args, context) => {
      return {
        name: 'Milky Way',
        systems: [
          {
            name: 'Solar',
            planets: [
              {
                name: 'Earth',
                classification: 'Terrestrial'
              }
            ]
          }
        ]
      };
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
