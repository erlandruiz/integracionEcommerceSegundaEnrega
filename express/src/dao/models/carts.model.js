import mongoose from "mongoose";

const cartsCollection = "carts";


const cartsEsquema = new mongoose.Schema(
  {
//**************PROFE*********** */
    // products:[
    //   {
    //     productId:{
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref:   'products' // este es igual al nombre del modelo de productos (productos.moldes.js)
    //     },
    //     qty:Number
    //   }
    // ],
//************************* */

    //***********MIOOO************** */
    products: {
      type: Array,
      default: [] // Esto inicializará el array como vacío si no se proporciona ningún valor
    },
    //************************* */




    deleted: {
      type: Boolean,
      default: false,
    }, //para DELETE LOGICO
  },

  {
    timestamps: true, //Deja la marca de tiempo cuando  grabas el dato, FECHA DE  CREACION , FECHA DE MODIFICACION
    //collection: 'BigUsers' para trabajar datos en plural
    strict: true, //sirve para agregar propiedades que no estan definidas dentro el esquema , cuando esta en false se pueden agregar
  }
);

export const cartsModelo = mongoose.model(cartsCollection, cartsEsquema);
