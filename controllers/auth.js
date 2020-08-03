const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({ email });

        // Verificar email
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'El email no es válido'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es válida'
            });
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado. Revisar logs.'
        });
    }

}

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        // verificar si usuario existe
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            // si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // guardar en bbdd
        await usuario.save();

        // generar el TOKEN - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }



}

module.exports = {
    login,
    googleSignIn
}