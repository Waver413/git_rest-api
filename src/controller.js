import {pool} from './database.js';

class LibroController{
    async getAll(req, res) {
        try{
        const [result] = await pool.query(`SELECT * FROM Libros`);
        res.json(result);
        } catch (error){
            console.log('Solicitud invalida');
        }
    }

    async getOne(req, res) {
        try{
        const libro = req.body;
        const [result] = await pool.query(`SELECT * FROM Libros WHERE id=(?)`, [libro.id]);
        res.json(result);
        } catch (error){
            console.log('Solicitud invalida');
        }
    }

    async add(req, res){
        const libro = req.body;
        const caracteristicas = ['nombre', 'autor', 'categoria', 'anio_publicado', 'isbn'];
        const caracteristicaExtra = Object.keys(libro).filter(attr => !caracteristicas.includes(attr));

        if (caracteristicaExtra.length > 0) {
            return res.json({ error: `Caracteristica de libro invalida: ${caracteristicaExtra.join(' , ')}`});
        }
    try{
        const [result] = await pool.query(`INSERT INTO Libros(nombre, autor, categoria, anio_publicado, isbn) VALUES (?, ?, ?, ?, ?)`, [libro.nombre, libro.autor, libro.categoria, libro.anio_publicado, libro.isbn]);
        res.json({"Id insertado": result.insertId});
    } catch (error){
        console.log('No se pudo añadir el libro');
    }
    }

    async delete(req, res){
        const libro = req.body;
        try{
        const [result] = await pool.query(`DELETE FROM Libros WHERE isbn=(?)`, [libro.isbn]);
        res.json({"Registros eliminados": result.affectedRows});
    } catch (error){
        console.log('No se pudo eliminar el libro');
    }
    }

    async update(req, res){
        const libro = req.body;

    try{
        const [result] = await pool.query(`UPDATE Libros SET nombre=(?), autor=(?), categoria=(?), anio_publicado=(?), isbn=(?) WHERE id=(?)`, [libro.nombre, libro.autor, libro.categoria, libro.anio_publicado, libro.isbn, libro.id]);
        res.json({"Registros actualizados": result.changedRows});
    } catch (error){
        console.log('No se pudo actualizar el libro', error);
    }
    }

}

export const libro = new LibroController();