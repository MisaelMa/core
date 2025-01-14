import { describe, it, expect, vi } from 'vitest';
import { Impuestos } from '../../src/elements/Impuestos';
import { Schema } from '@cfdi/xsd';
import {
  XmlImpuestosTrasladados,
  XmlTranRentAttributesProperties,
} from '../../src/types';

describe('Impuestos', () => {
  it('debería crear una instancia de Impuestos con los atributos dados', () => {
    const validateSpy = vi.spyOn(Schema.of().cfdi.impuestos, 'validate');

    const totalImpuestos: XmlImpuestosTrasladados = {
      TotalImpuestosTrasladados: '100.1024',
    };
    const impuestos = new Impuestos(totalImpuestos);
   
    expect(validateSpy).toHaveBeenCalledWith({
      TotalImpuestosTrasladados: '100.1024',
    });

    validateSpy.mockRestore();

    expect(impuestos.getTotalImpuestos()).toEqual({
      TotalImpuestosTrasladados: '100.1024',
    });
  });

  it('debería agregar un traslado', () => {
    const totalImpuestos: XmlImpuestosTrasladados = {
      TotalImpuestosTrasladados: '100.00',
    };
    const impuestos = new Impuestos(totalImpuestos);
    const trasladoPayload: XmlTranRentAttributesProperties & {
      Base: string | number;
    } = {
      Base: '1000',
      Impuesto: '002',
      TipoFactor: 'Tasa',
      TasaOCuota: '0.160000',
      Importe: '160.00',
    };

    const validateSpy = vi.spyOn(Schema.of().cfdi.traslado, 'validate');
    impuestos.traslados(trasladoPayload);

    expect(validateSpy).toHaveBeenCalledWith({
      ...trasladoPayload
    });

    validateSpy.mockRestore();

    expect(impuestos.getTraslados()).toEqual([
        {
          _attributes: {
            ...trasladoPayload,
          },
        },
      ]);
  });

  it('debería agregar una retención', () => {
    const totalImpuestos: XmlImpuestosTrasladados = {
      TotalImpuestosTrasladados: '100.00',
    };
    const impuestos = new Impuestos(totalImpuestos);
    const retencionPayload: Omit<
      XmlTranRentAttributesProperties,
      'Base' | 'TipoFactor' | 'TasaOCuota'
    > = {
      Impuesto: '001',
      Importe: '50.00',
    };
    const validateSpy = vi.spyOn(Schema.of().cfdi.retencion, 'validate');

    impuestos.retenciones(retencionPayload);
    expect(validateSpy).toHaveBeenCalledWith({
      ...retencionPayload
    });
    validateSpy.mockRestore();

    expect(impuestos.getRetenciones()).toEqual([
      {
        _attributes: {
          ...retencionPayload
        },
      },
    ]);
  });
});
