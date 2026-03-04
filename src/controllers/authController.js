const pool = require ('../config/db');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const register = async (req,res)=>{
    const {email, password} = req.body;
    try {
        const userExist = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if(userExist.rows.length > 0){
            return res.status(400).json({message: 'El usuario ya existe'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING *', 
            [email, hashedPassword]);
        res.status(201).json({
            msg: 'Usuario registrado exitosamente', user: newUser.rows[0]
        });
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Error en el servidor'});
    }
}
//Hacer un login
const login = async(req, res)=>{
    const {email, password}= req.body;
    try{
        const result= await pool.query('SELECT * FROM usuarios where email=$1', [email]);
        if(result.rows.length===0){
            return res.status(404).json({mensaje: 'Credenciales invalidas(Email)'});
        }

        const usuario= result.rows[0];

        const isMatch= await bcrypt.compare(password, usuario.password);

        if(!isMatch){
            return res.status(400).json({mensaje:'El Password es incorrecta'});
        }

        const payload={
            id:usuario.id,
            rol: usuario.rol,
            email: usuario.email
        };

        const token= jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        
        res.json({
            mensaje: 'Bienvenido',
            token: token
        });
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Error en el servidor'});
    }
}
module.exports= {register, login};