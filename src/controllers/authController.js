const pool = require ('../config/db'); // Importa la conexión a la base de datos desde el archivo db.js para ejecutar consultas relacionadas con la autenticación de usuarios
const bcrypt = require('bcryptjs'); // Importa bcryptjs para manejar el hashing de contraseñas, lo que permite almacenar contraseñas de forma segura en la base de datos

const jwt = require('jsonwebtoken');// Importa jsonwebtoken para generar tokens JWT, que se utilizan para autenticar a los usuarios después de que inician sesión exitosamente

const register = async (req,res)=>{ // Define la función register como una función asíncrona que maneja la lógica de registro de usuarios. Esta función recibe la solicitud (req) y la respuesta (res) como parámetros.
    const {email, password} = req.body; // Extrae el email y la contraseña del cuerpo de la solicitud, que se espera que sean enviados por el cliente al intentar registrarse
    try {
        const userExist = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]); // Ejecuta una consulta a la base de datos para verificar si ya existe un usuario con el mismo email. Utiliza una consulta parametrizada para evitar inyecciones SQL.
        if(userExist.rows.length > 0){// Si la consulta devuelve resultados, significa que el email ya está registrado en la base de datos, por lo que se devuelve una respuesta con un mensaje de error indicando que el usuario ya existe.
            return res.status(400).json({message: 'El usuario ya existe'});
        }

        const salt = await bcrypt.genSalt(10);// Genera un salt utilizando bcrypt, que se utiliza para mejorar la seguridad del hashing de contraseñas. El número 10 indica la cantidad de rondas de hashing que se aplicarán, lo que hace que el proceso sea más lento y difícil de romper.
        const hashedPassword = await bcrypt.hash(password, salt); // Hashea la contraseña proporcionada por el usuario utilizando el salt generado. Esto asegura que la contraseña se almacene de forma segura en la base de datos, ya que incluso si alguien accede a la base de datos, no podrá ver las contraseñas originales.

        const newUser = await pool.query(// Inserta el nuevo usuario en la base de datos con el email y la contraseña hasheada. Utiliza una consulta parametrizada para evitar inyecciones SQL. La cláusula RETURNING * devuelve el nuevo usuario insertado, lo que permite enviar esta información en la respuesta.
            'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING *', 
            [email, hashedPassword]);
        res.status(201).json({
            msg: 'Usuario registrado exitosamente', user: newUser.rows[0]
        });
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Error en el servidor'});
    }
    //
}
//Hacer un login
const login = async(req, res)=>{// Define la función login como una función asíncrona que maneja la lógica de inicio de sesión de usuarios. Esta función también recibe la solicitud (req) y la respuesta (res) como parámetros.
    const {email, password}= req.body;// Extrae el email y la contraseña del cuerpo de la solicitud, que se espera que sean enviados por el cliente al intentar iniciar sesión
    try{
        const result= await pool.query('SELECT * FROM usuarios where email=$1', [email]); // Ejecuta una consulta a la base de datos para buscar un usuario con el email proporcionado. Utiliza una consulta parametrizada para evitar inyecciones SQL.
        if(result.rows.length===0){// Si la consulta no devuelve resultados, significa que no existe un usuario con ese email en la base de datos, por lo que se devuelve una respuesta con un mensaje de error indicando que las credenciales son inválidas.
            return res.status(404).json({mensaje: 'Credenciales invalidas(Email)'});
        }

        const usuario= result.rows[0];// Si se encuentra un usuario con el email proporcionado, se extrae la información del usuario de la consulta. Luego, se utiliza bcrypt para comparar la contraseña proporcionada por el usuario con la contraseña hasheada almacenada en la base de datos. Si las contraseñas no coinciden, se devuelve una respuesta con un mensaje de error indicando que las credenciales son inválidas.

        const isMatch= await bcrypt.compare(password, usuario.password);// Compara la contraseña proporcionada por el usuario con la contraseña hasheada almacenada en la base de datos utilizando bcrypt. La función compare devuelve true si las contraseñas coinciden y false si no coinciden.

        if(!isMatch){// Si las contraseñas no coinciden, se devuelve una respuesta con un mensaje de error indicando que las credenciales son inválidas.
            return res.status(400).json({mensaje:'El Password es incorrecta'});
        }

        const payload={// Si las credenciales son válidas, se crea un payload para el token JWT que incluye información relevante del usuario, como su ID, rol y email. Esta información se puede utilizar posteriormente para verificar la autenticidad del token y autorizar el acceso a rutas protegidas.
            id:usuario.id,
            rol: usuario.rol,
            email: usuario.email
        };

        const token= jwt.sign(// Genera un token JWT utilizando el payload creado anteriormente y una clave secreta definida en las variables de entorno. El token se configura para expirar en 1 hora, lo que significa que después de ese tiempo, el usuario tendrá que iniciar sesión nuevamente para obtener un nuevo token.
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        
        res.json({// Si el inicio de sesión es exitoso, se devuelve una respuesta JSON que incluye un mensaje de bienvenida y el token JWT generado. El cliente puede almacenar este token y enviarlo en las solicitudes posteriores para acceder a rutas protegidas que requieren autenticación.
            mensaje: 'Bienvenido',
            token: token
        });
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Error en el servidor'});
    }
}
module.exports= {register, login};// Exporta las funciones register y login para que puedan ser utilizadas en otras partes de la aplicación, como en las rutas de autenticación definidas en authRoutes.js.