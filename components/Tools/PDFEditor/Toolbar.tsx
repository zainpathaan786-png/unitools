
import React, { useState, useRef, useEffect } from 'react';
import { EditorToolType } from './types';

interface ToolbarProps {
  currentTool: EditorToolType;
  setTool: (t: EditorToolType) => void;
  selectedObjectType: EditorToolType | null;
  color: string;
  setColor: (c: string) => void;
  strokeWidth: number;
  setStrokeWidth: (w: number) => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  fontFamily: string;
  setFontFamily: (f: string) => void;
  isBold: boolean;
  setBold: (b: boolean) => void;
  isItalic: boolean;
  setItalic: (i: boolean) => void;
  opacity: number;
  setOpacity: (o: number) => void;
  commitOpacity: (o: number) => void;
  selWidth: number | '';
  setSelWidth: (w: number) => void;
  selHeight: number | '';
  setSelHeight: (h: number) => void;
  commitDimensions: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onExport: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenSignature: () => void; // New prop
  onApplyCrop?: () => void; // New prop for applying crop
  onBack?: () => void;
  hasSelected: boolean;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentTool, setTool, selectedObjectType,
  color, setColor,
  strokeWidth, setStrokeWidth,
  fontSize, setFontSize,
  fontFamily, setFontFamily,
  isBold, setBold,
  isItalic, setItalic,
  opacity, setOpacity, commitOpacity,
  selWidth, setSelWidth,
  selHeight, setSelHeight,
  commitDimensions,
  onUndo, onRedo, onDelete, onExport, onImageUpload, onOpenSignature, onApplyCrop, onBack,
  hasSelected,
  canUndo, canRedo, isSaving
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  // Determine which property controls to show based on context
  const isTextRelated = [EditorToolType.TEXT, EditorToolType.EDIT_TEXT, EditorToolType.ERASE_TEXT].includes(currentTool) || selectedObjectType === EditorToolType.TEXT;
  
  const showTextProperties = isTextRelated;
  
  const showShapeProperties = [EditorToolType.RECTANGLE, EditorToolType.CIRCLE, EditorToolType.LINE, EditorToolType.PEN, EditorToolType.HIGHLIGHT].includes(currentTool) || 
                              (selectedObjectType && [EditorToolType.RECTANGLE, EditorToolType.CIRCLE, EditorToolType.LINE, EditorToolType.PEN, EditorToolType.HIGHLIGHT].includes(selectedObjectType));
  
