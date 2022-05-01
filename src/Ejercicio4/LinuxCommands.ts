import {spawn} from 'child_process';


/**
 * Implements some linux comands.
 */
export class LinuxCommands {
  private fs_ = require('fs');


  /**
   * Checks if a rout dest is a directory or a file.
   * @param path path to check.
   * @returns A string with the result or undefined if an error occurs.
   */
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

  /**
   * Creates a new directory.
   * @param path Route to the newd irectory.
   * @returns True if the dir is created. False if an error occurs.
   */
  public mkdir(path: string): boolean {
    if (this.fs_.existsSync(path)) {
      return false;
    } else {
      this.fs_.mkdirSync(path);
      return true;
    }
  }


  /**
   * Shows the content of a directory.
   * @param path Route to the directory.
   * @returns String with the result.
   */
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


  /**
   * Shows the content of a file.
   * @param path Route to the file
   */
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


  /**
   * Removes a file or a directory.
   * @param path Route to the item to remove.
   * @returns
   */
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


  /**
   * Moves the file to another location.
   * @param source Origin to move.
   * @param dest Destiny of the move.
   * @returns The result of the operation.
   */
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


  /**
   * Copies the file to another location.
   * @param source Origin to move.
   * @param dest Destiny of the move.
   * @returns The result of the operation.
   */
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
}