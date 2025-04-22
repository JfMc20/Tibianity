import { connectDB } from '../config/db';
import mongoose from 'mongoose';

/**
 * Script simple para probar la conexión a MongoDB
 */
async function testDBConnection() {
  try {
    // Intentar conectar a la base de datos
    await connectDB();
    
    console.log('\n✅ Conexión a MongoDB exitosa!');
    
    // Obtener información de la conexión
    console.log('\nInformación de la conexión:');
    console.log(`- Servidor: ${mongoose.connection.host}`);
    console.log(`- Puerto: ${mongoose.connection.port}`);
    console.log(`- Base de datos: ${mongoose.connection.name}`);
    console.log(`- Estado: ${mongoose.connection.readyState === 1 ? 'Conectado' : 'No conectado'}`);
    
    // Listar colecciones disponibles
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('\nColecciones disponibles:');
      if (collections.length === 0) {
        console.log('- No hay colecciones todavía');
      } else {
        console.log(`Se encontraron ${collections.length} colecciones:`);
        
        // Mostrar cada colección y sus datos
        for (const collection of collections) {
          console.log(`\n📋 COLECCIÓN: ${collection.name}`);
          
          try {
            // Obtener los documentos de la colección (limitados a 5)
            const documents = await mongoose.connection.db
              .collection(collection.name)
              .find({})
              .limit(5)
              .toArray();
            
            // Mostrar cantidad total de documentos
            const totalCount = await mongoose.connection.db
              .collection(collection.name)
              .countDocuments();
            
            console.log(`   Total de documentos: ${totalCount}`);
            
            if (documents.length === 0) {
              console.log('   No hay documentos en esta colección');
            } else {
              console.log(`   Mostrando ${Math.min(documents.length, 5)} de ${totalCount} documentos:`);
              
              // Mostrar cada documento
              documents.forEach((doc, index) => {
                console.log(`\n   📄 Documento ${index + 1}:`);
                console.log('   ' + JSON.stringify(doc, null, 3).replace(/\n/g, '\n   '));
              });
              
              // Indicar si hay más documentos
              if (totalCount > 5) {
                console.log(`\n   ... y ${totalCount - 5} documentos más`);
              }
            }
          } catch (error) {
            console.error(`   Error al acceder a la colección ${collection.name}:`, error);
          }
        }
      }
    } else {
      console.log('\nNo se puede acceder a las colecciones: la conexión a la base de datos no está completamente establecida');
    }
    
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('\nConexión cerrada correctamente.');
    
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:');
    console.error(error);
  } finally {
    // Asegurar que se termina el proceso
    process.exit(0);
  }
}

// Ejecutar la función de prueba
testDBConnection(); 