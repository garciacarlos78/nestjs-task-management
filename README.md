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