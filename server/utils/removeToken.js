import { serialize } from "cookie";

const removeToken = (res, name) => {
     res.setHeader(
       "Set-Cookie",
       serialize(name, "", {
         maxAge: -1,
         sameSite: true,
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         path: "/",
       })
     );
}


export default removeToken