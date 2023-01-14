const Blog = require('./blog');
const User = require('./user');
const UserReadings = require('./user_readings');
const WebToken = require('./web_tokens');

User.hasMany(Blog);
User.hasMany(WebToken);

Blog.belongsTo(User);
WebToken.belongsTo(User);

User.belongsToMany(Blog, { through: UserReadings, as: "readings" })

module.exports = {
    Blog,
    User,
    UserReadings,
    WebToken
}