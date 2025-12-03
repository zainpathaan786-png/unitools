import { ToolID } from '../types';
import * as XLSX from 'xlsx';

export const DataUtils = {
  /**
   * Main entry point for data conversions
   */
  convert: async (file: File, toolId: ToolID): Promise<{ blob: Blob; extension: string; mime: string }> => {
    const text = await file.text();
    const arrayBuffer = await file.arrayBuffer();

    switch (toolId) {
      case ToolID.CSV_TO_EXCEL: {
        const workbook = XLSX.read(text, { type: 'string' });
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        return {
          blob: new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
          extension: 'xlsx',
          mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
      }

      case ToolID.EXCEL_TO_CSV: {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const csvOutput = XLSX.utils.sheet_to_csv(firstSheet);
        return {
          blob: new Blob([csvOutput], { type: 'text/csv' }),
          extension: 'csv',
          mime: 'text/csv'
        };
      }

      case ToolID.CSV_TO_JSON: {
        const workbook = XLSX.read(text, { type: 'string' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        return {
          blob: new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' }),
          extension: 'json',
          mime: 'application/json'
        };
      }

      case ToolID.JSON_TO_XML: {
        // JSON -> XML
        let jsonData;
        try {
            jsonData = JSON.parse(text);
        } catch (e) {
            throw new Error("Invalid JSON file.");
        }
        const xml = jsonToXml(jsonData);
        return {
            blob: new Blob([xml], { type: 'application/xml' }),
            extension: 'xml',
            mime: 'application/xml'
        };
      }

      case ToolID.XML_TO_JSON: {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const json = xmlToJson(xmlDoc);
        return {
            blob: new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' }),
            extension: 'json',
            mime: 'application/json'
        };
      }

      case ToolID.XML_TO_CSV: {
        // XML -> JSON -> Sheet -> CSV
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const json = xmlToJson(xmlDoc);
        // Flatten if necessary, simplified here assuming array of objects
        const flatData = flattenForSheet(json);
        const ws = XLSX.utils.json_to_sheet(flatData);
        const csv = XLSX.utils.sheet_to_csv(ws);
        return {
            blob: new Blob([csv], { type: 'text/csv' }),
            extension: 'csv',
            mime: 'text/csv'
        };
      }

      case ToolID.XML_TO_EXCEL: {
        // XML -> JSON -> Sheet -> Excel
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const json = xmlToJson(xmlDoc);
        const flatData = flattenForSheet(json);
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(flatData);
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        
        return {
            blob: new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
            extension: 'xlsx',
            mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
      }

      case ToolID.EXCEL_TO_XML: {
        // Excel -> JSON -> XML
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        const xml = jsonToXml({ root: { row: jsonData } });
        return {
            blob: new Blob([xml], { type: 'application/xml' }),
            extension: 'xml',
            mime: 'application/xml'
        };
      }

      case ToolID.CSV_TO_XML: {
         // CSV -> JSON -> XML
         const workbook = XLSX.read(text, { type: 'string' });
         const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
         const jsonData = XLSX.utils.sheet_to_json(firstSheet);
         const xml = jsonToXml({ root: { row: jsonData } });
         return {
             blob: new Blob([xml], { type: 'application/xml' }),
             extension: 'xml',
             mime: 'application/xml'
         };
      }

      default:
        throw new Error("Conversion not supported");
    }
  }
};

// Helper: Simple XML to JSON converter
function xmlToJson(xml: any): any {
  // Create the return object
  let obj: any = {};

  if (xml.nodeType === 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        const attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for(let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;
      if (typeof(obj[nodeName]) === "undefined") {
        const val = xmlToJson(item);
        if(val && (typeof val !== 'string' || val.trim() !== "")) // Filter empty text nodes
             obj[nodeName] = val;
      } else {
        if (typeof(obj[nodeName].push) === "undefined") {
          const old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        const val = xmlToJson(item);
        if(val && (typeof val !== 'string' || val.trim() !== ""))
            obj[nodeName].push(val);
      }
    }
  }
  // Clean up if object only has text content
  if(Object.keys(obj).length === 1 && obj['#text']) {
      return obj['#text'];
  }
  return obj;
}

// Helper: Simple JSON to XML converter
function jsonToXml(obj: any): string {
    let xml = '';
    for (const prop in obj) {
        xml += obj[prop] instanceof Array ? '' : '<' + prop + '>';
        if (obj[prop] instanceof Array) {
            for (const array in obj[prop]) {
                xml += '<' + prop + '>';
                xml += jsonToXml(new Object(obj[prop][array]));
                xml += '</' + prop + '>';
            }
        } else if (typeof obj[prop] === 'object') {
            xml += jsonToXml(new Object(obj[prop]));
        } else {
            xml += obj[prop];
        }
        xml += obj[prop] instanceof Array ? '' : '</' + prop + '>';
    }
    return xml.replace(/<\/?[0-9]{1,}>/g, '');
}

// Helper to normalize JSON structure for SheetJS
function flattenForSheet(data: any): any[] {
    if (Array.isArray(data)) return data;
    if (data.root && data.root.row && Array.isArray(data.root.row)) return data.root.row;
    // Fallback: wrap in array
    return [data];
}