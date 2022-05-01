import chalk from 'chalk';
import {Color, Note} from './Note';


/**
 * Implements a user file.
 * @var fs_ Node.js file system.
 * @var instance_ Single instance of the FileManager.
 * @var folderPath_ Path to the notes folder.
 */
export class FileManager {
  private fs_ = require('fs');
  private static instance_: FileManager;
  private readonly folderPath_: string;


  /**
   * Constructor.
   * Checks if the data folder exists. If not, it creates a new one.
   */
  public constructor() {
    this.folderPath_ = "./data";
    if (!this.fs_.existsSync(this.folderPath_)) {
      this.fs_.mkdirSync(this.folderPath_, {recursive: true});
    }
  }


  /**
   * Returns the single instance of the FileManager.
   * @returns The single instance of the FileManager.
   */
  public static get instance(): FileManager {
    if (!this.instance_) {
      this.instance_ = new FileManager();
    }
    return this.instance_;
  }

  /**
   * Checks if the user allready has a file.
   * @param user User to look for.
   * @returns True if the file is found. False if not.
   */
  private existsUserFile(user: string): boolean {
    if (this.fs_.existsSync(`${this.folderPath_}/${user}.json`)) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * Returns all the notes from the user.
   * @param user User to find the notes.
   * @returns A list with all the notes.
   */
  public getUserNotes(user: string): Note[] | undefined {
    if (!this.existsUserFile(user)) {
      return undefined;
    } else {
      const data: any = JSON.parse(this.fs_.readFileSync(
          `${this.folderPath_}/${user}.json`));
      return data.notes;
    }
  }


  /**
   * Returns all the note titles of an user.
   * @param user User to find the notes titles.
   * @returns A list with all the titles of the notes.
   */
  public getNotesTitle(user: string): string[] | undefined {
    const notesList: string[] = [];
    const userNotes: Note[] | undefined = this.getUserNotes(user);
    if (typeof userNotes === 'undefined') {
      return undefined;
    }
    userNotes.forEach((note: Note) => {
      switch (note.color) {
        case Color.blue:
          notesList.push(chalk.blue(note.title));
          break;
        case Color.red:
          notesList.push(chalk.red(note.title));
          break;
        case Color.yellow:
          notesList.push(chalk.yellow(note.title));
          break;
        case Color.green:
          notesList.push(chalk.green(note.title));
          break;
        case Color.white:
          notesList.push(chalk.white(note.title));
          break;
        default:
          notesList.push(note.title);
          break;
      }
    });
    return notesList;
  }


  /**
   * Adds a note to the user file.
   * @param user User to add the note.
   * @param note Note to be added.
   * @returns Array of end notes if the note is added.
   * Undefined is something goes wrong.
   */
  public addNote(user: string, note: Note): Note[] | undefined {
    const allNotes: Note[] | undefined = this.getUserNotes(user);
    let data: string = `{\n\t"notes": [\n\t\t`;
    if (typeof allNotes === 'undefined') {
      this.fs_.writeFileSync(`${this.folderPath_}/${user}.json`, '');
    } else {
      allNotes.forEach((arrNote) => {
        if (arrNote.title === note.title) {
          return undefined;
        }
        const jsonFormat: string = JSON.stringify(arrNote);
        data += `${jsonFormat},\n\t\t`;
      });
    }
    const jsonFormat: string = JSON.stringify(note);
    data += `${jsonFormat}\n\t]\n}`;
    data = this.noteJsonFormat(data);
    this.fs_.writeFileSync(`${this.folderPath_}/${user}.json`, data);
    return this.getUserNotes(user);
  }


  /**
   * Removes a note from the user file.
   * @param user User to remove from the note.
   * @param note Note to be removed.
   * @returns Array of end notes if the note is removed.
   * Undefined is something goes wrong.
   */
  public removeNote(user: string, note: string): Note[] | undefined {
    const allNotes: Note[] | undefined = this.getUserNotes(user);
    let data: string = `{\n\t"notes": [\n\t\t`;
    if (typeof allNotes === 'undefined') {
      this.fs_.writeFileSync(`${this.folderPath_}/${user}.json`, '');
      return undefined;
    }
    let index: number = -1;
    allNotes.forEach((arrNote) => {
      if (arrNote.title === note) {
        index = allNotes.indexOf(arrNote);
      }
    });
    if (index === -1) {
      return undefined;
    }
    delete allNotes[index];
    allNotes.forEach((arrNote) => {
      const jsonFormat: string = JSON.stringify(arrNote);
      data += `${jsonFormat},\n\t\t`;
    });
    data = data.substring(0, data.length - 4);
    data += `\n\t]\n}`;
    data = this.noteJsonFormat(data);
    this.fs_.writeFileSync(`${this.folderPath_}/${user}.json`, data);
    return this.getUserNotes(user);
  }


  /**
   * Edits a note from the user file.
   * @param user User to edit from the note.
   * @param oldNote Note to be edited.
   * @param editedNote New edited note.
   * @returns Array of end notes if the note is edited.
   * Undefined is something goes wrong.
   */
  public editNote(user: string, oldNote: string, editedNote: Note):
      Note[] | undefined {
    const allNotes: Note[] | undefined = this.getUserNotes(user);
    let data: string = `{\n\t"notes": [\n\t\t`;
    if (typeof allNotes === 'undefined') {
      this.fs_.writeFileSync(`${this.folderPath_}/${user}.json`, '');
      console.log(chalk.red(`Error en el formato del archivo ${user}.json.`));
      return undefined;
    }
    let index: number = -1;
    allNotes.forEach((arrNote) => {
      if (arrNote.title === oldNote) {
        index = allNotes.indexOf(arrNote);
      }
    });
    if (index === -1) {
      return undefined;
    }
    allNotes[index] = editedNote;
    allNotes.forEach((arrNote) => {
      const jsonFormat: string = JSON.stringify(arrNote);
      data += `${jsonFormat},\n\t\t`;
    });
    data = data.substring(0, data.length - 4);
    data += `\n\t]\n}`;
    data = this.noteJsonFormat(data);
    this.fs_.writeFileSync(`${this.folderPath_}/${user}.json`, data);
    return this.getUserNotes(user);
  }


  /**
   * Elimina un usuario de la aplicación.
   * @param user Usuario a eliminar.
   * @returns True si el usuario se elimina con éxito.
   */
  public removeUser(user :string): boolean {
    this.fs_.rmSync(`${this.folderPath_}/${user}.json`);
    return true;
  }


  /**
   * Passes the data to Json format.
   * @param data Data to ve converted.
   * @returns Data in Json format.
   */
  private noteJsonFormat(data: string): string {
    let aux: string = data;
    aux = aux.replace(/,/g, ",\n\t\t\t");
    aux = aux.replace(/:/g, ": ");
    aux = aux.replace(/{"/g, "{\n\t\t\t\"");
    aux = aux.replace(/"}/g, "\"\n\t\t}");
    aux = aux.replace(/},\n\t\t\t\n/g, "},\n");
    return aux;
  }

  /**
   * Method for check any changes on user´s directory.
   * @param path database path
   */
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
}