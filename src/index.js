import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const app = express();
const schema = gql`
    type Query {
        user: User
    }

    type User {
        username: String!
    }
`;

const resolvers = {
    Query: {
        user: () => {
            return {
                username: 'Gene Kuo'
            };
        },
    },
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
});

server.applyMiddleware({
    app,
    path: '/my-qraphql'
});

app.listen({ port: 8000 }, () => {
    console.log('My Apollo server listening on http://localhost:8000/my-qraphql')
})