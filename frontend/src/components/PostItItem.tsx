import React from 'react';

interface PostItProps {
    id: number;
    content: string;
    x: number;
    y: number;
    color: string;
    onDragStart: (e: React.DragEvent, id: number) => void;
}

const PostItItem = ({ id, content, x, y, color, onDragStart }: PostItProps) => {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, id)}
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: '150px',
                height: '150px',
                background: color,
                cursor: 'grab',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '4px 4px 10px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                userSelect: 'none',
            }}
        >
            {content}
        </div>
    );
};

export default PostItItem;