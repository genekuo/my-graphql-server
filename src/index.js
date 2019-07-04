import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models from './models';

const app = express();
app.use(cors())

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        models,
        me: models.users[1],
    },
});

server.applyMiddleware({
    app,
    path: '/my-graphql'
});

app.listen({ port: 8000 }, () => {
    console.log('My Apollo server listening on http://localhost:8000/my-graphql');
});