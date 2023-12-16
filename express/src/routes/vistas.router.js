import { Router } from 'express';
// import { ProductManager } from '../ProductManager.js';
export const router=Router()


import { join } from "path";//Utilizamos el path para poder trabajar con rutas absolutas
import __dirname from '../../../utils2.js'; //Importamos utils para poder trabvajar con rutas absolutas
import { ProductManager } from '../ProductManager.js';
import { io } from '../app.js';
import { productsModelo } from '../dao/models/products.model.js';







let archivo = join(__dirname, "/archivos/products.json");
console.log(archivo)

const productManager = new ProductManager(archivo)

router.get('/', async (req,res)=>{

    try {
        let resultado =  await productManager.getProductsAsyncFS();
        // res.setHeader('Content-Type','text/html');
        res.status(200).render('home',{resultado, titulo :'Home Page', estilo:"stylesHome"})

    } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`error`});
    }



    
})
router.get('/realtimeproducts',async (req,res)=>{
    try {
         
        let resultado =  await productManager.getProductsAsyncFS();
        res.status(200).render('realtimeproducts',{resultado, titulo :'RealTime Page', estilo:"stylesHome"})

    } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`error`});
    }
}
)


router.get('/chat',  (req,res)=>{
    try {
         
      
        res.status(200).render('chat', {titulo:"Chat", estilo:"styles"})

    } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`error`});
    }
}
)

router.get('/products',  async (req,res)=>{ //trabajando con la vista de paginate

    let pagina =1  

    if (req.query.pagina) {//capturamos el  valor de pagina
        pagina = req.query.pagina
        console.log(pagina)
    }

    let limit =10;
    if(req.query.limit){  //capturamos el  valor de limit 
      limit= req.query.limit
      console.log(limit)
    }
  

    let productos
    try {
        productos = await productsModelo.paginate({},{lean:true, limit:limit, page:pagina})//ya esta instalado el plugin de paginate 'mongoose-paginate-v2'
        console.log(productos)
        //Los documentos viene de una propiedad llamada docs
        //mongoose-paginate trae por defecto el paginado de 10
        
    } catch (error) {
        console.log(error)
        productos=[]
    }


    let {totalPages, page, hasPrevPage, hasNextPage, prevPage,nextPage} = productos

    console.log(totalPages, page, hasPrevPage, hasNextPage, prevPage,nextPage)

  
         

      
        res.status(200).render('homepagemongo',{productos: productos.docs, totalPages, page, hasPrevPage, hasNextPage, prevPage,nextPage})

  
}
)