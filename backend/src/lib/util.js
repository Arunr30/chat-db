import jwt from 'jsonwebtoken'
export const generateToken = (userId, res) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: "7d"
  })
  // we have to share token in a cookie format
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7  days in ms
    httpOnly: true, // prevent from XSS attack cross-site scripting attack
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "developement" 
  })
  return token;
}