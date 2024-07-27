import { RequestHandler } from "express";
import { sendErrorRes } from "src.utils/helper";
import jwt, { TokenExpiredError } from "jsonwebtoken"
import UserModel from "src.models/user";
import { Types } from "mongoose";
import PasswordResetTokenModel from "src.models/passwordResetToken";


interface UserProfile {
  id: Types.ObjectId | unknown;
  name: string;
  email: string;
  verifed: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user: UserProfile
    }
  }
}

export const isAuth: RequestHandler = async (req, res, next) => {


  try {
    
    const authToken = req.headers.authorization
    if (!authToken) return sendErrorRes(res, "unauthorized request", 402)

    const token = authToken.split("Bearer ")[1]
    const payload = jwt.verify(token, "secret") as { id: string}

    const user = await UserModel.findById(payload.id)
    if (!user) return sendErrorRes(res, "unauthorized request", 402)

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      verifed: user.verifed
    }

    next()
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return sendErrorRes(res, "Session expired, login again", 401)
    }

    if (error instanceof TokenExpiredError) {
      return sendErrorRes(res, "unauthorized assess!  ", 401)
    }

    next(error)

  }


}

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {

  const { id, token } = req.body;
  const resetPassToken = await PasswordResetTokenModel.findOne({ owner: id });
  if (!resetPassToken)
    return sendErrorRes(res, "Unauthorized request, invalid token!", 403);

  const matched = await resetPassToken.compareToken(token);
  if (!matched)
    return sendErrorRes(res, "Unauthorized request, invalid token!", 403);

  next();
};