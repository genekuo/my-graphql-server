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

export default {
    users,
    posts,
};