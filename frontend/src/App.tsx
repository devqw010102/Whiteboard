import React from 'react';
import PostItItem from "./components/PostItItem";
import { usePostIts } from "./hooks/usePostIts";

function App() {
    const { postIts, addPostIt, deletePostIt, updatePostItContent, handleDragStart, handleDrop, boardRef } = usePostIts();

    return (
        <div
            ref={boardRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="relative w-screen h-screen bg-slate-100 overflow-hidden"
            style={{ position: 'relative', width: '100vw', height: '100vh' }}
        >
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 50, display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => addPostIt("새 메모입니다", "#fef08a")} // 노란색 추가
                    style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    + 노란 메모
                </button>
                <button
                    onClick={() => addPostIt("중요한 메모!", "#fca5a5")} // 분홍색 추가
                    style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    + 분홍 메모
                </button>
            </div>
            {postIts.map(note => (
                <PostItItem
                    key={note.id}
                    {...note}
                    onDragStart={handleDragStart}
                    onDelete={deletePostIt}
                    onUpdateContent={updatePostItContent}
                />
            ))}
        </div>
    );
}
export default App;