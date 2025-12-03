
import React, { useRef, useState, useEffect } from 'react';

interface Props {
    onSave: (dataUrl: string) => void;
    onClose: () => void;
}

export const SignatureModal: React.FC<Props> = ({ onSave, onClose }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawing, setHasDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            // Set actual canvas size to match display size for correct resolution
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#000000';
            }
        }
        
        // Prevent scrolling while drawing on mobile
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const ctx = canvasRef.current?.getContext('2d');
        const { x, y } = getCoords(e);
        ctx?.beginPath();
        ctx?.moveTo(x, y);
        // e.preventDefault(); // allow default to focus but might need prevention for scroll. handled in effect.
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        // e.preventDefault();
        const ctx = canvasRef.current?.getContext('2d');
        const { x, y } = getCoords(e);
        ctx?.lineTo(x, y);
        ctx?.stroke();
        setHasDrawing(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.beginPath(); // Reset path to prevent connecting lines
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setHasDrawing(false);
        }
    };

    const save = () => {
        if (!hasDrawing) return;
        const canvas = canvasRef.current;
        if (canvas) {
            onSave(canvas.toDataURL('image/png'));
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Signature</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl h-64 bg-white touch-none cursor-crosshair mb-6 relative overflow-hidden">
                    <canvas 
                        ref={canvasRef}
                        className="w-full h-full block"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                    {!hasDrawing && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 font-medium">
                            Draw your signature here
                        </div>
                    )}
                </div>
                
                <div className="flex justify-between items-center gap-4">
                    <button 
                        onClick={clear} 
                        className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
                    >
                        Clear
                    </button>
                    <div className="flex gap-3">
                        <button 
                            onClick={onClose} 
                            className="px-5 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={save} 
                            disabled={!hasDrawing}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all transform active:scale-95"
                        >
                            Add Signature
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
