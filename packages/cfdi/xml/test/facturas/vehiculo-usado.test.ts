import { describe, it, expect } from 'vitest';
import {
  CFDI,
  Concepto,
  Emisor,
  Impuestos,
  ObjetoImpEnum,
  Receptor,
} from '../../src';
import path from 'path';
import { VehiculoUsado } from '@cfdi/complementos';

const files = path.resolve(__dirname, '..', '..', '..', '..', 'files');

const key_path = `${files}/certificados/LAN7008173R5.key`;
const cer_path = `${files}/certificados/LAN7008173R5.cer`;
const xslt_path = `${files}/4.0/cadenaoriginal.xslt`;

const expectedXml = `
<?xml version="1.0" encoding="utf-8"?>
<cfdi:Comprobante xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd http://www.sat.gob.mx/vehiculousado http://www.sat.gob.mx/sitio_internet/cfd/vehiculousado/vehiculousado.xsd" Version="4.0" Serie="Serie" Folio="Folio" Fecha="2024-03-01T00:00:00" Sello="AGrVIoICykiW6PO7p+LxtUW3LoEI1lAEBUuPZKz1k7Yz0zU7KiJajYY0lTVSHmARgfkm+af+HADz1E0wFBbDpCBG5U9P0HH0tlAh+v0+FaTHatRrxvUh2AyNsHFOKfgQe8bC2Z+rkE9MngW60yhQsccPihZooIq53b0766ib9uGKZQ+kfH8qf+6oKCF375bFGKNXc7RkoFHKliFJQjJbpISZe1YpuKNCe3LSUA/oUL4ZD9bQp55dSLjh/CfBnloovBIRd5v9g7BVrGE17ITjIDPgondThFiuEM+ZHBTtjJ71WlSjK6pFkizxJvuHHDFr5bkTPFqNhuKMNl26HWkJ6g==" FormaPago="99" NoCertificado="20001000000300022815" Certificado="MIIFxTCCA62gAwIBAgIUMjAwMDEwMDAwMDAzMDAwMjI4MTUwDQYJKoZIhvcNAQELBQAwggFmMSAwHgYDVQQDDBdBLkMuIDIgZGUgcHJ1ZWJhcyg0MDk2KTEvMC0GA1UECgwmU2VydmljaW8gZGUgQWRtaW5pc3RyYWNpw7NuIFRyaWJ1dGFyaWExODA2BgNVBAsML0FkbWluaXN0cmFjacOzbiBkZSBTZWd1cmlkYWQgZGUgbGEgSW5mb3JtYWNpw7NuMSkwJwYJKoZIhvcNAQkBFhphc2lzbmV0QHBydWViYXMuc2F0LmdvYi5teDEmMCQGA1UECQwdQXYuIEhpZGFsZ28gNzcsIENvbC4gR3VlcnJlcm8xDjAMBgNVBBEMBTA2MzAwMQswCQYDVQQGEwJNWDEZMBcGA1UECAwQRGlzdHJpdG8gRmVkZXJhbDESMBAGA1UEBwwJQ295b2Fjw6FuMRUwEwYDVQQtEwxTQVQ5NzA3MDFOTjMxITAfBgkqhkiG9w0BCQIMElJlc3BvbnNhYmxlOiBBQ0RNQTAeFw0xNjEwMjUyMTUyMTFaFw0yMDEwMjUyMTUyMTFaMIGxMRowGAYDVQQDExFDSU5ERU1FWCBTQSBERSBDVjEaMBgGA1UEKRMRQ0lOREVNRVggU0EgREUgQ1YxGjAYBgNVBAoTEUNJTkRFTUVYIFNBIERFIENWMSUwIwYDVQQtExxMQU43MDA4MTczUjUgLyBGVUFCNzcwMTE3QlhBMR4wHAYDVQQFExUgLyBGVUFCNzcwMTE3TURGUk5OMDkxFDASBgNVBAsUC1BydWViYV9DRkRJMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgvvCiCFDFVaYX7xdVRhp/38ULWto/LKDSZy1yrXKpaqFXqERJWF78YHKf3N5GBoXgzwFPuDX+5kvY5wtYNxx/Owu2shNZqFFh6EKsysQMeP5rz6kE1gFYenaPEUP9zj+h0bL3xR5aqoTsqGF24mKBLoiaK44pXBzGzgsxZishVJVM6XbzNJVonEUNbI25DhgWAd86f2aU3BmOH2K1RZx41dtTT56UsszJls4tPFODr/caWuZEuUvLp1M3nj7Dyu88mhD2f+1fA/g7kzcU/1tcpFXF/rIy93APvkU72jwvkrnprzs+SnG81+/F16ahuGsb2EZ88dKHwqxEkwzhMyTbQIDAQABox0wGzAMBgNVHRMBAf8EAjAAMAsGA1UdDwQEAwIGwDANBgkqhkiG9w0BAQsFAAOCAgEAJ/xkL8I+fpilZP+9aO8n93+20XxVomLJjeSL+Ng2ErL2GgatpLuN5JknFBkZAhxVIgMaTS23zzk1RLtRaYvH83lBH5E+M+kEjFGp14Fne1iV2Pm3vL4jeLmzHgY1Kf5HmeVrrp4PU7WQg16VpyHaJ/eonPNiEBUjcyQ1iFfkzJmnSJvDGtfQK2TiEolDJApYv0OWdm4is9Bsfi9j6lI9/T6MNZ+/LM2L/t72Vau4r7m94JDEzaO3A0wHAtQ97fjBfBiO5M8AEISAV7eZidIl3iaJJHkQbBYiiW2gikreUZKPUX0HmlnIqqQcBJhWKRu6Nqk6aZBTETLLpGrvF9OArV1JSsbdw/ZH+P88RAt5em5/gjwwtFlNHyiKG5w+UFpaZOK3gZP0su0sa6dlPeQ9EL4JlFkGqQCgSQ+NOsXqaOavgoP5VLykLwuGnwIUnuhBTVeDbzpgrg9LuF5dYp/zs+Y9ScJqe5VMAagLSYTShNtN8luV7LvxF9pgWwZdcM7lUwqJmUddCiZqdngg3vzTactMToG16gZA4CWnMgbU4E+r541+FNMpgAZNvs2CiW/eApfaaQojsZEAHDsDv4L5n3M1CC7fYjE/d61aSng1LaO6T1mh+dEfPvLzp7zyzz+UgWMhi5Cs4pcXx1eic5r7uxPoBwcCTt3YI1jKVVnV7/w=" CondicionesDePago="CondicionesDePago" SubTotal="2000" Moneda="MXN" TipoCambio="1" Total="2000.16" TipoDeComprobante="I" Exportacion="01" MetodoPago="PUE" LugarExpedicion="20000" xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:vehiculousado="http://www.sat.gob.mx/vehiculousado">
    <cfdi:Emisor Rfc="EKU9003173C9" Nombre="ESCUELA KEMPER URGATE" RegimenFiscal="601"/>
    <cfdi:Receptor Rfc="URE180429TM6" Nombre="UNIVERSIDAD ROBOTICA ESPAÑOLA" DomicilioFiscalReceptor="86991" RegimenFiscalReceptor="601" UsoCFDI="S01"/>
    <cfdi:Conceptos>
        <cfdi:Concepto ClaveProdServ="50211503" Cantidad="1" ClaveUnidad="H87" Unidad="Servicio" Descripcion="Servicio" ValorUnitario="200.00" Importe="200.00" ObjetoImp="02">
            <cfdi:Impuestos>
                <cfdi:Traslados>
                    <cfdi:Traslado Base="1" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="0.16"/>
                </cfdi:Traslados>
            </cfdi:Impuestos>
        </cfdi:Concepto>
    </cfdi:Conceptos>
    <cfdi:Impuestos TotalImpuestosTrasladados="0.16">
        <cfdi:Traslados>
            <cfdi:Traslado Base="1" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="0.16"/>
        </cfdi:Traslados>
    </cfdi:Impuestos>
    <cfdi:Complemento>
        <vehiculousado:VehiculoUsado Version="1.0" montoAdquisicion="10000.00" montoEnajenacion="0.00" claveVehicular="AAAABBB" marca="FORD" tipo="Mustang" modelo="1989" numeroMotor="123123123" numeroSerie="12312323" NIV="1234ASD" valor="5000.00"/>
    </cfdi:Complemento>
</cfdi:Comprobante>`;

