import jwt from "jsonwebtoken";

const generateToken = (id)=> {
    return jwt.sign({id},  process.env.JWT_SECTER, {
        expiresIn : "30d",
    });

}

export default generateToken