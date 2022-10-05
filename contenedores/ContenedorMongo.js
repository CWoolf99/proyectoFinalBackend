import mongoose from "mongoose";
import config from "../utils/config.js"

await mongoose.connect(config.mongo.link,config.mongo.options);

class ContenedorMongo {
    constructor(collection , schema ){
        this.collection = mongoose.model(collection , schema )  
    }
    async crearCarrito(obj) {
        const carrito = {...obj}
        carrito.timestamp = new Date().toLocaleString()
        try {
            await this.collection.create(carrito)
            return carrito
        } 
        catch (err) {
            return undefined
        }
    };

    async getAll () {
        try {
            let contenido = await this.collection.find({})
            return contenido; 
        }
        catch (err) {
            console.log('error en la lectura')
        }
    };

    async buscarCarritoProds(id) {
        try{
            let productos = await this.collection.findOne({_id:id}).select('productos');
            return productos;
        }
        catch{
            return undefined;
        }
    };

    async buscarProds(id) {
       try{
        let productos = await this.collection.findOne({_id:id});
        return productos;
    }
    catch (err){
        return undefined
        }
    };

    async actualizaproducto(id, producto) {
        let prod = producto
        try {
            await this.collection.updateOne({_id:id} , {$set:{nombre:prod.nombre,descripcion:prod.descripcion,codigo:prod.codigo, imagen:prod.imagen,precio:prod.precio,stock:prod.stock}})
            return prod
        } 
        catch (err) {
            return undefined
        }
    };
    async borrarPorId( id ) {
        try {
            await this.collection.deleteOne({_id:id})
            return true
        } 
        catch (err) {
            return false
        }
    };

    async modificarProducto (producto , id){
        try {
            await this.collection.updateOne({_id:id},{$push:{productos:producto}})
            return producto
        } 
        catch (err) {
            return undefined
        }

    };

    async eliminarProducto (productoId , id ) { 
        try {
            await this.collection.updateOne({_id:id},{$pull:{productos:{_id:productoId}}});
            carrito = await this.getAll()
            return carrito
        } 
        catch (err) {
            return false
        }
    };

}

export default ContenedorMongo;