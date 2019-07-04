import { gql } from 'apollo-server-express';

export default gql`
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