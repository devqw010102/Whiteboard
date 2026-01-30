import React, { useState } from 'react';
import { X } from "lucide-react";

interface PostItProps {
    id: number;
    content: string;
    x: number;
    y: number;
    color: string;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
    onDelete: (id: number) => void;
    onUpdateContent: (id:number, content: string) => void;
}

const PostItItem = ({ id, content, x, y, color, onDragStart, onDelete, onUpdateContent }: PostItProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(content);


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
                zIndex: isEditing ? 100 : 10,
                boxSizing: 'border-box'
            }}
        >

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                    style={{
                        cursor: 'pointer',
                        border: '1px solid #ccc',
                        background: 'white',
                        padding: '2px 6px',
                        fontSize: '12px'
                    }}
                >
                    ✕
                </button>
            </div>

            <div
                style={{
                    marginTop: '10px',
                    flex: 1,
                    wordBreak: 'break-all',
                    fontSize: '14px'
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
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            background: 'transparent',
                            resize: 'none',
                            outline: 'none',
                            fontFamily: 'inherit',
                            fontSize: 'inherit'
                        }}
                    />
                ) : (
                    content
                )}
            </div>
        </div>
    );
};

export default PostItItem;