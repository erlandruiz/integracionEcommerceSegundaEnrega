import { Router } from 'express';
import { CartManagerMongo } from '../dao/CartManagerMongo.js';
import mongoose from 'mongoose';
import { cartsModelo } from '../dao/models/carts.model.js';
import { ProductManagerMongo } from '../dao/ProductManagerMongo.js';
import { productsModelo } from '../dao/models/products.model.js';

export const router=Router()

const cartManagerMongo = new CartManagerMongo()

const productManagerMongo3 = new ProductManagerMongo()

router.get('/',async (req,res)=>{

    let carts = []
    try {
        carts = await cartManagerMongo.getCartsMongo()
    } catch (error) {
        console.log(error.messsage)
    }
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({carts});
   
})

//conseguimos un carrito pór ID
router.get('/:cid', async(req, res)=>{
  let {cid} = req.params


//se aplica retun al obtener error 
  if(!mongoose.Types.ObjectId.isValid(cid)){ // con esta instruccion validamos que el ID sea Valido 
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`Ingrese un id válido...!!!`})
}

let existe

  try {
    // existe = await cartsModelo.findOne({deleted:false, _id:cid})
    existe = await cartManagerMongo.getCartsByIdMongo(cid)
    
  } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
  }
  if (!existe) {
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`No existe carrito con id ${cid}`});
  }
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({carrito: existe});

})


router.post('/',async (req,res)=>{

    let {
        products 
      } = req.body;


// SE procede a crear el carrito vacio


      try {
        // let resultado = await cartsModelo.insertMany({products})
        let resultado = await cartManagerMongo.addCartMongo(products)
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({payload: resultado});
      } catch (error) {
            res.setHeader('Content-Type','application/json');
            return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
      }

      
})

router.post('/:cid/product/:pid', async(req , res)=>{
  let{cid} = req.params;
  let{pid} = req.params;

  //NO se parsea 
  // cid = parseInt(cid);
  // pid = parseInt(pid);

  console.log('codigo de carrito', cid)
  console.log('codigo de producto', pid)

  //se aplica retun al obtener error 
  if(!mongoose.Types.ObjectId.isValid(cid)){ // con esta instruccion validamos que el cid sea Valido 
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`Ingrese un carrito id válido...!!!`})
}


  if(!mongoose.Types.ObjectId.isValid(pid)){ // con esta instruccion validamos que el pid sea Valido 
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`Ingrese un producto id válido...!!!`})
}

  //Buscar si cid existe
  let existeCid
  try {
   existeCid = await cartsModelo.findOne({deleted: false, _id:cid}).lean()
  } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
  }

  if (!existeCid) {
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`No existe el carrito con id ${cid}`});
  }
    // res.setHeader('Content-Type','application/json');
    // return res.status(200).json({payload: existeCid});


   //Buscar si pid existe

   let existePid 
   try {
    existePid = await productsModelo.findOne({deleted: false, _id:pid}).lean()
   } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
   }

   if (!existePid) {
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`No existe el producto con id ${pid}`});
   }

  //  res.setHeader('Content-Type','application/json');
  //  return res.status(200).json({payload: {existePid, existeCid}});

  //  console.log(existeCid)
   
  //  console.log(existePid)

   //buscamos el producto dentro del array de carritos
   let cartBuscar, productosBuscar
   try {
    // productosBuscar = await cartsModelo.find({}).lean()
    cartBuscar = await cartsModelo.findOne({deleted:false, _id: cid}).lean()

    // console.log(productosBuscar)
    // console.log('cart a buscar', cartBuscar)
   } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
   }

let {products} = cartBuscar
console.log('Products a buscar',products)

// let [data] = products
// console.log(data)
// console.log(data.productId)
// console.log(data.qty)

//Bucando el producto 

let productoEncontrado = products.find( product =>product.productId === pid)

