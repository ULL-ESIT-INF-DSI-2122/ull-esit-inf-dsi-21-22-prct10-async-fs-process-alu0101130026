import chalk from 'chalk';
import yargs from 'yargs';
import {Color, Note} from "./models/Note";
import {FileManager} from './models/FileManager';

const fm: FileManager = FileManager.instance;

yargs.command({
  command: 'add',
  describe: 'Agregar una nota a un usuario.',
  builder: {
    user: {
      describe: 'Usuario propietario de la nota',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Título de la nota',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Contenido de la nota',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color del titulo de la nota -> yellow - green - red - blue.',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.user === 'string') && (typeof argv.title === 'string') &&
        (typeof argv.body === 'string') && (typeof argv.color === 'string')) {
      let color: Color = Color.white;
      Object.values(Color).forEach((arrColor) => {
        if (arrColor === argv.color) {
          color = arrColor;
        }
      });

      if (fm.addNote(argv.user, new Note(argv.title, color, argv.body)) ===
          undefined) {
        console.log(chalk.red("Ya existe una nota con ese título."));
      } else {
        console.log(chalk.green("Nota añadida con éxito."));
      }
    }
  },
});

yargs.command({
  command: 'list',
  describe: 'Listar las notas del usuario.',
  builder: {
    user: {
      describe: 'Usuario propietario de la nota',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    let array: string[] | undefined = [];
    if (typeof argv.user === 'string') {
      array = fm.getNotesTitle(argv.user);
    }
    if (array == undefined) {
      console.log(chalk.red(`Hubo un error al mostrar los títulos.`));
    } else {
      array.forEach((title) => {
        console.log(title);
      });
    }
  },
});

yargs.command({
  command: 'read',
  describe: 'Lee la nota del usuario.',
  builder: {
    user: {
      describe: 'Usuario propietario de la nota',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Título de la nota.',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) {
      const array: Note[] | undefined = fm.getUserNotes(argv.user);
      if (array == undefined) {
        console.log(chalk.red(`Hubo un error al conseguir las notas.`));
      } else {
        let body: string = "";
        array.forEach((note) => {
          if (note.title === argv.title) {
            switch (note.color) {
              case Color.blue:
                body = chalk.blue(note.body);
                break;
              case Color.red:
                body = chalk.red(note.body);
                break;
              case Color.yellow:
                body = chalk.yellow(note.body);
                break;
              case Color.green:
                body = chalk.green(note.body);
                break;
              case Color.white:
                body = chalk.white(note.body);
                break;
              default:
                body = note.body;
                break;
            }
          }
        });
        if (body === "") {
          console.log(chalk.red(`El usuario ${argv.user} no tiene ninguna` +
              `nota con ese título`));
        } else {
          console.log(body);
        }
      }
    }
  },
});

yargs.command({
  command: 'remove',
  describe: 'Elimina la nota del usuario.',
  builder: {
    user: {
      describe: 'Usuario propietario de la nota.',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Título de la nota.',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.user === 'string') && (typeof argv.title === 'string')) {
      if (fm.removeNote(argv.user, argv.title) === undefined) {
        console.log(chalk.red(`No se encuentra ${argv.title} en ` +
            `${argv.user}.json.`));
      } else {
        console.log(chalk.green(`Nota eliminada con éxito.`));
      }
    }
  },
});

yargs.command({
  command: 'modify',
  describe: 'Modifica una nota del usuario ya existente.',
  builder: {
    user: {
      describe: 'Usuario propietario de la nota',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Título de la nota.',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Contenido de la nota',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Color del titulo de la nota -> yellow - green - red - blue.',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.user === 'string') && (typeof argv.title === 'string') &&
        (typeof argv.body === 'string') && (typeof argv.color === 'string')) {
      let color: Color = Color.white;
      switch (argv.color) {
        case Color.blue:
          color = Color.blue;
          break;
        case Color.red:
          color = Color.red;
          break;
        case Color.yellow:
          color = Color.yellow;
          break;
        case Color.green:
          color = Color.green;
          break;
        case Color.white:
          color = Color.white;
          break;
        default:
          color = Color.white;
          break;
      }
      const newNote = new Note(argv.title, color, argv.body);
      if (fm.editNote(argv.user, argv.title, newNote) === undefined) {
        console.log(chalk.red(`Error editando la nota.`));
      } else {
        console.log(chalk.green(`Nota editada`));
      }
    }
  },
});

yargs.parse();