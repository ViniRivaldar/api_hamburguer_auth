import * as yup from 'yup'
import bcrypt from 'bcrypt'

import User from '../model/User.js'

class RegisterController{
    async store(req,res){
        const userSchema = yup.object().shape({
            name: yup.string().required('Nome é obrigatório'),
            username: yup.string().required('Nome de usuário é obrigatório').min(3, 'Nome de usuário precisa ter pelo menos 3 caracteres'),
            email: yup.string().email('Email inválido').required('Email é obrigatório'),
            password: yup.string().min(5, 'Senha precisa ter pelo menos 5 caracteres').max(10, 'Senha precisa ter no máximo 10 caracteres').required('Senha é obrigatória'),
            phone_number: yup.string()
                .nullable()
                .matches(/^[0-9]+$/, 'O número de telefone deve conter apenas dígitos.')
                .min(10, 'O número de telefone precisa ter pelo menos 10 dígitos.')
                .max(15, 'O número de telefone não pode ter mais de 15 dígitos.'),
        });

        try {
            await userSchema.validate(req.body, { abortEarly: false });

            const { name, username, email, password, phone_number } = req.body;

            const userExists = await User.findOne({ where: { email } });
            console.log('UserExists:', userExists); 
            const usernameExists = await User.findOne({ where: { username } });

            if (userExists) {
                return res.status(400).json({ message: 'Usuário já existe, verifique email ou username' });
            }
            if (usernameExists) {
                return res.status(400).json({ message: 'Usuário já existe, verifique email ou username' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                username,
                email,
                phone_number,
                password: hashedPassword,
                admin: false,
            });

            return res.status(201).json({
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    phone_number: user.phone_number,
                    admin: user.admin,
                },
            });

        } catch (e) {
            if (e instanceof yup.ValidationError) {
                return res.status(400).json({ errors: e.errors });
            }
            console.log(e);
            return res.status(500).json({ message: 'Erro interno no servidor. Tente novamente.' });
        }
    }

    async update(req, res) {
        const userSchema = yup.object().shape({
            name: yup.string(),
            username: yup.string().min(3, 'Nome de usuário precisa ter pelo menos 3 caracteres'),
            email: yup.string().email('Email inválido'),
            password: yup.string()
                .min(5, 'Senha precisa ter pelo menos 5 caracteres')
                .max(10, 'Senha precisa ter no máximo 10 caracteres'),
            phone_number: yup.string()
                .nullable()
                .matches(/^[0-9]+$/, 'O número de telefone deve conter apenas dígitos.')
                .min(10, 'O número de telefone precisa ter pelo menos 10 dígitos.')
                .max(15, 'O número de telefone não pode ter mais de 15 dígitos.'),
        });

        try {
            await userSchema.validate(req.body, { abortEarly: false });

            const { id } = req.params;

            if(!id || id !== req.userId){
                return res.status(403).json({ message: 'Acesso negado' });
            }

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const { name, username, email, password, phone_number } = req.body;

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
            }

            await user.update({
                name: name || user.name,
                username: username || user.username,
                email: email || user.email,
                phone_number: phone_number || user.phone_number,
            });

            return res.status(200).json({
                message: 'Usuário atualizado com sucesso',
                user: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    phone_number: user.phone_number,
                },
            });
        } catch (e) {
            if (e instanceof yup.ValidationError) {
                return res.status(400).json({ errors: e.errors });
            }
            console.log(e);
            return res.status(500).json({ message: 'Erro interno no servidor. Tente novamente.' });
        }
    }

    async delete(req, res) {
        const { id } = req.params;

        try {
            
            if (!id || id !== req.userId) {
                return res.status(403).json({ message: 'Acesso negado.' });
            }

            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            await user.destroy();

            return res.status(200).json({ message: 'Usuário deletado com sucesso' });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Erro interno no servidor. Tente novamente.' });
        }
    }

}

export default new RegisterController()