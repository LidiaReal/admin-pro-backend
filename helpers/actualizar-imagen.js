const fs = require('fs');

const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');

const borrarImagen = (pathOld) => {
    if (fs.existsSync(pathOld)) {
        // borrar la imagen anterior
        fs.unlinkSync(pathOld);
    }
}

const actualizarImagen = async(tipo, id, nombreArchivo) => {

    let pathOld = '';

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('No se encontro el médico con ese id');
                return false;
            }
            pathOld = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathOld);
            medico.img = nombreArchivo;
            await medico.save();
            return true;
            break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('No se encontro el hospital con ese id');
                return false;
            }
            pathOld = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathOld);
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
            break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No se encontro el usuario con ese id');
                return false;
            }
            pathOld = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathOld);
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            break;

        default:
            break;
    }

}

module.exports = {
    actualizarImagen
}