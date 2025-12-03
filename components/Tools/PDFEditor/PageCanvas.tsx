
import React, { useRef, useEffect, useState } from 'react';
import { Annotation, EditorToolType } from './types';

interface PageCanvasProps {
  pageNumber: number; // View Index (1-based)
  originalPageNumber: number | null; // Source PDF Index (1-based), null if blank page
  pdfDoc: any;
  scale: number;
  rotation: number;
  annotations: Annotation[];
  currentTool: EditorToolType;
  onAddAnnotation: (ann: Annotation) => void;
  onUpdateAnnotation: (ann: Annotation) => void;
  onCommitAnnotation?: (ann: Annotation) => void;
  color: string;
  strokeWidth: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string | number;
  fontStyle: string;
  opacity: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export const PageCanvas: React.FC<PageCanvasProps> = ({
  pageNumber,
  originalPageNumber,
  pdfDoc,
  scale,
  rotation,
  annotations,
  currentTool,
  onAddAnnotation,
  onUpdateAnnotation,
  onCommitAnnotation,
  color,
  strokeWidth,
  fontSize,
  fontFamily,
  fontWeight,
  fontStyle,
  opacity,
  selectedId,
  onSelect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<any>(null);
  
  // Interaction State
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number } | null>(null);
  const [currentDrawing, setCurrentDrawing] = useState<number[]>([]); 
  const [tempShape, setTempShape] = useState<any>(null); 
  const [dragOffset, setDragOffset] = useState<{x: number, y: number} | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  // Render PDF Page
  useEffect(() => {
    let isActive = true;
    const renderPage = async () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (!canvas || !context) return;

      // Handle Blank Page
      if (originalPageNumber === null) {
          // Default A4 size at 72DPI is approx 595x842. Scale applies.
          const w = 595.28 * scale;
          const h = 841.89 * scale;
          
          if (canvas.width !== w || canvas.height !== h) {
              canvas.width = w;
              canvas.height = h;
          }
          
          context.fillStyle = 'white';
          context.fillRect(0, 0, w, h);
          setViewport({ width: w, height: h });
          return;
      }

      // Handle Original PDF Page
      if (!pdfDoc) return;
      
      try {
        const page = await pdfDoc.getPage(originalPageNumber);
        const vp = page.getViewport({ scale, rotation: (page.rotate + rotation) % 360 });
        if (isActive) setViewport(vp);

        if (canvas.width !== vp.width || canvas.height !== vp.height) {
            canvas.height = vp.height;
            canvas.width = vp.width;
        }

        await page.render({ canvasContext: context, viewport: vp }).promise;
      } catch (e) {
        console.error("Error rendering page", e);
      }
    };
    renderPage();
    return () => { isActive = false; };
  }, [pdfDoc, originalPageNumber, scale, rotation]);

