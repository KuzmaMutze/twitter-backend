import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTstrategy, ExtractJwt } from "passport-jwt";
import { UserModel, UserType } from "../modules/UserModel";
import { generateMD5 } from "../utils/generateHash";


passport.use(
    new LocalStrategy(
        async (username, password, done): Promise<void> => {
            try {
                const user = await UserModel.findOne({ $or: [{email: username}, {username}] }).exec();
                // console.log(user);
                
                if (!user) {
                    return done(null, false)
                } 
                if(user.confirmed && user.password === generateMD5(password + process.env.SECRET_KEY)){
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            } catch (error) {
                done(error, false)
            }
        })        
);

passport.use(
    new JWTstrategy(
      {
        secretOrKey: process.env.SECRET_KEY || '123',
        jwtFromRequest: ExtractJwt.fromHeader("token")
      },
      async (payload: {data: UserType}, done: any) => {
        try {
            const user = await UserModel.findById(payload.data._id).exec()
            if (user) {
                return done(null, user);
            }
            done(null, false)
        } catch (error) {
            done(error, false);
        }
      }
    )
  );

passport.serializeUser((user: any, done) => done(null, user._id))
  
passport.deserializeUser( (id, done) => {
    UserModel.findById(id, (error: any, user: any) => done(error, user))
  })

export { passport }
