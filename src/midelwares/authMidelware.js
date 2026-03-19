const jwt = require('jsonwebtoken');// Importa jsonwebtoken para verificar los tokens JWT que se envían en las solicitudes a rutas protegidas. Este middleware se utiliza para asegurar que solo los usuarios autenticados puedan acceder a ciertas rutas de la aplicación.

module.exports = (req, res, next) => {// Exporta una función middleware que se ejecuta antes de que se maneje la solicitud en las rutas protegidas. Esta función recibe la solicitud (req), la respuesta (res) y la función next() como parámetros.
    const token = req.header('Authorization');// Extrae el token JWT del encabezado de autorización de la solicitud. Se espera que el token se envíe en el formato "Bearer

    if(!token ){// Si no se proporciona un token en el encabezado de autorización, se devuelve una respuesta con un mensaje de error indicando que el acceso está denegado debido a la falta de un token.
        return res.status(401).json({msg:"Acceso denegado. No hay token"});
    }
    try{// Si se proporciona un token, se intenta verificar su validez utilizando la clave secreta definida en las variables de entorno. Si el token es válido, se decodifica y se agrega la información del usuario al objeto req.usuario para que esté disponible en las rutas protegidas. Luego, se llama a next() para pasar el control a la siguiente función middleware o al controlador de la ruta.
        const tokenLimpio = token.replace('Bearer ', '');// Si el token se envía en el formato

        const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);// Verifica la validez del token utilizando la clave secreta definida en las variables de entorno. Si el token es válido, se decodifica y se almacena en la variable decoded.

        req.usuario = decoded;// Agrega la información del usuario decodificada al objeto req.usuario para que esté disponible en las rutas protegidas. Esto permite que los controladores de las rutas accedan a la información del usuario autenticado, como su ID, rol o email.
        next();// Llama a next() para pasar el control a la siguiente función middleware o al controlador de la ruta. Esto permite que la solicitud continúe su procesamiento normal si el token es válido.
    }catch(error){// Si el token no es válido o ha expirado, se captura el error y se devuelve una respuesta con un mensaje de error indicando que el token no es válido o ha expirado. Esto asegura que los usuarios no autenticados no puedan acceder a las rutas protegidas.
        res.status(401).json({msg:"Token no válido o expirado "});
    }
};