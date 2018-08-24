import { UserModel as User } from "../models/user";
const jwt = require("jwt-simple");
const bcrypt = require("bcrypt");

export const authenticate = (username, password) => {
    return isValidCredentials(username, password)
        .then(user => {
            const token = "";
            return token;
        })
        .catch(err => {
            console.log(`Wrong credentials for ${username}`);
            console.log(err);
            throw new Error("Cannot authenticate");
        });
};

const isValidCredentials = async (username, password) => {
    //check if credentials valid
    let foundUser;
    return User.findOne({ username })
        .catch(err => {
            console.log(err);
            throw new Error("Cannot find user");
        })
        .then(user => {
            if (!user) {
                console.log(`No such user ${username}`);
                throw new Error("Failed to authenticate");
            }
            foundUser = user;
            return bcrypt.compare(password, user.password);
        })
        .catch(err => {
            console.log(`Wrong password for user ${username}`);
            console.log(err);
            throw new Error("Failed to authenticate");
        })
        .then(() => foundUser);
};

const createTokenFromObject = obj => {
    const { TOKEN_KEY } = process.env;
    const token = jwt.encode(obj, TOKEN_KEY);
};
/*
Use this middleware to validate token

app.use(function (req, res, next) {
  const token = req.headers.authorization;
  return validateToken(token)
  .then((user) => {
    req.user = user;
    return next();
  }).catch((err) => {
    console.log(err);
    return res.sendStatus(401);
  });
});
*/

export const validateToken = token => {
    const { TOKEN_KEY } = process.env;
    let obj = null;
    try {
        obj = jwt.decode(token, obj);
    } catch (err) {
        console.log("Token is invalid");
        return false;
    }
    const now = new Date();
    if (now > obj.expire) {
        console.log("Token is expired");
        return false;
    }
    return obj;
};

const generateToken = user => {
    const { id, username } = user;
    const now = new Date();
    const VALID_HOUR = 8;
    const expire = now.setTime(now.getTime() + VALID_HOUR * 60 * 60 * 1000);
    return createTokenFromObject({
        id,
        username,
        expire
    });
};
