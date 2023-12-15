import { Router } from 'express';
// import { ProductManager } from '../ProductManager.js';
export const router=Router()


import { join } from "path";//Utilizamos el path para poder trabajar con rutas absolutas
import __dirname from '../../../utils2.js'; //Importamos utils para poder trabvajar con rutas absolutas
import { ProductManager } from '../ProductManager.js';
import { io } from '../app.js';







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