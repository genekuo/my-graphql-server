import cors from 'cors';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import uuidv4 from 'uuid/v4';

const app = express();
app.use(cors())

const schema = gql`
    type Query {
        signin: User
        user(id: ID!): User
        users: [User!]

        orders: [Order!]!
        order(id: ID!): Order!
    }

    type Mutation {
        placeOrder(product: String!): Order!
        deleteOrder(id: ID!): Boolean!
    }

    type User {
        id: ID!
        username: String!,
        orders: [Order!]
    }

    type Order {
        id: ID!
        product: String!
        user: User!
    }
`;

let users = {
    1: {
        id: '1',
        firstname: 'Gene',
        lastname: 'Kuo',
        orderIds: [1],
    },
    2: {
        id: '2',
        firstname: 'Barry',
        lastname: 'Jan',
        orderIds: [2],
    },
};

let orders = {
    1: {
        id: '1',
        product: 'iMac',
        userId: '1'
    },
    2: {
        id: '2',
        product: 'MacBook Pro',
        userId: '2',
    },
};

//const signin = users[1];

const resolvers = {
    Query: {
        signin: (parent, args, { me }) => {
            return me;
        },
        user: (parent, { id }) => {
            return users[id];
        },
        users: () => {
            return Object.values(users);
        },
        orders: () => {
            return Object.values(orders);
        },
        order: (parent, { id }) => {
            return orders[id];
        },
    },

    Mutation: {
        placeOrder: (parent, { product }, { me }) => {
            const id = uuidv4();
            const order = {
                id,
                product,
                userId: me.id,
            };
            orders[id] = order;
            users[me.id].orderIds.push(id);
            return order;
        },
        deleteOrder: (parent, { id }) => {
            const { [id]: order, ...otherOrders } = orders;

            if (!order) {
                return false;
            }

            orders = otherOrders;
            return true;
        },
    },

    User: {
        username: user => `${user.firstname} ${user.lastname}`,
        orders: user => {
            return Object.values(orders).filter(order => order.userId === user.id);
        },
    },

    Order: {
        user: order => {
            return users[order.userId];
        },
    },
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        me: users[1],
    },
});

server.applyMiddleware({
    app,
    path: '/my-graphql'
});

app.listen({ port: 8000 }, () => {
    console.log('My Apollo server listening on http://localhost:8000/my-graphql');
});