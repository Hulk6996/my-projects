const users = [
    {
        username: 'David',
        status: 'online',
        lastActivity: 10
    },
    {
        username: 'Lucy',
        status: 'offline',
        lastActivity: 22
    },
    {
        username: 'Bob',
        status: 'online',
        lastActivity: 104
    }
]
let usersOnlineNames = users
.filter(e => e.status === 'online')
.map(e => e.username)
.join`, `;
console.log(usersOnlineNames);