  // Helper: Get Mouse Coords relative to Overlay
  const getCoords = (e: React.MouseEvent) => {
    if (!overlayRef.current) return { x: 0, y: 0 };
    const rect = overlayRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // --- Mouse Handlers ---

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getCoords(e);
    setDragStart({ x, y });

    // 1. Check for Tool Action
    if (currentTool === EditorToolType.SELECT) {
        // If clicking background, deselect (unless clicking an annotation, handled by annotation onClick/MouseDown)
        if (e.target === overlayRef.current || (e.target as HTMLElement).tagName === 'svg') {
            onSelect(null);
        }
    } else {
        // Handle Stamps (Immediate Creation)
        if (currentTool === EditorToolType.CHECK || currentTool === EditorToolType.CROSS || currentTool === EditorToolType.DOT) {
            const id = crypto.randomUUID();
            const size = 24;
            // Center the stamp on cursor
            const ann: any = {
                id, type: currentTool, page: pageNumber, 
                x: x - size/2, y: y - size/2, 
                width: size, height: size, 
                color: currentTool === EditorToolType.CHECK ? '#22c55e' : currentTool === EditorToolType.CROSS ? '#ef4444' : color, 
                strokeWidth: 2,
                opacity
            };
            onAddAnnotation(ann);
            onSelect(id);
            return;
        }

        // Start Drawing / Creating
        setIsDrawing(true);
        
        if (currentTool === EditorToolType.PEN) {
            setCurrentDrawing([x, y]);
        } else if (currentTool === EditorToolType.TEXT) {
            const id = crypto.randomUUID();
            onAddAnnotation({
                id, type: EditorToolType.TEXT, page: pageNumber, x, y,
                text: 'Double click to edit', fontSize, color, strokeWidth: 0, 
                fontFamily, fontWeight, fontStyle, opacity
            });
            onSelect(id);
            setIsDrawing(false);
        } else {
            // Shapes (Rect, Circle, Highlight, Whiteout, Edit Text Box, Crop Box)
            const id = crypto.randomUUID();
            let baseShape: any = {
                id, page: pageNumber, x, y, width: 0, height: 0, color, strokeWidth, opacity
            };
            
            if (currentTool === EditorToolType.ERASE_TEXT) {
                // Whiteout Box
                baseShape = { ...baseShape, type: EditorToolType.RECTANGLE, fill: '#ffffff', color: '#ffffff', strokeWidth: 0, opacity: 1 };
            } else if (currentTool === EditorToolType.EDIT_TEXT) {
                // Edit Text Box - Visualized as a rect while drawing, converted to TextAnn with background on mouse up
                baseShape = { ...baseShape, type: EditorToolType.RECTANGLE, fill: '#ffffff', color: '#000000', strokeWidth: 1, opacity: 0.5 };
            } else if (currentTool === EditorToolType.HIGHLIGHT) {
                // Highlighting logic: Use current selected color as fill
                baseShape = { ...baseShape, type: EditorToolType.HIGHLIGHT, fill: color, color: 'none', strokeWidth: 0, opacity: opacity || 0.4 };
            } else if (currentTool === EditorToolType.CROP) {
                baseShape = { ...baseShape, type: EditorToolType.CROP, fill: 'none', color: '#f97316', strokeWidth: 2, opacity: 1 };
            } else {
                baseShape.type = currentTool;
            }
            
            setTempShape(baseShape);
        }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = getCoords(e);

    if (isResizing && selectedId && resizeHandle) {
        const ann = annotations.find(a => a.id === selectedId);
        if (ann && 'width' in ann) {
            // Basic resizing logic (bottom-right handle assumed for simplicity in this view)
            let newW = x - ann.x;
            let newH = y - ann.y;
            onUpdateAnnotation({ ...ann, width: newW, height: newH });
        }
    } 
    else if (isDragging && selectedId) {
        const ann = annotations.find(a => a.id === selectedId);
        if (ann && dragOffset) {
            let newX = x - dragOffset.x;
            let newY = y - dragOffset.y;
            
            if (ann.type === EditorToolType.LINE || ann.type === EditorToolType.ARROW) {
                const line = ann as any;
                const dx = newX - line.x;
                const dy = newY - line.y;
                onUpdateAnnotation({ ...line, x: newX, y: newY, x2: line.x2 + dx, y2: line.y2 + dy });
            } else {
                onUpdateAnnotation({ ...ann, x: newX, y: newY });
            }
        }
    } 
    else if (isDrawing && dragStart) {
        if (currentTool === EditorToolType.PEN) {
            setCurrentDrawing(prev => [...prev, x, y]);
        } else if (tempShape) {
            const width = x - dragStart.x;
            const height = y - dragStart.y;
            
            if (tempShape.type === EditorToolType.LINE || tempShape.type === EditorToolType.ARROW) {
                setTempShape({ ...tempShape, x2: x, y2: y });
            } else {
                setTempShape({ ...tempShape, width, height });
            }
        }
    }
  };

  const handleMouseUp = () => {
    // Commit logic for history (simplified)
    if (isDragging && selectedId && onCommitAnnotation) {
        const ann = annotations.find(a => a.id === selectedId);
        if (ann) onCommitAnnotation(ann);
    }

    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    
    if (isDrawing) {
        setIsDrawing(false);
        if (currentTool === EditorToolType.PEN && currentDrawing.length > 2) {
            onAddAnnotation({
                id: crypto.randomUUID(), type: EditorToolType.PEN, page: pageNumber, x: 0, y: 0,
                points: currentDrawing, color, strokeWidth, opacity
            });
        } else if (tempShape) {
            let finalShape = { ...tempShape };
            // Normalize negative dimensions
            if (finalShape.width < 0) {
                finalShape.x += finalShape.width;
                finalShape.width = Math.abs(finalShape.width);
            }
            if (finalShape.height < 0) {
                finalShape.y += finalShape.height;
                finalShape.height = Math.abs(finalShape.height);
            }

            // Minimum size check to avoid accidental 0-size objects
            if (finalShape.width > 5 || finalShape.height > 5 || (finalShape.x2 && Math.abs(finalShape.x2 - finalShape.x) > 5)) {
                
                if (currentTool === EditorToolType.EDIT_TEXT) {
                    // Convert the drawn box into a text annotation with background
                    const textId = crypto.randomUUID();
                    onAddAnnotation({
                        id: textId, 
                        type: EditorToolType.TEXT, 
                        page: pageNumber,
                        x: finalShape.x, 
                        y: finalShape.y + (finalShape.height / 2), // Approx center vertical
                        text: 'Edit me', 
                        fontSize, 
                        color: '#000000', 
                        strokeWidth: 0,
                        fontFamily, 
                        fontWeight, 
                        fontStyle, 
                        opacity: 1,
                        backgroundColor: '#ffffff', // Whiteout background
                        padding: 4
                    });
                    onSelect(textId);
                } else if (currentTool === EditorToolType.CROP) {
                    // Force crop to be unique on page (controlled by parent ideally, but also here for UX)
                    onAddAnnotation(finalShape);
                    onSelect(finalShape.id);
                } else {
                    onAddAnnotation(finalShape);
                }
            }
        }
        setCurrentDrawing([]);
        setTempShape(null);
    }
    setDragStart(null);
  };

  // -- Item Interaction Handlers --

  const handleAnnotationMouseDown = (e: React.MouseEvent, id: string) => {
      // Allow selecting items even if tool is CROP to move/resize the crop box
      if (currentTool !== EditorToolType.SELECT && currentTool !== EditorToolType.CROP) return;
      
      e.stopPropagation();
      onSelect(id);
      
      const ann = annotations.find(a => a.id === id);
      if (ann) {
          setIsDragging(true);
          const { x, y } = getCoords(e);
          setDragOffset({ x: x - ann.x, y: y - ann.y });
      }
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
      e.stopPropagation();
      setIsResizing(true);
      setResizeHandle(handle);
      const { x, y } = getCoords(e);
      setDragStart({ x, y });
  };

  // Helper to render temp shape correctly with negative dimensions
  const getNormalizedRect = (shape: any) => {
      if (!shape) return { x: 0, y: 0, width: 0, height: 0 };
      let { x, y, width, height } = shape;
      if (width < 0) { x += width; width = Math.abs(width); }
      if (height < 0) { y += height; height = Math.abs(height); }
      return { x, y, width, height };
  };

  return (
    <div className="relative shadow-lg mb-8 mx-auto bg-white transition-all duration-200 ease-in-out" style={{ width: viewport ? viewport.width : '100%', height: viewport ? viewport.height : 'auto' }}>
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      
      <div 
        ref={overlayRef}
        className="absolute top-0 left-0 w-full h-full select-none"
        style={{ cursor: currentTool === EditorToolType.SELECT ? 'default' : 'crosshair' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
            {annotations.map(ann => {
                if (ann.page !== pageNumber) return null;
                const isSelected = selectedId === ann.id;
                const pointerEvents = (currentTool === EditorToolType.SELECT || (currentTool === EditorToolType.CROP && ann.type === EditorToolType.CROP)) ? 'all' : 'none';
                const op = ann.opacity !== undefined ? ann.opacity : 1;
                
                // RECT / HIGHLIGHT / IMAGE / ERASE_TEXT / CROP
                if (ann.type === EditorToolType.RECTANGLE || ann.type === EditorToolType.HIGHLIGHT || ann.type === EditorToolType.IMAGE || ann.type === EditorToolType.ERASE_TEXT || ann.type === EditorToolType.CROP) {
                    const rectAnn = ann as any;
                    const isCrop = ann.type === EditorToolType.CROP;
                    return (
                        <g key={ann.id} onMouseDown={(e) => handleAnnotationMouseDown(e, ann.id)} style={{ pointerEvents, opacity: op }}>
                            {ann.type === EditorToolType.IMAGE ? (
                                <image href={rectAnn.data} x={rectAnn.x} y={rectAnn.y} width={rectAnn.width} height={rectAnn.height} preserveAspectRatio="none" />
                            ) : (
                                <rect 
                                    x={rectAnn.x} y={rectAnn.y} width={rectAnn.width} height={rectAnn.height} 
                                    fill={rectAnn.fill || 'none'} 
                                    stroke={rectAnn.strokeWidth > 0 ? rectAnn.color : 'none'} 
                                    strokeWidth={rectAnn.strokeWidth}
                                    strokeDasharray={isCrop ? "8 4" : "none"}
                                />
                            )}
                            {/* Visual indicator for Crop */}
                            {isCrop && (
                                <text x={rectAnn.x + 5} y={rectAnn.y + 20} fill={rectAnn.color} fontSize="14" fontWeight="bold">Crop Area</text>
                            )}
                            {isSelected && (
                                <>
                                    <rect x={rectAnn.x - 2} y={rectAnn.y - 2} width={rectAnn.width + 4} height={rectAnn.height + 4} fill="none" stroke={isCrop ? rectAnn.color : "#3b82f6"} strokeWidth="1" strokeDasharray="4" />
                                    <rect x={rectAnn.x + rectAnn.width - 4} y={rectAnn.y + rectAnn.height - 4} width="8" height="8" fill={isCrop ? rectAnn.color : "#3b82f6"} stroke="white" strokeWidth="1" style={{ cursor: 'se-resize', pointerEvents: 'all' }} onMouseDown={(e) => handleResizeStart(e, 'se')} />
                                </>
                            )}
                        </g>
                    );
                }

                // STAMPS (CHECK, CROSS, DOT)
                if (ann.type === EditorToolType.CHECK || ann.type === EditorToolType.CROSS || ann.type === EditorToolType.DOT) {
                    const shapeAnn = ann as any;
                    return (
                        <g key={ann.id} onMouseDown={(e) => handleAnnotationMouseDown(e, ann.id)} style={{ pointerEvents, opacity: op }}>
                            {ann.type === EditorToolType.CHECK ? (
                                <path d={`M${shapeAnn.x + 4} ${shapeAnn.y + shapeAnn.height/2} L${shapeAnn.x + shapeAnn.width/2 - 2} ${shapeAnn.y + shapeAnn.height - 4} L${shapeAnn.x + shapeAnn.width - 4} ${shapeAnn.y + 4}`} fill="none" stroke={shapeAnn.color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                            ) : ann.type === EditorToolType.CROSS ? (
                                <path d={`M${shapeAnn.x + 4} ${shapeAnn.y + 4} L${shapeAnn.x + shapeAnn.width - 4} ${shapeAnn.y + shapeAnn.height - 4} M${shapeAnn.x + 4} ${shapeAnn.y + shapeAnn.height - 4} L${shapeAnn.x + shapeAnn.width - 4} ${shapeAnn.y + 4}`} fill="none" stroke={shapeAnn.color} strokeWidth={3} strokeLinecap="round" />
                            ) : (
                                // DOT
                                <circle cx={shapeAnn.x + shapeAnn.width/2} cy={shapeAnn.y + shapeAnn.height/2} r={shapeAnn.width/2 - 2} fill={shapeAnn.color} />
                            )}
                            {isSelected && (
                                <rect x={shapeAnn.x} y={shapeAnn.y} width={shapeAnn.width} height={shapeAnn.height} fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" />
                            )}
                        </g>
                    );
                }

                // CIRCLE
                if (ann.type === EditorToolType.CIRCLE) {
                    const circAnn = ann as any;
                    return (
                        <g key={ann.id} onMouseDown={(e) => handleAnnotationMouseDown(e, ann.id)} style={{ pointerEvents, opacity: op }}>
                            <ellipse cx={circAnn.x + circAnn.width/2} cy={circAnn.y + circAnn.height/2} rx={circAnn.width/2} ry={circAnn.height/2} fill="none" stroke={circAnn.color} strokeWidth={circAnn.strokeWidth} />
                            {isSelected && (
                                <rect x={circAnn.x} y={circAnn.y} width={circAnn.width} height={circAnn.height} fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" />
                            )}
                        </g>
                    );
                }

                // LINE
                if (ann.type === EditorToolType.LINE) {
                    const lineAnn = ann as any;
                    return (
                        <g key={ann.id} onMouseDown={(e) => handleAnnotationMouseDown(e, ann.id)} style={{ pointerEvents, opacity: op }}>
                            <line x1={lineAnn.x} y1={lineAnn.y} x2={lineAnn.x2} y2={lineAnn.y2} stroke={lineAnn.color} strokeWidth={lineAnn.strokeWidth} />
                            {isSelected && <line x1={lineAnn.x} y1={lineAnn.y} x2={lineAnn.x2} y2={lineAnn.y2} stroke="#3b82f6" strokeWidth="1" strokeDasharray="4" opacity="0.5" />}
                        </g>
                    );
                }

                // PEN
                if (ann.type === EditorToolType.PEN) {
                    const penAnn = ann as any;
                    const pathData = `M ${penAnn.points[0]} ${penAnn.points[1]} ` + penAnn.points.slice(2).reduce((acc: string, val: number, i: number) => {
                        return i % 2 === 0 ? acc + `L ${val} ` : acc + `${val} `;
                    }, "");
                    return (
                        <path
                            key={ann.id} d={pathData} fill="none" stroke={ann.color} strokeWidth={ann.strokeWidth} strokeLinecap="round" strokeLinejoin="round"
                            onMouseDown={(e) => handleAnnotationMouseDown(e, ann.id)} className={isSelected ? "stroke-blue-500" : ""} style={{ pointerEvents, opacity: op }}
                        />
                    );
                }
                return null;
            })}

            {/* Temp Drawing Previews */}
            {isDrawing && currentTool === EditorToolType.PEN && currentDrawing.length > 1 && (
                <path d={`M ${currentDrawing[0]} ${currentDrawing[1]} ` + currentDrawing.slice(2).reduce((acc, val, i) => i % 2 === 0 ? acc + `L ${val} ` : acc + `${val} `, "")} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ opacity }} />
            )}
            {isDrawing && tempShape && (
                (() => {
                    if (tempShape.type === EditorToolType.LINE) {
                        return <line x1={tempShape.x} y1={tempShape.y} x2={tempShape.x2 || tempShape.x} y2={tempShape.y2 || tempShape.y} stroke={color} strokeWidth={strokeWidth} />;
                    }
                    const { x, y, width, height } = getNormalizedRect(tempShape);
                    if (tempShape.type === EditorToolType.CIRCLE) {
                        return <ellipse cx={x + width/2} cy={y + height/2} rx={width/2} ry={height/2} stroke={color} strokeWidth={strokeWidth} fill="none" />;
                    }
                    return <rect x={x} y={y} width={width} height={height} stroke={tempShape.strokeWidth > 0 ? tempShape.color : 'none'} strokeWidth={tempShape.strokeWidth} fill={tempShape.fill || 'none'} style={{ opacity: tempShape.opacity }} strokeDasharray={tempShape.type === EditorToolType.CROP ? "8 4" : "none"} />;
                })()
            )}
        </svg>

        {/* HTML Text Overlay */}
        {annotations.map(ann => {
            if (ann.page !== pageNumber || ann.type !== EditorToolType.TEXT) return null;
            const isSelected = selectedId === ann.id;
            const txtAnn = ann as any;
            const op = ann.opacity !== undefined ? ann.opacity : 1;
            const bgColor = txtAnn.backgroundColor || 'transparent';
            const padding = txtAnn.padding || 2;
            
            return (
                <div key={ann.id} style={{ 
                    position: 'absolute', 
                    left: txtAnn.x, 
                    top: txtAnn.y - (txtAnn.fontSize * 0.7), // Adjust vertical alignment
                    color: txtAnn.color, 
                    fontSize: `${txtAnn.fontSize}px`, 
                    fontFamily: txtAnn.fontFamily || 'Helvetica',
                    fontWeight: txtAnn.fontWeight || 'normal',
                    fontStyle: txtAnn.fontStyle || 'normal',
                    border: isSelected ? '1px dashed #3b82f6' : '1px solid transparent', 
                    backgroundColor: bgColor,
                    cursor: currentTool === EditorToolType.SELECT ? 'move' : 'text', 
                    whiteSpace: 'nowrap', 
                    padding: `${padding}px`, 
                    opacity: op,
                    zIndex: 10,
                    pointerEvents: currentTool === EditorToolType.SELECT ? 'auto' : 'none'
                }} onMouseDown={(e) => handleAnnotationMouseDown(e, ann.id)}>
                    {isSelected && currentTool === EditorToolType.SELECT ? (
                        <input 
                            autoFocus 
                            value={txtAnn.text} 
                            onChange={(e) => onUpdateAnnotation({ ...ann, text: e.target.value })} 
                            onMouseDown={(e) => e.stopPropagation()}
                            style={{ all: 'unset', width: 'auto', minWidth: '20px', backgroundColor: 'transparent', color: txtAnn.color }} 
                        />
                    ) : txtAnn.text}
                </div>
            )
        })}
      </div>
    </div>
  );
};
