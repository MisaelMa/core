import Ajv, { ValidateFunction } from 'ajv';
import { AnySchema, AnyValidateFunction } from 'ajv/dist/types';
import { existsSync, readFileSync, writeFileSync } from 'fs';

import { Comprobante } from './tags/comprobante';
import { JSV } from './JSV';
import { JTDDataType } from 'ajv/dist/types/jtd-schema';
import { Schemakey } from './types/key-schema';
import { ValidateXSD } from './tags/validate';

export default class Schema {
  private static instance: Schema;
  private debug: boolean = false;
  private ajv: JSV = JSV.of();
  private isLoad = false;
  private pathSchema = '';
  private schemaKeys: string[] = [];
  constructor() {}

  public static of(): Schema {
    if (!Schema.instance) {
      Schema.instance = new Schema();
    }
    return Schema.instance;
  }
  setConfig(options: any) {
    const { path, debug } = options;
    this.pathSchema = path;
    this.debug = debug;
    this.loadFiles();
  }

  private getContentFile(file: string) {
    if (!existsSync(file)) {
      return { catalogos: [], comprobante: [], complementos: [] };
    }
    const data = JSON.parse(readFileSync(file, 'utf8'));
    return data;
  }
  private loadFiles() {
    const cfdi = this.getContentFile(`${this.pathSchema}/cfdi.json`);
    const catalogos = cfdi.catalogos;
    const comprobante = cfdi.comprobante;
    const complementos = cfdi.complementos;

    this.loadData(catalogos);
    this.loadData(comprobante);
    this.loadData(complementos);
    this.buildKeys();
  }

  private loadData(schemas: Record<string, any>[]) {
    schemas.forEach((schema) => {
      if (
        !this.ajv.getSchema(schema.key) &&
        schema.key !==
          'COMPROBANTE_CONCEPTOS_CONCEPTO_PARTE_INFORMACIONADUANERA'
      ) {
        this.schemaKeys.push(schema.key);
        this.ajv.addSchema(
          this.getContentFile(
            `${this.pathSchema}/${schema.path}/${schema.name}.json`
          ),
          schema.key
        );
      }
    });
  }

  private getSchema(key: Schemakey): AnyValidateFunction {
    return this.ajv.getSchema(key);
  }

  public get cfdi() {
    return {
      comprobante: Comprobante.of(Schemakey.COMPROBANTE, this.debug),
      informacionGlobal: ValidateXSD.of(
        Schemakey.INFORMACIONGLOBAL,
        this.debug
      ),
      emisor: ValidateXSD.of(Schemakey.EMISOR, this.debug),
      receptor: ValidateXSD.of(Schemakey.RECEPTOR, this.debug),
      relacionado: ValidateXSD.of(
        Schemakey.CFDIRELACIONADOS_CFDIRELACIONADO,
        this.debug
      ),
      relacionados: ValidateXSD.of(Schemakey.CFDIRELACIONADOS, this.debug),
      impuestos: ValidateXSD.of(Schemakey.IMPUESTOS, this.debug),
      traslado: ValidateXSD.of(
        Schemakey.IMPUESTOS_TRASLADOS_TRASLADO,
        this.debug
      ),
      retencion: ValidateXSD.of(
        Schemakey.IMPUESTOS_RETENCIONES_RETENCION,
        this.debug
      ),
      //addenda: ValidateXSD.of(Schemakey.ADDENDA, this.debug),
    };
  }

  public get concepto() {
    return {
      concepto: ValidateXSD.of(Schemakey.CONCEPTO, this.debug),
      parte: ValidateXSD.of(Schemakey.CONCEPTO_PARTE, this.debug),
      /*  parteInformacionAduanera: ValidateXSD.of(
        Schemakey.CONCEPTO_PARTE_INFORMACIONADUANERA,
        this.debug
      ), */
      predial: ValidateXSD.of(Schemakey.CONCEPTO_CUENTAPREDIAL, this.debug),
      terceros: ValidateXSD.of(Schemakey.CONCEPTO_ACUENTATERCEROS, this.debug),
      cuentaPredial: ValidateXSD.of(
        Schemakey.CONCEPTO_CUENTAPREDIAL,
        this.debug
      ),
      informacionAduanera: ValidateXSD.of(
        Schemakey.CONCEPTO_INFORMACIONADUANERA,
        this.debug
      ),
      traslado: ValidateXSD.of(
        Schemakey.CONCEPTO_IMPUESTOS_TRASLADOS_TRASLADO,
        this.debug
      ),
      retencion: ValidateXSD.of(
        Schemakey.CONCEPTO_IMPUESTOS_RETENCIONES_RETENCION,
        this.debug
      ),
    };
  }

  private buildKeys() {
    const text: string[] = [];

    this.schemaKeys.forEach((key) => {
      const line = `${this.nameConst(key)} = '${key}',`;
      text.push(line);
    });
    /* console.log(`
    export enum Schemakey {
      ${text.join('\n')}
    }
    `); */
  }

  private nameConst(text: string) {
    return text
      .replace('COMPROBANTE_', '')
      .replace('CONCEPTOS_', '')
      .replace('CATALOGOS_', '');
  }
}
