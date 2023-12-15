# primera preentrega-erland-ruiz-rivera
Entrega de primera preentrega subiendo los datos a MongoDB Atlas


# http://localhost:8080/  
Para ingresar al home y ver todos los productos.


# http://localhost:8080/realtimeproducts
Para ver los titulos de los productos , agregar con postman y eliminar con postman

# http://localhost:8080/pagina2.html
Pagina estatica de ayuda para agregar los productos. El delete  si  solo lo hice con postman.

# http://localhost:8080/api/productsmongo
Pagina para ver los productos en Mongo Atlas.

# http://localhost:8080/api/cartsmongo/cid 
Para buscar carrito por ID


# http://localhost:8080/api/cartsmongo   usando el metodo POST , se crea un carrito
       {   
               "products":[
                          

               ]
             
       }

# http://localhost:8080/api/cartsmongo/6574d5b225b51f4d783ee62f/product/6572a3511e95089a27bee8df

<!-- ejemplos para probar -->
<!-- http://localhost:8080/api/cartsmongo/6574d5bb25b51f4d783ee633/product/6572a2aa1e95089a27bee8d9 -->

<!-- http://localhost:8080/api/cartsmongo/6574d5bb25b51f4d783ee633/product/6572a2ea1e95089a27bee8dc -->

Ejemplo de agregar a un carrito con cid = 6574d5b225b51f4d783ee62f  el incremento en uno del producto pid =6572a3511e95089a27bee8df

# http://localhost:8080/api/cartsmongo/6574d5b225b51f4d783ee62f/product/6572a2ea1e95089a27bee8dc

Ejemplo de agregar a un carrito con cid = 6574d5b225b51f4d783ee62f  un nuevo producto con del pid =6572a2ea1e95089a27bee8dc


# http://localhost:8080/api/productsmongo/?limit=3
Ordenando productos con limite = 3


# http://localhost:8080/api/productsmongo/?pagina=4&limit=4&sort=1
Ordena en forma ascendete por  precio.

# http://localhost:8080/api/productsmongo/?pagina=1&limit=4&sort=-1
Ordena en forma descendente por precio


# http://localhost:8080/api/cartsmongo/6574d5bb25b51f4d783ee633/products/6572a2ea1e95089a27bee8dc
ejemplo de como eleminar un producto de un carrrito
Utilizando DELETE en POSTMAN

# http://localhost:8080/api/cartsmongo/6574d5b225b51f4d783ee62f

Ejemplo en el body  lo que tenemos que colocar en el body  usando el POSTMAN en PUT  para acutalizar los productos  del producto de id 6574d5b225b51f4d783ee62f
 {
            "_id": "6574d5b225b51f4d783ee62f",
            "products": [
                {
                    "productId": "6572a2aa1e95089a27bee8d9",
                    "qty": 2 //colocamos la cantidad que deseamos actualizar
                },
                {
                    "productId": "6572a3511e95089a27bee8df",
                    "qty": 7 //colocamos la cantidad que deseamos actualizar
                },
                {
                    "productId": "6572a2ea1e95089a27bee8dc",
                    "qty": 1//colocamos la cantidad que deseamos actualizar
                }
            ]
           
}

# http://localhost:8080/api/cartsmongo/6574d5b225b51f4d783ee62f/products/6572a2aa1e95089a27bee8d9
Ejemplo para actualizar solo la cantidad  de un producto que exite en el carrito, utilizando POSTMAN y el metodo PUT

 {
          
                    "qty": 20
              
           
}


# http://localhost:8080/api/cartsmongo/6576b78cf8806e21842156f6

Ejemplo para vaciar el carrito con id = 6576b78cf8806e21842156f6