describe('general', () => {
  it('debe generar una factura de vehiculo usado con xslt', async () => {
    const cfdi = new CFDI({
      xslt: { path: xslt_path },
      //saxon: { binary: 'java -jar /opt/homebrew/Cellar/saxon/12.5/libexec/saxon-he-12.5.jar '}
    });

    cfdi.comprobante({
      Version: '4.0',
      Serie: 'Serie',
      Folio: 'Folio',
      Fecha: '2024-03-01T00:00:00',
      FormaPago: 99,
      CondicionesDePago: 'CondicionesDePago',
      SubTotal: 2000,
      Moneda: 'MXN',
      TipoCambio: '1',
      Total: 2000.16,
      TipoDeComprobante: 'I',
      Exportacion: '01',
      MetodoPago: 'PUE',
      LugarExpedicion: '20000',
    });

    const emisor = new Emisor({
      Rfc: 'EKU9003173C9',
      Nombre: 'ESCUELA KEMPER URGATE',
      RegimenFiscal: 601,
    });
    const receptor = new Receptor({
      Rfc: 'URE180429TM6',
      Nombre: 'UNIVERSIDAD ROBOTICA ESPAÑOLA',
      DomicilioFiscalReceptor: '86991',
      RegimenFiscalReceptor: 601,
      UsoCFDI: 'S01',
    });

    const concepto = new Concepto({
      ClaveProdServ: '50211503',
      Cantidad: 1,
      ClaveUnidad: 'H87',
      Unidad: 'Servicio',
      Descripcion: 'Servicio',
      ValorUnitario: '200.00',
      Importe: '200.00',
      ObjetoImp: '02',
    });
    concepto.traslado({
      Base: 1,
      Impuesto: '002',
      TipoFactor: 'Tasa',
      TasaOCuota: '0.160000',
      Importe: 0.16,
    });

    const impuestos = new Impuestos({
      TotalImpuestosTrasladados: '0.16',
    });

    impuestos.traslados({
      Base: 1,
      Impuesto: '002',
      TipoFactor: 'Tasa',
      TasaOCuota: '0.160000',
      Importe: 0.16,
    });

    const vehiculoUsado = new VehiculoUsado({
      Version: '1.0',
      montoAdquisicion: '10000.00',
      montoEnajenacion: '0.00',
      claveVehicular: 'AAAABBB',
      marca: 'FORD',
      tipo: 'Mustang',
      modelo: '1989',
      numeroMotor: '123123123',
      numeroSerie: '12312323',
      NIV: '1234ASD',
      valor: '5000.00',
    });

    cfdi.emisor(emisor)
    cfdi.receptor(receptor)
    cfdi.concepto(concepto)
    cfdi.impuesto(impuestos)
    cfdi.complemento(vehiculoUsado)

    cfdi.certificar(cer_path);

    //cfdi.setDebug(true);
    await cfdi.sellar(key_path, '12345678a');
    const jsonToXml = cfdi.getXmlCdfi()
    expect(jsonToXml.trim()).toBe(expectedXml.trim());

  });
});