if (productoEncontrado) {
  console.log('Producto encontrado', productoEncontrado)

  // http://localhost:8080/api/cartsmongo/6572ced376315d16a30cefde/product/6572a3511e95089a27bee8df
 const productoActualizar = await cartsModelo.findOneAndUpdate(
  {_id:cid, "products.productId": pid},
  {$inc:{"products.$.qty":1}}, //Incrementa qty en 1
  {new:true}
  )

  console.log(productoActualizar)
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload: productoActualizar});


} else {
  console.log('Producto no encontrado')
  // http://localhost:8080/api/cartsmongo/6572ced376315d16a30cefde/product/6572a3511e95089a27bee8df

  let agregandoArreglo = await cartsModelo.findByIdAndUpdate(
    cid,
    {
      $push: {
        products: {
          "productId": pid,
          "qty": 1
        }
      },
      
    },
    { new: true } // Devuelve el documento actualizado
    
    
    ) 
  
    console.log(agregandoArreglo)
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload: agregandoArreglo});


}




})

router.delete('/:cid/products/:pid', async(req , res)=>{ //eliminar el carrito del producto seleccionado 
  let{cid} = req.params;
  let{pid} = req.params;

  

  console.log('codigo de carrito', cid)
  console.log('codigo de producto', pid)

  //se aplica retun al obtener error 
  if(!mongoose.Types.ObjectId.isValid(cid)){ // con esta instruccion validamos que el cid sea Valido 
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`Ingrese un carrito id válido...!!!`})
}


  if(!mongoose.Types.ObjectId.isValid(pid)){ // con esta instruccion validamos que el pid sea Valido 
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`Ingrese un producto id válido...!!!`})
}

  //Buscar si cid existe
  let existeCid
  try {
   existeCid = await cartsModelo.findOne({deleted: false, _id:cid}).lean()
  } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
  }

  if (!existeCid) {
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`No existe el carrito con id ${cid}`});
  }
  


   //Buscar si pid existe

   let existePid 
   try {
    existePid = await productsModelo.findOne({deleted: false, _id:pid}).lean()
   } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
   }

   if (!existePid) {
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`No existe el producto con id ${pid}`});
   }



   //buscamos el producto dentro del array de carritos
   let cartBuscar, productosBuscar
   try {
    // productosBuscar = await cartsModelo.find({}).lean()
    cartBuscar = await cartsModelo.findOne({deleted:false, _id: cid}).lean()

    // console.log(productosBuscar)
    // console.log('cart a buscar', cartBuscar)
   } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
   }

let {products} = cartBuscar
console.log('Products a buscar',products)



//Bucando el producto 

let productoEncontrado = products.find( product =>product.productId === pid)

if (productoEncontrado) {
  console.log('Producto encontrado', productoEncontrado)

  // http://localhost:8080/api/cartsmongo/6572ced376315d16a30cefde/product/6572a3511e95089a27bee8df

  const productoEliminar = await cartsModelo.updateOne(
    {_id: cid},
    {
      $pull: {
        "products": {
          productId: pid,
        }
      }
    }
  
  )

//  const productoActualizar = await cartsModelo.findOneAndUpdate(
//   {_id:cid, "products.productId": pid},
//   {$inc:{"products.$.qty":1}}, //Incrementa qty en 1
//   {new:true}
//   )

  console.log(productoEliminar)
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload: productoEliminar});


} else {
  console.log('Producto no encontrado')
  // http://localhost:8080/api/cartsmongo/6572ced376315d16a30cefde/product/6572a3511e95089a27bee8df


  
  
    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload: `No se encontro el producto con id  ${pid}`});


}




})


router.put('/:cid', async(req , res)=>{ //actualizar el producto con un arreglo de productos enviados por req.body

  
  let {cid }= req.params //capturamos el cid
  let productoDeBody=  req.body.products // capturamos el body
  

  // validamos si los carritoId tiene formato valido
  if(!mongoose.Types.ObjectId.isValid(cid)){ // con esta instruccion validamos que el cid sea Valido 
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`Ingrese un carrito id válido...!!!`})
}

// Recorremos con map para sacar todos los productIds
const productIds = productoDeBody.map(
  (producto)=>{
    return producto.productId
    
  }
)
// console.log(productIds)