  const showDimensions = hasSelected && selectedObjectType !== EditorToolType.PEN && selectedObjectType !== EditorToolType.TEXT && selectedObjectType !== EditorToolType.CROP;

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      switch (val) {
          case 'h1': setFontFamily('Helvetica'); setFontSize(32); setBold(true); break;
          case 'h2': setFontFamily('Helvetica'); setFontSize(24); setBold(true); break;
          case 'h3': setFontFamily('Helvetica'); setFontSize(18); setBold(true); break;
          case 'h4': setFontFamily('Helvetica'); setFontSize(16); setBold(true); break;
          case 'subtitle': setFontFamily('Helvetica'); setFontSize(14); setBold(false); setItalic(true); break;
          case 'mono': setFontFamily('Courier New'); setFontSize(12); setBold(false); setItalic(false); break;
          case 'small': setFontFamily('Helvetica'); setFontSize(10); setBold(false); setItalic(false); break;
          case 'p': default: setFontFamily('Helvetica'); setFontSize(12); setBold(false); setItalic(false); break;
      }
  };

  const ToolButton = ({ tool, icon, label }: { tool: EditorToolType, icon: React.ReactNode, label: string }) => (
      <button
          onClick={() => setTool(tool)}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 w-16 h-16 group ${
              currentTool === tool 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-inner' 
              : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400'
          }`}
          title={label}
      >
          <div className="mb-1">{icon}</div>
          <span className="text-[10px] font-medium">{label}</span>
      </button>
  );

  const ActionButton = ({ onClick, icon, label, disabled = false, danger = false }: { onClick: () => void, icon: React.ReactNode, label: string, disabled?: boolean, danger?: boolean }) => (
      <button
          onClick={onClick}
          disabled={disabled}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 w-16 h-16 ${
              disabled ? 'opacity-40 cursor-not-allowed' : 
              danger ? 'hover:bg-red-50 text-red-500 dark:text-red-400 dark:hover:bg-red-900/20' : 
              'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400'
          }`}
          title={label}
      >
          <div className="mb-1">{icon}</div>
          <span className="text-[10px] font-medium">{label}</span>
      </button>
  );

  const Divider = () => <div className="w-px h-10 bg-gray-200 dark:bg-slate-700 mx-2 self-center hidden md:block"></div>;

  return (
    <div className="flex flex-col shadow-sm z-40 relative">
        {/* PRIMARY TOOLBAR (Top) */}
        <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-2 flex flex-wrap items-center justify-between gap-y-2">
            
            <div className="flex items-center gap-1 flex-wrap">
                {/* File Actions */}
                {onBack && (
                    <ActionButton 
                        onClick={onBack}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>}
                        label="Exit"
                    />
                )}
                
                <ActionButton 
                    onClick={onUndo} disabled={!canUndo}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>}
                    label="Undo"
                />
                <ActionButton 
                    onClick={onRedo} disabled={!canRedo}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>}
                    label="Redo"
                />

                <Divider />

                {/* Main Tools */}
                <ToolButton 
                    tool={EditorToolType.SELECT}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>}
                    label="Select"
                />

                {/* Text Group */}
                <div className="relative group">
                    <button
                        onClick={() => setTool(EditorToolType.TEXT)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 w-16 h-16 group ${
                            [EditorToolType.TEXT, EditorToolType.EDIT_TEXT, EditorToolType.ERASE_TEXT].includes(currentTool)
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-inner' 
                            : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400'
                        }`}
                        title="Text Tools"
                    >
                        <div className="mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <span className="text-[10px] font-medium">Text</span>
                    </button>
                    {/* Text Dropdown */}
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl p-2 hidden group-hover:flex flex-col min-w-[160px] z-50 animate-fadeIn">
                        <button onClick={() => setTool(EditorToolType.TEXT)} className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-sm text-left text-gray-700 dark:text-gray-300 w-full">
                            <span className="p-1 bg-blue-50 dark:bg-blue-900/30 rounded text-blue-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></span>
                            Add Text
                        </button>
                        <button onClick={() => setTool(EditorToolType.EDIT_TEXT)} className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-sm text-left text-gray-700 dark:text-gray-300 w-full">
                            <span className="p-1 bg-orange-50 dark:bg-orange-900/30 rounded text-orange-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></span>
                            Edit Text
                        </button>
                        <button onClick={() => setTool(EditorToolType.ERASE_TEXT)} className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-sm text-left text-gray-700 dark:text-gray-300 w-full">
                            <span className="p-1 bg-red-50 dark:bg-red-900/30 rounded text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></span>
                            Remove Text
                        </button>
                    </div>
                </div>

                <ToolButton 
                    tool={EditorToolType.PEN}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
                    label="Draw"
                />
                
                <ToolButton 
                    tool={EditorToolType.HIGHLIGHT}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>}
                    label="Highlight"
                />
                
                <div className="relative group">
                    <ToolButton 
                        tool={EditorToolType.RECTANGLE}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>}
                        label="Shapes"
                    />
                    {/* Shapes Dropdown on Hover */}
                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl p-2 hidden group-hover:flex flex-col min-w-[140px] z-50 animate-fadeIn">
                        <button onClick={() => setTool(EditorToolType.RECTANGLE)} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-sm text-left text-gray-700 dark:text-gray-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> Rectangle
                        </button>
                        <button onClick={() => setTool(EditorToolType.CIRCLE)} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-sm text-left text-gray-700 dark:text-gray-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg> Circle
                        </button>
                        <button onClick={() => setTool(EditorToolType.LINE)} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-sm text-left text-gray-700 dark:text-gray-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="4" y1="20" x2="20" y2="4"/></svg> Line
                        </button>
                        <button onClick={() => setTool(EditorToolType.CHECK)} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-sm text-left text-gray-700 dark:text-gray-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> Check
                        </button>
                        <button onClick={() => setTool(EditorToolType.CROSS)} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-sm text-left text-gray-700 dark:text-gray-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg> Cross
                        </button>
                    </div>
                </div>

                <ActionButton 
                    onClick={onOpenSignature}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>}
                    label="Sign"
                />

                <ActionButton 
                    onClick={() => imageInputRef.current?.click()}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    label="Image"
                />
                
                <ToolButton 
                    tool={EditorToolType.CROP}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.25 2.25V5.25H2.25v12h3V20.25h3v-3h9v-9h3V5.25h-3V2.25h-3zm-3 12H5.25v-9h9v9z" /></svg>}
                    label="Crop"
                />

                <input type="file" ref={imageInputRef} className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={onImageUpload} />
            </div>

            {/* Right Side: Save/Delete */}
            <div className="flex items-center gap-2">
                {currentTool === EditorToolType.CROP && hasSelected && onApplyCrop && (
                    <button 
                        onClick={onApplyCrop} 
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 text-sm flex items-center gap-1 shadow-md mr-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Apply Crop
                    </button>
                )}
                
                {hasSelected && currentTool !== EditorToolType.CROP && (
                    <ActionButton 
                        onClick={onDelete} 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                        label="Delete"
                        danger
                    />
                )}
                <button 
                    onClick={onExport}
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-md transition-transform hover:scale-105 ml-2 text-sm whitespace-nowrap"
                >
                    {isSaving ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    )}
                    <span>Save PDF</span>
                </button>
            </div>
        </div>

        {/* SECONDARY CONTEXT BAR (Bottom) */}
        {(showTextProperties || showShapeProperties || showDimensions) && (
            <div className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-4 py-2 flex items-center gap-4 h-14 overflow-x-auto scrollbar-hide">
                
                {/* Color Picker */}
                <div className="flex items-center gap-2 border-r border-gray-200 dark:border-slate-700 pr-4 flex-shrink-0">
                    <div className="relative w-8 h-8 rounded-full border border-gray-300 overflow-hidden cursor-pointer shadow-sm">
                        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="absolute inset-0 w-[150%] h-[150%] -top-1 -left-1 cursor-pointer" />
                    </div>
                    {/* Preset Colors */}
                    <div className="flex gap-1">
                        {['#000000', '#ef4444', '#3b82f6', '#22c55e', '#eab308'].map(c => (
                            <button 
                                key={c} 
                                onClick={() => setColor(c)} 
                                className={`w-5 h-5 rounded-full border border-gray-200 ${color === c ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                {/* Text Properties */}
                {showTextProperties && (
                    <div className="flex items-center gap-3 border-r border-gray-200 dark:border-slate-700 pr-4 flex-shrink-0">
                        {/* Restored Text Preset Dropdown */}
                        <select 
                            onChange={handlePresetChange}
                            className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-sm rounded p-1 w-28"
                            defaultValue="p"
                        >
                            <option value="p">Paragraph</option>
                            <option value="h1">Heading 1</option>
                            <option value="h2">Heading 2</option>
                            <option value="h3">Heading 3</option>
                            <option value="subtitle">Subtitle</option>
                            <option value="mono">Monospace</option>
                            <option value="small">Small Text</option>
                        </select>

                        <select 
                            value={fontFamily} 
                            onChange={(e) => setFontFamily(e.target.value)}
                            className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-sm rounded p-1 w-32"
                        >
                            <optgroup label="Sans Serif">
                                <option value="Helvetica">Helvetica</option>
                                <option value="Arial">Arial</option>
                                <option value="Verdana">Verdana</option>
                            </optgroup>
                            <optgroup label="Serif">
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Georgia">Georgia</option>
                            </optgroup>
                            <optgroup label="Monospace">
                                <option value="Courier">Courier</option>
                            </optgroup>
                            <optgroup label="Script">
                                <option value="Comic Sans MS">Comic Sans</option>
                            </optgroup>
                        </select>

                        <div className="flex items-center gap-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded p-0.5">
                            <button onClick={() => setFontSize(Math.max(8, fontSize - 2))} className="px-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600">-</button>
                            <span className="text-sm w-6 text-center">{fontSize}</span>
                            <button onClick={() => setFontSize(Math.min(96, fontSize + 2))} className="px-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600">+</button>
                        </div>

                        <div className="flex gap-1">
                            <button onClick={() => setBold(!isBold)} className={`p-1.5 rounded text-xs font-bold ${isBold ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>B</button>
                            <button onClick={() => setItalic(!isItalic)} className={`p-1.5 rounded text-xs italic ${isItalic ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>I</button>
                        </div>
                    </div>
                )}

                {/* Shape/Line Properties */}
                {showShapeProperties && (
                    <div className="flex items-center gap-4 border-r border-gray-200 dark:border-slate-700 pr-4 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">Stroke</span>
                            <input type="range" min="1" max="20" value={strokeWidth} onChange={(e) => setStrokeWidth(parseInt(e.target.value))} className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                            <span className="text-xs w-4">{strokeWidth}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">Opacity</span>
                            <input 
                                type="range" min="0.1" max="1" step="0.1" 
                                value={opacity} 
                                onChange={(e) => setOpacity(parseFloat(e.target.value))} 
                                onMouseUp={(e) => commitOpacity(parseFloat((e.target as HTMLInputElement).value))}
                                className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                            />
                        </div>
                    </div>
                )}

                {/* Dimensions */}
                {showDimensions && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 uppercase font-bold">W</span>
                            <input type="number" value={selWidth} onChange={(e) => setSelWidth(parseFloat(e.target.value))} onBlur={commitDimensions} className="w-14 p-1 text-xs border border-gray-300 rounded text-center font-mono" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 uppercase font-bold">H</span>
                            <input type="number" value={selHeight} onChange={(e) => setSelHeight(parseFloat(e.target.value))} onBlur={commitDimensions} className="w-14 p-1 text-xs border border-gray-300 rounded text-center font-mono" />
                        </div>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};
