
export enum EditorToolType {
  SELECT = 'SELECT',
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
  LINE = 'LINE',
  ARROW = 'ARROW',
  TEXT = 'TEXT',
  EDIT_TEXT = 'EDIT_TEXT', // Covers original text with whiteout and adds new text
  ERASE_TEXT = 'ERASE_TEXT', // Just whiteout
  PEN = 'PEN',
  IMAGE = 'IMAGE',
  HIGHLIGHT = 'HIGHLIGHT',
  CHECK = 'CHECK',
  CROSS = 'CROSS',
  DOT = 'DOT',
  CROP = 'CROP'
}

export interface BaseAnnotation {
  id: string;
  type: EditorToolType;
  page: number; // 1-based index
  x: number;
  y: number;
  color: string;
  strokeWidth: number;
  opacity?: number;
}

export interface ShapeAnnotation extends BaseAnnotation {
  width: number;
  height: number;
  fill?: string;
}

export interface LineAnnotation extends BaseAnnotation {
  x2: number;
  y2: number;
}

export interface TextAnnotation extends BaseAnnotation {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string | number;
  fontStyle: string;
  backgroundColor?: string; // New field for background fill (whiteout)
  padding?: number;
}

export interface DrawingAnnotation extends BaseAnnotation {
  points: number[]; // flattened [x1, y1, x2, y2...]
}

export interface ImageAnnotation extends BaseAnnotation {
  width: number;
  height: number;
  data: string; // base64
  mimeType: 'image/png' | 'image/jpeg';
}

export type Annotation = ShapeAnnotation | LineAnnotation | TextAnnotation | DrawingAnnotation | ImageAnnotation;

export interface PageConfig {
  id: string;
  sourcePage: number; // 0 if blank
  rotation: number;
}
