import React, { useState, useRef } from 'react';

const GRID_SIZE = 3;
const DOT_SPACING = 100; // 100px between dots
const CONTAINER_SIZE = 300;

export default function PatternLock({ onSuccess, onError }) {
    const [path, setPath] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPos, setCurrentPos] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, error, success
    const containerRef = useRef(null);

    // Generate 9 points {x, y}
    const points = [];
    for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;
        points.push({
            x: col * DOT_SPACING + DOT_SPACING / 2,
            y: row * DOT_SPACING + DOT_SPACING / 2,
        });
    }

    const getRelativeCoords = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        // Handle touch and mouse events
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const getTouchedDot = (coords) => {
        // Find closest point within a radius of 35px
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const dist = Math.hypot(p.x - coords.x, p.y - coords.y);
            if (dist < 35) {
                return i;
            }
        }
        return null;
    };

    const handlePointerDown = (e) => {
        if (e.cancelable) e.preventDefault(); // Prevent scrolling on touch
        setStatus('idle');
        const coords = getRelativeCoords(e);
        const dot = getTouchedDot(coords);
        if (dot !== null) {
            setIsDrawing(true);
            setPath([dot]);
            setCurrentPos(coords);
        }
    };

    const handlePointerMove = (e) => {
        if (!isDrawing) return;
        if (e.cancelable) e.preventDefault();
        
        const coords = getRelativeCoords(e);
        setCurrentPos(coords);
        
        const dot = getTouchedDot(coords);
        if (dot !== null && !path.includes(dot)) {
            // Check for skipped middle dot (e.g., 0 to 2 skips 1)
            const lastDot = path[path.length - 1];
            // Simple logic: if row is same and dist is 2, middle is 1. We won't strictly enforce intermediate selection for a sleek N-pattern,
            // but normally we'd fill it in. For simplicity, we just add the touched dot.
            setPath((prev) => [...prev, dot]);
        }
    };

    const handlePointerUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        setCurrentPos(null);
        
        // Validate pattern N: [6, 0, 8, 2]
        const expected = [6, 0, 8, 2];
        const isCorrect = path.length === expected.length && path.every((val, index) => val === expected[index]);
        
        if (isCorrect) {
            setStatus('success');
            onSuccess();
        } else {
            setStatus('error');
            onError('Incorrect pattern');
            setTimeout(() => {
                setPath([]);
                setStatus('idle');
            }, 1000);
        }
    };

    // Determine color based on status
    const getStrokeColor = () => {
        if (status === 'success') return '#10b981'; // green
        if (status === 'error') return '#ef4444'; // red
        return '#4f46e5'; // primary blue
    };

    return (
        <div 
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}
        >
            <div 
                ref={containerRef}
                style={{
                    position: 'relative',
                    width: `${CONTAINER_SIZE}px`,
                    height: `${CONTAINER_SIZE}px`,
                    touchAction: 'none', // Critical for mobile dragging
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                // Fallbacks for Safari Touch
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
            >
                <svg 
                    width={CONTAINER_SIZE} 
                    height={CONTAINER_SIZE} 
                    style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                >
                    {/* Draw connected lines */}
                    {path.length > 0 && (
                        <path
                            d={`M ${points[path[0]].x} ${points[path[0]].y} ` + 
                               path.slice(1).map(dot => `L ${points[dot].x} ${points[dot].y}`).join(' ') +
                               (currentPos && isDrawing ? ` L ${currentPos.x} ${currentPos.y}` : '')
                            }
                            fill="none"
                            stroke={getStrokeColor()}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ filter: `drop-shadow(0 0 4px ${getStrokeColor()})` }}
                        />
                    )}
                    
                    {/* Draw dots */}
                    {points.map((p, i) => {
                        const isSelected = path.includes(i);
                        return (
                            <circle
                                key={i}
                                cx={p.x}
                                cy={p.y}
                                r={isSelected ? 12 : 8}
                                fill={isSelected ? getStrokeColor() : '#9ca3af'}
                                style={{ transition: 'all 0.2s ease' }}
                            />
                        );
                    })}
                </svg>
            </div>
            <p style={{ marginTop: '1rem', color: status === 'error' ? '#ef4444' : '#6b7280', height: '20px' }}>
                {status === 'error' ? 'Incorrect Pattern. Try again.' : 'Draw the "N" pattern to unlock'}
            </p>
        </div>
    );
}
