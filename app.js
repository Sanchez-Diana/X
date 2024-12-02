const express = require('express')
const app = express();
const fs = require('fs') 
const port = 3000;

app.use(express.json())
app.use(express.urlencoded({extended:false})) 

app.listen(port, () => {
    console.log(`corriendo en puerto ${port}`)
})



const leerDatos = () =>{
    try{ 
    const datos = fs.readFileSync('./data/datos.json');
    return JSON.parse(datos);
    }catch(error){ 
        console.log(error)
    }
}
const escribirDatos = (datos) =>{
    try{
        fs.writeFileSync('data/datos.json', JSON.stringify(datos)) 
    }catch(error){
        console.log(error)
    }
}

function reOrdenar(datos){
    let indice=1;
    datos.productos.map((p)=>{
        p.id = indice;
        indice++;
    })
}


// rutas

app.get('/productos', (req, res) =>{

    const datos = leerDatos();
    res.json(datos.productos);

})


app.post('/productos', (req, res) =>{

    const datos = leerDatos();
    
    console.log(datos.productos.length)
    nuevoProd = {id : datos.productos.length + 1, ...req.body} 
    

    datos.productos.push(nuevoProd)
    escribirDatos(datos);

    res.json({
              "mensaje": 'nuevo producto agregado',
              "producto": nuevoProd})
})


app.get('/productos/:id', (req, res) =>{

    const datos = leerDatos();

    console.log(req.params.id)

   const prodEncontrado = datos.productos.find((p) => p.id==req.params.id)
    if(!prodEncontrado){
      return  res.status(404).json('no se encuentra el producto')
    }
    res.json({
            "mensaje": "producto encontrado",
            "prod": prodEncontrado})
})



app.put('/productos/:id', (req, res) =>{

    const id = req.params.id
    const nuevosDatos = req.body
    const datos=leerDatos()
    const prodEncontrado = datos.productos.find((p)=>p.id==req.params.id)

        if(!prodEncontrado){
          return res.status(404),res.json('No se encuentra el producto')
        }

        datos.productos = datos.productos.map(p=>p.id==req.params.id?{...p,...nuevosDatos}:p)
        escribirDatos(datos)
        res.json({mensaje: "productos actualizados"})

})


app.delete('/productos/:id', (req, res) =>{

    const id = req.params.id
    const datos=leerDatos()
    const prodEncontrado = datos.productos.find((p)=>p.id==req.params.id)

        if(!prodEncontrado){
          return res.status(404),res.json('No se encuentra el producto')
        }

        datos.productos = datos.productos.filter((p)=>p.id!=req.params.id)
        reOrdenar(datos)
        escribirDatos(datos)
        res.json({"Mensaje":'producto eliminado'})

})
