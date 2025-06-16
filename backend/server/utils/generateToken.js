import jwt from 'jsonwebtoken'

export const generateToken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token,{
        httpOnly:true,
        maxAge:24*60*60*1000
    })
    return token
}