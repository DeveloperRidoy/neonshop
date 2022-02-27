import { serialize } from "cookie"; 

const setToken = (res, name, token) =>  res.setHeader(
  "Set-Cookie",
  serialize(name, String(token), {
    maxAge: process.env.AUTH_COOKIE_MAX_AGE_IN_SECONDS || 1209600,
    sameSite: true,
    httpOnly: true,
    domain: "",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
);


export default setToken;