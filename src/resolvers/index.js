import uuidv4 from 'uuid/v4';

import models from '../models';

export default {
    Query: {
        signin: (parent, args, { me }) => {
            return me;
        },
        user: (parent, { id }, { models }) => {
            return models.users[id];
        },
        users: (parent, args, { models }) => {
            return Object.values(models.users);
        },
        posts: (parent, args, { models }) => {
            return Object.values(models.posts);
        },
        post: (parent, { id }, { models }) => {
            return models.posts[id];
        },
    },

    Mutation: {
        createPost: (parent, { content }, { me, models }) => {
            const id = uuidv4();
            const post = {
                id,
                content,
                userId: me.id,
            };
            models.posts[id] = post;
            models.users[me.id].postIds.push(id);
            return post;
        },
        deletePost: (parent, { id }, { models }) => {
            const { [id]: post, ...otherPosts } = models.posts;

            if (!post) {
                return false;
            }

            models.posts = otherPosts;
            return true;
        },
    },

    User: {
        username: ( user, args, { models } ) => `${models.users[user.id].firstname} ${models.users[user.id].lastname}`,
        posts: ( user, args, { models } ) => {
            return Object.values(models.posts).filter(post => post.userId === user.id);
        },
    },

    Post: {
        user: ( post, args, { models }) => {
            return models.users[post.userId];
        },
    },
}