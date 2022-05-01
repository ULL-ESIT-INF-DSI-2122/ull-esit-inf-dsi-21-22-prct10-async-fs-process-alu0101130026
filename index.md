### Informe Práctica 10 
## Sistema de ficheros y creación de procesos en Node.js

Para comenzar, en el ejercicio 1 se nos propone un código para ejecutarlo y a continuación responder a una serie de preguntas y desarrollar su traza. Este ejercicio está resuelto y explicado en un archivo .md en el directorio src

Siguiendo con la práctica, para el ejercicio 3 se nos pide que utilicemos la práctica anteriormente desarrollada de notas de texto. El principal cambio es un nuevo programa principal que solo maneja la opción watch y se le pasará un directorio como parámetro y comenzará a analizar dicho directorio en busca de modificaciones. Mostrado cada vez que una suceda.


```
const fm = new FileManager();

yargs.command( {
  command: 'watch',
  describe: 'Observa un fichero y sus cambios',
  builder: {
    route: {
      describe: 'Ruta al directorio',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === "string") {
      fm.watch(argv.route);
    }
  },
});

yargs.parse();
```

El segundo cambio ha sido añadir esta función a la clase FileManager de la Práctica 8. Se ha añadido como una función adicional y se llamará cuando el programa inicie. Esta función iniciará con watch un análisis del directorio y continuará mostrando los cambios hasta que se cierre el programa.

```
public watch(path: string) {
    const existRoute: boolean = this.fs_.existsSync(path);
    const dir: string = path;
    const file = this.fs_.readdirSync(dir);

    if (existRoute == true) {
      console.log(chalk.blue(`Contenido inicial de ${path}: \n` + file + '\n'));

      this.fs_.watch(dir, (event: any, content: string) => {
        console.log(chalk.green('Se han producido cambios en el directorio!:'));
        switch (event) {
          case 'rename':
            const existFile: boolean = this.fs_.existsSync(`${path}/${content}`);
            if (existFile == true) {
              console.log(chalk.green('Se ha añadido el fichero ' + content + '\n'));
            } else {
              console.log(chalk.green('Se ha eliminado el fichero ' + content + '\n'));
            }
            break;
          case 'change':
            console.log(chalk.green('Se ha modificado el fichero ' + content + '\n'));
            break;
        }

        const file = this.fs_.readdirSync(dir);
        console.log(chalk.green(`El contenido del directorio es: \n` + file + '\n'));
      });
    } else {
      console.error(chalk.red(`${path} no existe en el sistema de ficheros!`));
    }
  }
  ```
  
Para mostrar el contenido de un fichero modificado se podría llamar a alguna función que lea este contenido y lo muestre cada vez que se detecte el cambio en el fichero. Actualmente solo se muestra el fichero que se ha modificado, pero añadir elnuevocambio no sería demasiado complejo.

Para mostrar todos los directorios a la vez se podría iniciar un watch en cada uno de los directorios y así analizarlos todos, aunque esto no sería muy eficiente.
  
Si avanzamos hacia el ejercicio número 4, se nos pide desarrollar una aplicación que permita hacer de wrapper de los distintos comandos empleados en Linux. Para este ejercicio también tenemos un programa principal que se encargará de analizar los comandos e invocar a las funciones necesarias para que el programa funcione.

```
const linuxCommands = new LinuxCommands;

yargs.command( {
  command: 'check',
  describe: 'Checks if the passed route is a file or a directory',
  builder: {
    route: {
      describe: 'Route to check',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === "string") {
      const result: string | undefined = linuxCommands.check(argv.route);
      if (typeof result === "undefined") {
        console.log(chalk.red(`Error al evaluar la ruta ${argv.route}`));
      } else {
        console.log(chalk.green(`La ruta corresponde a un ${result}.`));
      }
    }
  },
});

yargs.command( {
  command: 'mkdir',
  describe: 'Creates a new directory',
  builder: {
    route: {
      describe: 'Route to the new directory',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === "string") {
      if (linuxCommands.mkdir(argv.route)) {
        console.log(chalk.green("Directory created."));
      } else {
        console.log(chalk.red("Something went wrong."));
      }
    }
  },
});

yargs.command( {
  command: 'list',
  describe: 'List all the content of a directory',
  builder: {
    route: {
      describe: 'Route to list.',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === "string") {
      console.log(linuxCommands.ls(argv.route));
    }
  },
});

yargs.command( {
  command: 'cat',
  describe: 'Shows the content of a file.',
  builder: {
    route: {
      describe: 'Route to the file',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === "string") {
      console.log(linuxCommands.cat(argv.route));
    }
  },
});

yargs.command( {
  command: 'remove',
  describe: 'Removes the passed file or directory.',
  builder: {
    route: {
      describe: 'Route to the file or directory',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.route === "string") {
      if (typeof argv.route === "string") {
        if (linuxCommands.remove(argv.route)) {
          console.log(chalk.green("Directory removed."));
        } else {
          console.log(chalk.red("Something went wrong."));
        }
      }
    }
  },
});

yargs.command( {
  command: 'move',
  describe: 'Moves an item from one place to another.',
  builder: {
    source: {
      describe: 'Route to the item to move',
      demandOption: true,
      type: 'string',
    },
    destiny: {
      describe: 'Destination rute of the item',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.source === "string" && typeof argv.destiny === "string") {
      if (linuxCommands.move(argv.source, argv.destiny)) {
        console.log(chalk.green("Directory moved."));
      } else {
        console.log(chalk.red("Something went wrong."));
      }
    }
  },
});

yargs.command( {
  command: 'copy',
  describe: 'Copies an item from one place to another.',
  builder: {
    source: {
      describe: 'Route to the item to move',
      demandOption: true,
      type: 'string',
    },
    destiny: {
      describe: 'Destination rute of the item',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.source === "string" && typeof argv.destiny === "string") {
      if (linuxCommands.copy(argv.source, argv.destiny)) {
        console.log(chalk.green("Directory copied."));
      } else {
        console.log(chalk.red("Something went wrong."));
      }
    }
  },
});

yargs.parse();
```
  
