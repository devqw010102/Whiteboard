import React, {useState} from 'react';
import PostItItem from "./components/PostItItem";
import { usePostIts } from "./hooks/usePostIts";
import {useCursors} from "./hooks/useCursors";


function App() {

    const [cursors, setCursors] = useState<Record<string, {x: number, y: number, color?: string}>>({});

    const onCursorReceived = (data: any) => {
        setCursors(prev => ({
            ...prev,
            [data.userId]: { x: data.x, y: data.y, color: data.color }
        }));
    };

    const { postIts, stompClient, addPostIt, deletePostIt, updatePostItContent, handleDragStart, handleDrop, boardRef, updatePostItColor, handleBringToFront } = usePostIts(onCursorReceived);
    const { myId, handleMouseMove } = useCursors(stompClient);

    return (
        <div
            ref={boardRef}
            onMouseMove={handleMouseMove}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="relative w-screen h-screen bg-slate-100 overflow-hidden"
            style={{ position: 'relative', width: '100vw', height: '100vh' }}
        >
            {/* 상단 버튼 영역 */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 50, display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => addPostIt("새 메모입니다", "#fef08a")}
                    style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white' }}
                >
                    + 노란 메모
                </button>
                <button
                    onClick={() => addPostIt("중요한 메모!", "#fca5a5")}
                    style={{ padding: '8px 16px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: 'white' }}
                >
                    + 분홍 메모
                </button>
            </div>

            {/* 포스트잇 리스트 */}
            {postIts.map(note => (
                <PostItItem
                    key={note.id}
                    {...note}
                    onDragStart={handleDragStart}
                    onDelete={deletePostIt}
                    onUpdateContent={updatePostItContent}
                    onUpdateColor={updatePostItColor}
                    onFocus={handleBringToFront}
                    zIndex={note.zIndex ?? 10}
                />
            ))}

            {/* 다른 사용자 커서 렌더링 영역 */}
            {Object.entries(cursors).map(([id, pos]) => (
                id !== myId && (
                    <div
                        key={id}
                        style={{
                            position: 'fixed',
                            left: pos.x,
                            top: pos.y,
                            width: '14px',
                            height: '14px',
                            backgroundColor: pos.color || '#3b82f6',
                            borderRadius: '50% 50% 50% 0',
                            transform: 'rotate(-45deg)',
                            pointerEvents: 'none',
                            zIndex: 10000,
                            transition: 'left 0.1s ease-out, top 0.1s ease-out',
                            boxShadow: '1px 1px 3px rgba(0,0,0,0.2)'
                        }}
                    >
                        {/* ID 라벨 */}
                        <div style={{
                            position: 'absolute',
                            left: '12px',
                            top: '12px',
                            backgroundColor: pos.color || '#3b82f6',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            transform: 'rotate(45deg)',
                            whiteSpace: 'nowrap',
                            boxShadow: '1px 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            {id.replace('user_', '')}
                        </div>
                    </div>
                )
            ))}
        </div>
    );
}
export default App;