const express = require('express');
const { Router } = express;

const app = express();
const routerP = Router();
const routerC = Router();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


/*-------------Importación de las clases----------- */

const ContenedorProductos = require('./clases/productos');
const ContenedorCarrito = require('./clases/carrito');

const ContenedorP = new ContenedorProductos('productos.json');
const ContenedorC = new ContenedorCarrito('carritos.json');

/*-------------Router productos----------- */

routerP.get('/:id?', async ( req , res ) => { 
    const productoEnc = await ContenedorP.buscarproducto(req.params.id);
    if(productoEnc){
        res.send(productoEnc)
    } else {
        const productos = await ContenedorP.getAll();
        res.send(productos)
    }
});

routerP.post('/',( req , res ) => {
  ContenedorP.save(req.body);
  res.send(`se ha guardado con éxito el siguiente producto: ${JSON.stringify(req.body)}`)  
});

routerP.put('/:id', async ( req , res ) => {
    const productoA = await ContenedorP.actualizaproducto(req.params.id , req.body)
    if (productoA){
    res.send(`se actualizó el producto ${JSON.stringify(productoA)}`)
    }   else{
        res.send(`no se encontró el producto`)
    }
})

routerP.delete('/:id', async ( req , res ) => {
    const productoB = await ContenedorP.borrarPorId(req.params.id)
    if (productoB){
    res.send(`se eliminó el producto con id ${req.params.id}`)
    }   else{
        res.send(`no se encontró el producto`)
    }
})

/*-------------Router carrito----------- */

routerC.post('/', async ( req , res ) => {
    const producto = await ContenedorP.buscarproducto(req.body.id)
    if (producto){
        const carrito = {productos:[producto]}
        const carritoN = await ContenedorC.crearCarrito(carrito)
        if (carritoN){
            res.send(JSON.stringify(carritoN))
        } else {
            res.send('error al guardar el carrito')
        }
    } else{
        res.send('no se encontro el producto')
    }  
})

routerC.delete('/:id', async ( req , res ) => {
    const carritoB = await ContenedorC.borrarPorId(req.params.id)
    if (carritoB){
        res.send(`se eliminó el carrito con id ${req.params.id}`)
        } else{
            res.send(`no se encontró el carrito`)
        }
})

routerC.get('/:id/productos', async ( req , res ) => {
    const carrito = await ContenedorC.buscarCarrito(req.params.id)
    if (carrito){
    res.send(JSON.stringify(carrito.productos))
    } else {
        res.send('no se encontro el carrito')
    }
})

routerC.post('/:id/productos', async ( req , res ) => {
    const producto = await ContenedorP.buscarproducto(req.body.id)
    if (producto){
        const carrito = await ContenedorC.modificarProducto(producto , req.params.id)
        if (carrito){
            res.send(JSON.stringify(carrito))
        } else {
            res.send('error al guardar el carrito')
        }
    } else{
        res.send('no se encontro el producto')
    }  
})

routerC.delete('/:id/productos/:id_prod', async ( req , res ) => {
        const carrito = await ContenedorC.eliminarProducto(req.params.id_prod , req.params.id)
        if (carrito){
            res.send(JSON.stringify(carrito))
        } else {
            res.send('error al guardar el carrito')
        }
})

/*-------------Declaración de rutas base----------- */
app.use('/api/productos', routerP)
app.use('/api/carrito', routerC)

app.use(express.static('public'))

/*-------------Inicialización del server----------- */
const Port = 8080;

const connectedServer = app.listen(Port, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))