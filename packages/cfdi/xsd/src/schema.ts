import Ajv, { ValidateFunction } from 'ajv';
import { existsSync, readFileSync, writeFileSync } from 'fs';

import { JTDDataType } from 'ajv/dist/types/jtd-schema';
// @ts-ignore
import { Xsd2JsonSchema } from 'xsd2jsonschema';

export default class Schema {
  private static instance: Schema;
  private comprobante = {};
  private catalogos = {};
  private tdCFDI = {};
  private ajv: Ajv;
  private isLoad = false;
  private validate: ValidateFunction;
  private pathSchema = '';
  constructor() {
    this.ajv = new Ajv();
  }

  public static of(): Schema {
    if (!Schema.instance) {
      Schema.instance = new Schema();
    }
    return Schema.instance;
  }
  setConfig(options: any) {
    const { path } = options;
    this.pathSchema = path;
    this.loadFiles();
  }

  getContentFile(file: string) {
    console.log(file);

    const data = JSON.parse(readFileSync(file, 'utf8'));

    return data;
  }
  loadFiles() {
    const cfdi = this.getContentFile(`${this.pathSchema}/cfdi.json`);
    const catalogos = cfdi.catalogos;
    const comprobante = cfdi.comprobante;
    const complementos = cfdi.complementos;
    this.loadData(catalogos);
    this.loadData(comprobante);
    this.loadData(complementos);
  }

  public loadData(schemas: any[]) {
    schemas.forEach((schema) => {
      if (
        !this.ajv.getSchema(schema.key) &&
        schema.key !== 'COMPROBANTE_CONCEPTOS_CONCEPTO_INFORMACIONADUANERA'
      ) {
        this.ajv.addSchema(
          this.getContentFile(
            `${this.pathSchema}/${schema.path}/${schema.name}.json`
          ),
          schema.key
        );
      }
    });
  }

  public getAjv() {
    //this.ajv.compile(this.ajv.getSchema('Comprobante.json')?.schema.valueOf());
    return this.ajv;
  }

  public processSchemasAndValidate(xml: string) {
    console.time('AJV_validate');
    const valid = this.validate(xml);
    console.timeEnd('AJV_validate');

    if (valid) {
      console.log('El objeto es válido según los esquemas.');
    } else {
      console.log(
        'El objeto no cumple con los esquemas. Errores:',
        this.validate.errors
      );
    }

    return {
      errors: this.validate.errors,
      // catalogos,
      //tdCFDI,
      comprobante: this.comprobante,
    };
  }
}