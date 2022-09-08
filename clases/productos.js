const {promises:fs} = require('fs');

class ContenedorProductos{
    constructor( archivo ){
        this.archivo=archivo;
    }


    async save(obj) {
        const mensajes = await this.getAll(); 
        const id = mensajes.length + 1;
        const producto = {...obj, id:id}
        mensajes.push(producto) 
        console.log(producto)
        try {
            await fs.writeFile(`${this.archivo}`, JSON.stringify(mensajes))
            console.log('se guardo exitosamente')
        } 
        catch (err) {
            console.log('error al guardar')
        }
    }

    async getAll () {
        try {

            const contenido = await fs.readFile(`${this.archivo}`, 'utf-8')
            return JSON.parse(contenido); 
        }
        catch (err) {
            console.log('error en la lectura')
        }
    };

    async buscarproducto(id) {
        const productos = await this.getAll();
        return productos.find((valor) => valor.id == id )
    }

    async actualizaproducto(id, producto) {
        let productos = await this.getAll();
        if(productos.find((valor) => valor.id == id)){
        productos = productos.filter((producto) => producto.id != id)
        const productoA = {...producto, id: id} 
        productos.push(productoA);
        try {
            await fs.writeFile(`${this.archivo}`, JSON.stringify(productos))
            return productoA
        } 
        catch (err) {
            return undefined
        }
        }
    }

    async borrarPorId( id ) {
        let productos = await this.getAll();
        if(productos.find((valor) => valor.id == id)){
        productos = productos.filter((producto) => producto.id != id)
        try {
            await fs.writeFile(`${this.archivo}`, JSON.stringify(productos))
            return true
        } 
        catch (err) {
            return false
        }
        }
    }
}

module.exports = ContenedorProductos; 

