import { Router } from 'express'
import { createNewUser, generateForgetPassLink, generateVerificationLink, grantAcessToken, grantValid, sendProfile, signOut, singIn, updatePassword, updateProfile, verifyEmail } from 'controllers/auth'
import validate from 'src.middleware/validator'
import { newUserSchema, resetPassSchema, verifyTokenSchema } from 'src.utils/validationSchema'
import { isAuth, isValidPassResetToken } from 'src.middleware/auth'

const authRouter = Router()

authRouter.post('/sign-up', validate(newUserSchema), createNewUser)
authRouter.post('/verify', validate(verifyTokenSchema), verifyEmail)
authRouter.get('/verify-token', isAuth, generateVerificationLink)
authRouter.post('/sign-in', singIn)
authRouter.post('/sign-out', isAuth, signOut)
authRouter.get('/profile', isAuth, sendProfile)
authRouter.post('/refresh-token', grantAcessToken)
authRouter.post('/forget-pass', generateForgetPassLink)
authRouter.post(
  "/verify-pass-reset-token",
  validate(verifyTokenSchema),
  isValidPassResetToken,
  grantValid
)
authRouter.post(
  "/reset-pass",
  validate(resetPassSchema),
  isValidPassResetToken,
  updatePassword
)
authRouter.patch("/update-profile", isAuth, updateProfile);



export default authRouter