Este main analiza cada uno de los posibles comandos y se vale de una clase LinuxComands a la que invocará y esta ejecutará el comando correspondiente. Esta clase contiene una función por cada comando implementado y se llamará a esta función cada vez que se quiera ejecutar dicho comando.

Los comandos posibles son:

  - check: Comprueba si el destino es un directorio o un archivo obteniendo las estadísticas y devolviendo un string con elresultado o undefined si se produce algún error.

```
public check(path: string): string | undefined {
  if (this.fs_.existsSync(path)) {
    if (this.fs_.lstatSync(path).isDirectory()) {
      return "directory";
    } else {
      return "file";
    }
  } else {
    return undefined
  }
}
```

  - mkdir: Crea un nuevo directorio en la ruta especificada. Devuelve un valor true si todo ha ido bien y false si ha ocurrido algún error.

```
public mkdir(path: string): boolean {
  if (this.fs_.existsSync(path)) {
    return false;
  } else {
    this.fs_.mkdirSync(path);
    return true;
  }
}
```

  - ls: Muestra el contenido de un directorio. Para ello primero se aegura que el path es de un directorio y luego invoca a un proceso hijo que llama a ls de linux. Se almacena el resultado del comando en una variable y se devuelve.

```
public ls(path: string): string {
  let result = "";
  switch (this.check(path)) {
    case "directory": {
      const ls = spawn('ls', [path]);
      ls.stdout.on('data', (piece) => result += piece);
      ls.stdout.on('close', () => {
        return result;
      });
      break;
    }
    case "file": {
      result = "No se puede hacer un ls sobre un fichero.";
      break;
    }
    case undefined: {
      result = "No existe la ruta destino.";
      break;
    }
    default: {
      result = "Error inesperado.";
      break;
    }
  }
  return result;
}
```

  - cat: Muy similar al anterior pero en vez de mostrar el contenido de un directorio muestra al de un fichero.

```
public cat(path: string): string {
  let result: string = "";
  switch (this.check(path)) {
    case "file": {
      const cat = spawn('cat', [path]);
      cat.stdout.on('data', (piece) => result += piece);
      cat.stdout.on('close', () => {
        return result;
      });
      break;
    }
    case "directory": {
      result = "No se puede hacer un cat sobre un directorio.";
      break;
    }
    case undefined: {
      result = "No existe la ruta destino.";
      break;
    }
    default: {
      result = "Error inesperado.";
      break;
    }
  }
  return result;
}
```

  - remove: Elimina un directorio o archivo especificado. Primero comprueba cuál de los dos es y luego los elimina. Devuelve true si todo va bien. False si hay algún error.

```
public remove(path: string): boolean {
  switch (this.check(path)) {
    case "file": {
  this.fs_.rmSync(path);
  return true;
    }
    case "directory": {
  this.fs_.rmdirSync(path);
  return true;
    }
    default: {
  return false;
    }
  }
}
```

  - 
    move: Cambia un archivo o directorio de ubicación. Para ello crea un proceso hijo que ejecuta el comando mv con los parámetros correspondientes. Devuelve true si todo va bien. False si hay algún error.

```
public move(source: string, dest: string): boolean {
  if (this.fs_.existsSync(source)) {
    const mv = spawn('mv', [source, dest]);
    mv.on('close', () => {
  return true;
    });
    return true;
  } else {
    return false;
  }
}
```

  - copy: Muy similar a move, pero en vez de cambiar de ubicación, hace una copia del mismo en la nueva ubicación.

```
public copy(source: string, dest: string): boolean {
  if (this.fs_.existsSync(source)) {
    const cp = spawn('cp', [source, dest]);
    cp.on('close', () => {
    return true;
    });
    return true;
  } else {
    return false;
  }
}
```








  
  



