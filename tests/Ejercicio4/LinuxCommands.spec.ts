import 'mocha';
import {expect} from 'chai';
import {LinuxCommands} from '../../src/Ejercicio4/LinuxCommands';

const lc = new LinuxCommands();

describe('Funcionamiento básico de la clase LinuxCommands.',
    () => {
      it('La función check funciona correctamente.', () => {
        expect(lc.check('./src')).to.deep.equal("directory");
        expect(lc.check('./src/index.ts')).to.deep.equal("file");
        expect(lc.check('./src/mal.ts')).to.deep.equal(undefined);
      });
      it('La función mkdir funciona correctamente.', () => {
        expect(lc.mkdir('./src')).to.deep.equal(false);
        expect(lc.mkdir('./src/auxDir')).to.deep.equal(true);
      });
      it('La función ls funciona correctamente.', () => {
        expect(lc.ls('./src/mal.ts')).to.deep.equal("No existe la ruta destino.");
        expect(lc.ls('./src/index.ts')).to.deep.equal("No se puede hacer un ls sobre un fichero.");
        expect(lc.ls('./src/auxDir')).to.deep.equal("");
      });
      it('La función cat funciona correctamente.', () => {
        expect(lc.cat('./src/mal.ts')).to.deep.equal("No existe la ruta destino.");
        expect(lc.cat('./src/auxDir')).to.deep.equal("No se puede hacer un cat sobre un directorio.");
        expect(lc.cat('./data/data.csv')).to.deep.equal("");
      });
      it('La función copy funciona correctamente.', () => {
        expect(lc.copy('./src/index.ts', './src/index.ts.aux')).to.deep.equal(true);
        expect(lc.copy('./src/mal', './src/index.mal')).to.deep.equal(false);
      });
      it('La función remove funciona correctamente.', () => {
        expect(lc.remove('./src/auxDir')).to.deep.equal(true);
        expect(lc.remove('./src/auxDir')).to.deep.equal(false);
        expect(lc.remove('./src/index.ts.aux')).to.deep.equal(true);
      });
      it('La función move funciona correctamente.', () => {
        expect(lc.move('./src/index.ts', './src/index.ts.aux')).to.deep.equal(true);
        expect(lc.move('./src/mal', './src/index.mal')).to.deep.equal(false);
        expect(lc.move('./src/index.ts.aux', './src/index.ts')).to.deep.equal(false);
      });
    });