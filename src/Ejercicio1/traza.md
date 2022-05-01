# Traza de ejecución del programa.


## Enunciado

Realice una traza de ejecución de este programa mostrando, paso a paso, el contenido de la pila de llamadas, el registro de eventos de la API y la cola de manejadores de Node.js, además de lo que se muestra por la consola. Para ello, simule que se llevan a cabo, como mínimo, dos modificaciones del fichero helloworld.txt a lo largo de la ejecución del programa anterior. ¿Qué hace la función access? ¿Para qué sirve el objeto constants?


## Código

```typescript
import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```


## Traza del programa

### Traza inicial:
**Se inician todas las colas vacías.**
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
|  |  |  |  |


### Primer paso:
**Se inicia la función anónima main entrando en la pila.**
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
| `mainAnonymous()` |  |  |  |


### Segundo paso:
**Se cargan las librerías y los argumentos y se introduce a acces en la API.**
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
| `mainAnonymous()` | `access()` |  |  |


### Tercer paso:
**La función main termina y acces sale de la API. Callback entra en la cola de tareas.**
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
|  |  | `callback()` |  |


### Cuarto paso:
**El callback se añade a la pila para ejecutar la función y retornar un valor.** 
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
| `callback()` |  |  |  |
| `console.log(Starting to watch file ${filename})` |  |  |  |


### Quinto paso:
**En el output se retorna el valor calculado por la función**
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
| `callback()` |  |  |  |
|  |  |  | `Starting to watch file ${filename}` |


### Sexto paso:
**Entra la función *watch()* en la pila para ejecutarse.**
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
| `callback()` |  |  |  |
| `watch()` |  |  |  |


### Séptimo paso:
**Tras ejecutarse la función *watch()*, esta llama a *watcher.on()* y se añade a la API.**
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
| `callback()` | `watcher.on()` |  |  |


### Octavo paso:
**Se ejecuta la siguiente función añadiéndola a la pila.**
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
| `callback()` |  |  |  |
| `console.log(File ${filename} is no longer watched)` |  |  |  |


### Noveno paso:
**La función se ejecuta y retorna el valor en el output.**
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
| `callback()` |  |  |  |
|  |  |  | `File ${filename} is no longer watched` |


### Décimo paso:
**La función *watcher.on()* se convierte en el callback y pasa a la cola para ejecutarse.**
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
|  |  | `callback()` |  |


### Onceavo paso:
**Se añade la siguiente función de la cola, *callback()* a la pila, pues la pila está vacía, y se ejecuta.**
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
| `callback()` |  |  |  |


### Doceavo paso:
**Se ejecuta la siguiente función añadiéndola a la pila.**
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
| `callback()` |  |  |  |
| `console.log(File ${filename} has been modified somehow)` |  |  |  |


### Treceavo paso:
**La función ejecutada retorna un valor en el output.**
| **STACK** | **API** | **QUEUE** | **OUTPUT** |
| ---------------- | ---------------- | ---------------- | ---------------- |
|  |  |  | `File ${filename} has been modified somehow` |


Estos pasos se seguirán repitiendo hasta que finalice el programa.