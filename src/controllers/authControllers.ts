import jwt from 'jsonwebtoken';
import type {Request, Response} from 'express';


export const login = (req: Request, res: Response) => {
    const {email, password} = req.body;
    
    const token = jwt.sign(
        {   sub: "1", 
            email: email, 
            role: "USER"
        }, 
            process.env.JWT_SECRET as string, 
        { expiresIn: '1h'}
    )

    return res.json({token})
}