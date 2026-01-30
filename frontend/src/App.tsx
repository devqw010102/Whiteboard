import React from 'react';
import PostItItem from './components/PostItItem';
import { usePostIts } from './hooks/usePostIts';

function App() {

    const { postIts, handleDragStart, handleDrop, boardRef } = usePostIts();


    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div
            ref={boardRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                width: '100vw',
                height: '100vh',
                background: '#fafafa',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <h2 style={{ padding: '20px', color: '#333', pointerEvents: 'none' }}>
                내 포스트잇 보드 (드래그 테스트)
            </h2>

            {postIts.map(note => (
                <PostItItem
                    key={note.id}
                    {...note}
                    onDragStart={handleDragStart}
                />
            ))}
        </div>
    );
}

export default App;