//recorre cada productId y valida es tiene formato valido de mongoose

for (const productId of productIds) {
  if(!mongoose.Types.ObjectId.isValid(productId)){ // con esta instruccion validamos que los productID son Validos 
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`el producto con Id ${productId} no tiene el formato valido, Ingrese un  id de prodcuto válido...!!!`})
}
  
}


//validamos si los productsId existen 
let existePid 
for (const productId of productIds) {

  try {
    existePid = await productsModelo.findOne({deleted: false, _id:productId}).lean()
   } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
   }
   
   if (!existePid) {
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`No existe el producto con id ${productId}`});
   }
  
}





 
  let productoActualizar
  try {
     productoActualizar = await cartsModelo.updateOne(
      {deleted: false, _id : cid}, 
      {
        $set: {
          "products" :productoDeBody
        }
      }
      
      )
    
  } catch (error) {
    console.log(error.message)
  }

  console.log(productoActualizar)

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload: productoActualizar});

 


})

router.put('/:cid/products/:pid', async(req , res)=>{ //actualiza solo la cantidad del producto por cualquier catidad pasada por query
  let{cid} = req.params;
  let{pid} = req.params;
  let newQty = req.body.qty



  console.log('codigo de carrito', cid)
  console.log('codigo de producto', pid)
  console.log('cantidad para actualizar', newQty)

  //se aplica retun al obtener error 
  if(!mongoose.Types.ObjectId.isValid(cid)){ // con esta instruccion validamos que el cid sea Valido 
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`Ingrese un carrito id válido...!!!`})
}


  if(!mongoose.Types.ObjectId.isValid(pid)){ // con esta instruccion validamos que el pid sea Valido 
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`Ingrese un producto id válido...!!!`})
}

  //Buscar si cid existe
  let existeCid
  try {
   existeCid = await cartsModelo.findOne({deleted: false, _id:cid}).lean()
  } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
  }

  if (!existeCid) {
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`No existe el carrito con id ${cid}`});
  }
    // res.setHeader('Content-Type','application/json');
    // return res.status(200).json({payload: existeCid});


   //Buscar si pid existe

   let existePid 
   try {
    existePid = await productsModelo.findOne({deleted: false, _id:pid}).lean()
   } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
   }

   if (!existePid) {
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`No existe el producto con id ${pid}`});
   }

   //Actualizando la cantidad del producto

   let carritoActualizar
   try {
     carritoActualizar = await cartsModelo.findOneAndUpdate(
      {_id:cid, "products.productId" : pid},
      {$set: { "products.$.qty": newQty }},
      { new: true }
    )
   } catch (error) {
    res.setHeader('Content-Type','application/json');
    return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
   }
   
     res.setHeader('Content-Type','tapplication/json');
    return res.status(200).json({payload: carritoActualizar});




})


router.delete('/:cid', async(req , res)=>{ //elimina todos los productos de un carrito  
  let{cid} = req.params;
  


  console.log('codigo de carrito', cid)
 

  //se aplica retun al obtener error 
  if(!mongoose.Types.ObjectId.isValid(cid)){ // con esta instruccion validamos que el cid sea Valido 
    res.setHeader('Content-Type','application/json');
    return res.status(400).json({error:`Ingrese un carrito id válido...!!!`})
}




  //Buscar si cid existe
  let existeCid
  try {
   existeCid = await cartsModelo.findOne({deleted: false, _id:cid}).lean()
  } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
  }

  if (!existeCid) {
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`No existe el carrito con id ${cid}`});
  }


  //vaciando el carrito

   let carritoVaciar
   try {
     carritoVaciar = await cartsModelo.updateOne(
      {_id:cid},
      {$set: { "products":[] }},
 
    )
   } catch (error) {
    res.setHeader('Content-Type','application/json');
    return res.status(500).json({error:`error inesperado en el servidor -Intente mas tarde`, detalle: error.message});
   }
   
     res.setHeader('Content-Type','tapplication/json');
    return res.status(200).json({payload: carritoVaciar});




})
