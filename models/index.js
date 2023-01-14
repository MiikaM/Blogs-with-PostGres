const Blog = require('./blog');
const User = require('./user');
const UserReadings = require('./user_readings');

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserReadings, as: "readings" })

module.exports = {
    Blog,
    User,
    UserReadings
}