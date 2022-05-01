import chalk from 'chalk';
import yargs from 'yargs';
import {LinuxCommands} from './LinuxCommands';

const linuxCommands = new LinuxCommands;


/**
 * Comando para comprobar si es un directorio o un archivo.
 */
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


/**
 * Command to create a new directory.
 */
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


/**
 * Command to list the existing files in a directory.
 */
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

/**
 * Command to show the content of a file.
 */
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


/**
 * Command to remove a file or a directory.
 */
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


/**
 * Command to move a file or directory from one place to another.
 */
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


/**
 * Command to copy a file or directory from one place to another.
 */
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