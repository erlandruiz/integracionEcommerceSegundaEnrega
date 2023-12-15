//Se trabaja con ESC 6 utilizando import y export

import express, { urlencoded } from "express";

import { router as routerProducts } from "./routes/products.router.js";
import { router as routerCarts } from "./routes/carts.router.js";

import { join } from "path"; //Utilizamos el path para poder trabajar con rutas absolutas
import __dirname from "./utils.js"; //importo para crear una ruta absoluta de la carpeta public

import { engine } from "express-handlebars"; //para usar handlebars
import { router as vistasRouter } from "./routes/vistas.router.js";

import { Server } from "socket.io"; //Importando socket io para trabajar con websockets


import mongoose from 'mongoose'; //Importamos Mongoose 
import { router as routerProductsMongo  } from "./routes/products.router.mongo.js"; // Para trabajar con mongo atlas products
import { router as routerCartsMongo} from "./routes/carts.router.mongo.js"; // Para trabajar con mongo atlas carts
import { messagesModelo } from "./dao/models/message.models.js";


//************************ //
//Limpiamos la consola
console.clear();
//************************ //

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true })); // Colocamos la siguiente linea de comandos para que el servidor pueda interpretar datos complejos

let archivoViews = join(__dirname, "./views");


// app.engine('handlebars', engine({ //Colcamos esta instruccion para no tener problemas con los elementos Hidratados que vienen de mongoose
//     runtimeOptions: {
//         allowProtoPropertiesByDefault: true,
//         allowProtoMethodsByDefault: true,
//     },
// }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", archivoViews);

let archivoPublic = join(__dirname, "/public");
app.use(express.static(archivoPublic)); //http://localhost:8080/assets/img/producto.jpg

app.use("/api/products", routerProducts); // Lo que llega a api/products me lo atienda productsRouter//



app.use("/api/productsmongo", routerProductsMongo);


app.use("/api/carts", routerCarts); // Lo que llega a api/carts me lo atienda cartsRouter//


app.use("/api/cartsmongo", routerCartsMongo); 

app.use("/", vistasRouter);

const server = app.listen(PORT, () => {
  console.log(`Server on line en puerto ${PORT}`);
});

let usuarios = [];
let mensajes = []; 



export const io = new Server(server); // Da inicio a socket.io BACKEND

io.on("connection", (socket) => {
  console.log(`se conecto un cliente con id ${socket.id}`);


 //CHAT
 socket.on('id', async nombre=>{ // recibe con on el socket id
  usuarios.push({nombre, id:socket.id})


  

  
  socket.broadcast.emit('nuevoUsuario', nombre) //emite a todos menos al que lo envia
  socket.emit("hello", mensajes)
});

socket.on('mensaje',  async datos=>{
  mensajes.push(datos);
  io.emit('nuevoMensaje', datos)



  let nuevoMensaje = {
    mensaje: datos.mensaje
  }
// para buscar y si existe el usuario  solo agrega el mensaje al array de mensajes
  await messagesModelo.findOneAndUpdate(
    {usuario: datos.emisor},
    {
      $push: { mensajes: nuevoMensaje}
    },
    { upsert: true, new: true },
  
  );


socket.on("disconnect", ()=>{
  let usuario = usuarios.find(u=>u.id === socket.id)
  if (usuario) {
      io.emit("usuarioDesconectado", usuario.nombre)
  }
})


});

})
//MOGOSOOSE genera conexion a la base datos ATLAS

try {
  await mongoose.connect('mongodb+srv://erland:41296348@atlascluster.ocwqyul.mongodb.net/?retryWrites=true&w=majority', {dbName: 'ecommerce'})
  console.log('DB Online......!!!!')
} catch (error) {
  console.log(error.message)
}

