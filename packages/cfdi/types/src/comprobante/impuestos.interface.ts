export interface XmlImpuestos {
  _attributes: XmlImpuestosTrasladados;
  'cfdi:Traslados': XmlTranslado;
  'cfdi:Retenciones': XmlRetenciones;
}

export interface XmlImpuestosTrasladados {
  TotalImpuestosRetenidos?: number | string;
  TotalImpuestosTrasladados?: number | string;
}

export interface XmlTranslado {
  'cfdi:Traslado': XmlTransladoAttributes[];
}

export interface XmlRetenciones {
  'cfdi:Retencion': XmlRetencionAttributes[];
}

export interface XmlTransladoAttributes {
  _attributes: XmlTranRentAttributesProperties;
}

export interface XmlRetencionAttributes {
  _attributes: XmlTranRentAttributesProperties;
}

export interface XmlTranRentAttributesProperties {
  Base?: string | number;
  Impuesto: string | number;
  TipoFactor: string;
  TasaOCuota?: string | number;
  Importe?: string | number;
}
