import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as yup from 'yup'
import dotenv from 'dotenv'
dotenv.config()

import User from '../model/User.js'

class LoginController{
    async store(req,res){
        const schema = yup.object().shape({
            username: yup.string().required('O nome de usuário é obrigatório'),
            password: yup.string().required('A senha é obrigatória').min(5, 'Senha precisa ter pelo menos 5 caracteres').max(10, 'Senha precisa ter no máximo 10 caracteres'),
        });

        try {
            await schema.validate(req.body, { abortEarly: false });
        } catch (err) {
            return res.status(400).json({ errors: err.errors });
        }

        const { username, password } = req.body;

        try {
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(401).json({ error: 'Usuário ou senha inválidos' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Usuário ou senha inválidos' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.TOKEN_SECRET,
                { expiresIn: process.env.TOKEN_EXPIRATION }
            );

            return res.status(200).json({
                message: 'Login efetuado com sucesso',
                user: {
                     id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    phone_number: user.phone_number,
                    admin: user.admin,
                },
                token,

            });

        } catch (e) {
             console.error(e);
            return res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }
}

export default new LoginController() 
