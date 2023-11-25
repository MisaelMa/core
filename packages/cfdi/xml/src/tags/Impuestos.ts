import {
  XmlImpuestos,
  XmlImpuestosTrasladados,
  XmlRetencionAttributes,
  XmlRetenciones,
  XmlTranRentAttributesProperties,
  XmlTranslado,
  XmlTransladoAttributes,
} from '../types';

import { Schema } from '@cfdi/xsd';
import { stringObjToNumerico } from '../utils/number.utils';

/**
 *
 */
export class Impuestos {
  public impuesto: XmlImpuestos = {} as XmlImpuestos;

  private translado: XmlTranslado = {
    'cfdi:Traslado': [],
  } as XmlTranslado;

  private retencion: XmlRetenciones = {
    'cfdi:Retencion': [],
  } as XmlRetenciones;

  /**
   *constructor
   *
   * @param TotalImpuestos
   * XmlImpuestosTrasladados
   */
  constructor(
    TotalImpuestos: XmlImpuestosTrasladados = {} as XmlImpuestosTrasladados
  ) {
    if (Object.keys(TotalImpuestos).length !== 0) {
      const TI = stringObjToNumerico(TotalImpuestos);
      Schema.of().cfdi.impuestos.validate(TI);
      this.impuesto._attributes = TI;
    }
  }

  /**
   *traslados
   *
   * @param traslado
   * XmlTranRentAttributesProperties
   */
  traslados(
    traslado: XmlTranRentAttributesProperties & { Base: string | number }
  ): Impuestos {
    if (!this.impuesto['cfdi:Traslados']) {
      // = traslado;
      this.impuesto['cfdi:Traslados'] = {
        'cfdi:Traslado': [],
      } as XmlTranslado;
    }
    const atrributos: XmlTransladoAttributes = {
      _attributes: traslado,
    } as XmlTransladoAttributes;
    Schema.of().cfdi.traslado.validate(atrributos);
    this.impuesto['cfdi:Traslados']['cfdi:Traslado'].push(atrributos); // = traslado;
    // para tener por separado los traslado del tag de impuesto solo para consulta
    this.translado['cfdi:Traslado'].push(atrributos);
    return this;
  }

  /**
   *retenciones
   *
   * @param retencion
   *  Omit<
      XmlTranRentAttributesProperties,
      'Base' | 'TipoFactor' | 'TasaOCuota'
    >
   */
  retenciones(
    retencion: Omit<
      XmlTranRentAttributesProperties,
      'Base' | 'TipoFactor' | 'TasaOCuota'
    >
  ): Impuestos {
    if (!this.impuesto['cfdi:Retenciones']) {
      this.impuesto['cfdi:Retenciones'] = {
        'cfdi:Retencion': [],
      } as XmlRetenciones;
    }
    const atrributos: XmlRetencionAttributes = {
      _attributes: retencion,
    } as XmlRetencionAttributes;
    this.impuesto['cfdi:Retenciones']['cfdi:Retencion'].push(atrributos); // = traslado;
    // para tener por separado las retenciones del tag de impuesto solo para consulta
    this.retencion['cfdi:Retencion'].push(atrributos);
    return this;
  }
}
