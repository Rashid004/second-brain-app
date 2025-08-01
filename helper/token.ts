import jwt from "jsonwebtoken";

export const generateToken = (
  payload: any,
  secret: string,
  expiresIn: string | number,
) => {
  const options: jwt.SignOptions = {};
  if (expiresIn) {
    options.expiresIn = expiresIn as jwt.SignOptions["expiresIn"];
  }
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
