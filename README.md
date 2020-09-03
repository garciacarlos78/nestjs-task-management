# General
Creado para utilizar gestor de paquetes yarn.  
Colección POSTMAN para probar API: Nestjs-tasks-management.postman_collection.json

# Problemas / Diferencias seguimiento curso

## Creación ficheros iniciales
Los ficheros iniciales creados en mi equipo no son exactamente los mismos que los del curso, quizás debido a diferencias de versiones.  
De momento todo va funcionando correctamente.

## UUID
### Problema
La instalación del paquete uuid no funciona correctamente.  
Durante su instalación aparecen errores de paquetes relacionados no compatibles con la plataforma Linux.
### Alternativa
En lugar de utilizar uuid para la generación de un id aleatorio se utiliza *"id-"+Math.random()*.  
No se garantiza que el id sea único, pero para el propósito del curso no debería influir.

## Pipes
### Problema: plataforma Linux incompatible con módulo
info fsevents@2.1.3: The platform "linux" is incompatible with this module.  
info "fsevents@2.1.3" is an optional dependency and failed compatibility check. Excluding it from installation.  
info fsevents@1.2.13: The platform "linux" is incompatible with this module.  
info "fsevents@1.2.13" is an optional dependency and failed compatibility check. Excluding it from installation.  
