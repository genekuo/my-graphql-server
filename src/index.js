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

        posts: [Post!]!
        post(id: ID!): Post!
    }

    type Mutation {
        createPost(content: String!): Post!
        deletePost(id: ID!): Boolean!
    }

    type User {
        id: ID!
        username: String!,
        posts: [Post!]
    }

    type Post {
        id: ID!
        content: String!
        user: User!
    }
`;

let users = {
    1: {
        id: '1',
        firstname: 'Gene',
        lastname: 'Kuo',
        postIds: [1],
    },
    2: {
        id: '2',
        firstname: 'Barry',
        lastname: 'Jan',
        postIds: [2],
    },
};

let posts = {
    1: {
        id: '1',
        content: 'I am going to describe how to design...', 
        userId: '1'
    },
    2: {
        id: '2',
        content: 'Apollo is the third party lib we can use to ease...', 
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
        posts: () => {
            return Object.values(posts);
        },
        post: (parent, { id }) => {
            return posts[id];
        },
    },

    Mutation: {
        createPost: (parent, { content }, { me }) => {
            const id = uuidv4();
            const post = {
                id,
                content,
                userId: me.id,
            };
            posts[id] = post;
            users[me.id].postIds.push(id);
            return post;
        },
        deletePost: (parent, { id }) => {
            const { [id]: post, ...otherPosts } = posts;

            if (!post) {
                return false;
            }

            posts = otherPosts;
            return true;
        },
    },

    User: {
        username: user => `${user.firstname} ${user.lastname}`,
        posts: user => {
            return Object.values(posts).filter(post => post.userId === user.id);
        },
    },

    Post: {
        user: post => {
            return users[post.userId];
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