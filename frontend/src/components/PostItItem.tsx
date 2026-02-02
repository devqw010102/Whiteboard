import React, {useEffect, useState} from 'react';
import { X } from "lucide-react";

interface PostItProps {
    id: number;
    content: string;
    x: number;
    y: number;
    color: string;
    zIndex: number;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
    onDelete: (id: number) => void;
    onUpdateContent: (id:number, content: string) => void;
    onUpdateColor: (id: number, color: string) => void;
    onFocus: (id: number) => void;
}

const colors = ["#fef08a", "#fca5af", "#bfdbfe", "#bbf7d0", "#ddd6fe"];

const PostItItem = ({ id, content, x, y, color, zIndex, onDragStart, onDelete, onUpdateContent, onUpdateColor, onFocus }: PostItProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(content);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        setText(content);
    }, [content])

    const handleBlur = () => {
        setIsEditing(false);
        if (text !== content) {
            onUpdateContent(id, text);
        }
    };

    return (
        <div
            draggable={!isEditing}
            onDragStart={(e) => onDragStart(e, id)}
            onMouseDown={() => onFocus(id)}
            style={{
                left: `${x}px`,
                top: `${y}px`,
                position: 'absolute',
                width: '180px',
                height: '180px',
                backgroundColor: color || '#fef08a',
                padding: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                cursor: isEditing ? 'text' : 'grab',
                display: 'flex',
                flexDirection: 'column',
                zIndex: isEditing ? 9999 : (zIndex || 10),
                boxSizing: 'border-box',
                transition: 'background-color 0.3s ease'
            }}
        >
            {/* 삭제 확인 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: '24px' }}>
                {showConfirm ? (
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', animation: 'fadeIn 0.2s' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#666' }}>삭제?</span>
                        <button
                            onClick={() => onDelete(id)}
                            style={{ cursor: 'pointer', border: '1px solid red', background: 'white', color: 'red', fontSize: '10px', padding: '1px 4px' }}
                        >확인</button>
                        <button
                            onClick={() => setShowConfirm(false)}
                            style={{ cursor: 'pointer', border: '1px solid #ccc', background: 'white', fontSize: '10px', padding: '1px 4px' }}
                        >취소</button>
                    </div>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowConfirm(true);
                        }}
                        style={{ cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '14px', opacity: 0.5 }}
                    >✕</button>
                )}
            </div>

            {/* 내용 영역 */}
            <div
                style={{
                    marginTop: '5px',
                    flex: 1,
                    wordBreak: 'break-all',
                    fontSize: '14px',
                    overflowY: 'auto'
                }}
                onDoubleClick={() => setIsEditing(true)}
            >
                {isEditing ? (
                    <textarea
                        autoFocus
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onBlur={handleBlur}
                        style={{
                            width: '100%', height: '100%', border: 'none', background: 'transparent',
                            resize: 'none', outline: 'none', fontFamily: 'inherit', fontSize: 'inherit'
                        }}
                    />
                ) : (
                    content
                )}
            </div>

            {/* 색상 선택 */}
            {!isEditing && (
                <div style={{ display: 'flex', gap: '6px', marginTop: '8px', justifyContent: 'center' }}>
                    {colors.map(c => (
                        <div
                            key={c}
                            onClick={(e) => {
                                e.stopPropagation();
                                onUpdateColor(id, c);
                            }}
                            style={{
                                width: '12px', height: '12px', backgroundColor: c,
                                borderRadius: '50%', cursor: 'pointer',
                                border: color === c ? '2px solid #333' : '1px solid rgba(0,0,0,0.1)',
                                transition: 'transform 0.1s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostItItem;