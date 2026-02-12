const pool = require('../config/db');

const poblarProductos = async (request, response) => {
    try {
        // Fetch FakeStoreApi
        const apiFetch = await fetch('http://fakestoreapi.com/products');
        const products = await apiFetch.json();

        let inserciones = 0;
        // Destructurar el objeto
        for(const product of products){
            
            const { title, price, description, image, category} = product;
                
            const catQuery = `SELECT id FROM categoria WHERE nombre = $1`;
            const catResult = await pool.query(catQuery, [category]);
            let id_categoria;
            if (catResult.rows.length > 0) {
                id_categoria = catResult.rows[0].id;
            } else {
                const insertCat = `
                    INSERT INTO categoria (nombre)
                    VALUES ($1)
                    RETURNING id
                `;
                const newCat = await pool.query(insertCat, [category]);
                id_categoria = newCat.rows[0].id;
            }
            const stock = Math.floor(Math.random() * 50) + 1;

            const query = `
                INSERT INTO productos
                (nombre, precio, stock, descripcion, imagen_url,id_categoria)
                VALUES ($1, $2, $3, $4, $5, $6)
            `

            await pool.query(query, [title, price, stock, description, image, id_categoria]);

            inserciones++;
        }
        response.status(200).json(
            {
                mensaje: "Carga masiva exitosa", 
                cantidad: inserciones
            }
        );
    } catch (error) {
        console.log(`Error: ${error}`);
        response.status(500).json({error: error.message})
    }
};

const buscarProducto = async (request, response) => {
    try {
        const { termino } = request.params;
        
        const query = `
            SELECT p.*, c.nombre as categoria_nombre
            FROM productos p
            LEFT JOIN categoria c ON p.id_categoria = c.id
            WHERE LOWER(p.nombre) LIKE LOWER($1)
        `;
        
        const result = await pool.query(query, [`%${termino}%`]);
        
        if (result.rows.length === 0) {
            return response.status(404).json({
                mensaje: "No se encontraron productos con ese término"
            });
        }
        
        response.status(200).json(result.rows);
    } catch (error) {
        console.log(`Error: ${error}`);
        response.status(500).json({error: error.message});
    }
};

const buscarCategoria = async (request, response) => {
    try {
        const { termino } = request.params;
        
        const query = `
            SELECT c.*, COUNT(p.id) as total_productos
            FROM categoria c
            LEFT JOIN productos p ON c.id = p.id_categoria
            WHERE LOWER(c.nombre) LIKE LOWER($1)
            GROUP BY c.id
        `;
        
        const result = await pool.query(query, [`%${termino}%`]);
        
        if (result.rows.length === 0) {
            return response.status(404).json({
                mensaje: "No se encontraron categorías con ese término"
            });
        }
        
        response.status(200).json(result.rows);
    } catch (error) {
        console.log(`Error: ${error}`);
        response.status(500).json({error: error.message});
    }
};

module.exports = { poblarProductos, buscarProducto, buscarCategoria };