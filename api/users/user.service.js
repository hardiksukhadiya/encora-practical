const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('helpers/db');

module.exports = {
    authenticate,
    create,
};

async function authenticate({ email, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
        throw 'Email or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, generalConfig.SECRETKEY, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // save user
    await db.User.create(params);
}

//will remove passwordHash from user object
function omitHash(user) {
    const { passwordHash, ...userWithoutHash } = user;
    return userWithoutHash;
}
