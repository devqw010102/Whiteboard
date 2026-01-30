import { useState, useEffect, useRef } from 'react';
import { PostIt, postItApi } from '../data/postItApi';
import { postItService } from '../service/postItService';

export const usePostIts = () => {
    const [postIts, setPostIts] = useState<PostIt[]>([]);
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadPostIts = async () => {
            try {
                const res = await postItApi.getAll();
                setPostIts(res.data);
            } catch (e) {
                console.error("데이터 로드 실패:", e);
            }
        };
        loadPostIts();
    }, []);

    const addPostIt = async (content: string, color: string) => {
        try {
            const newNote = await postItService.createNewPostIt(content, color);
            setPostIts(prev => [...prev, newNote]);
        } catch (e) {
            console.error("추가 실패:", e);
        }
    };

    const deletePostIt = async (id: number) => {
        try {
            await postItService.removePostIt(id);
            setPostIts(prev => prev.filter(p => p.id !== id));
        } catch (e) {
            console.error("삭제 실패:", e);
        }
    };

    const updatePostItContent = async(id: number, newContent: string) => {
        setPostIts(prev => prev.map(p =>
        p.id === id? {...p, content: newContent} : p
        ));

        try {
            await postItApi.updateContent(id, newContent);
        }
        catch(e) {
            console.error("내용 저장 실패:", e);
        }
    }


    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        const rect = e.currentTarget.getBoundingClientRect();

        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        e.dataTransfer.setData("id", id.toString());
        e.dataTransfer.setData("offsetX", offsetX.toString());
        e.dataTransfer.setData("offsetY", offsetY.toString());

    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();

        if (!boardRef.current) return;

        const boardRect = boardRef.current.getBoundingClientRect();

        const id = e.dataTransfer.getData("id");
        const offsetX = parseFloat(e.dataTransfer.getData("offsetX"));
        const offsetY = parseFloat(e.dataTransfer.getData("offsetY"));

        const newX = Math.round(e.clientX - boardRect.left - offsetX);
        const newY = Math.round(e.clientY - boardRect.top - offsetY);

        setPostIts(prev => prev.map(p =>
            p.id === Number(id) ? { ...p, x: newX, y: newY } : p
        ));

        try {
            await postItApi.updatePosition(Number(id), newX, newY);
        } catch (e) {
            console.error("위치 저장 실패:", e);
        }
    };

    return {
        postIts,
        addPostIt,
        deletePostIt,
        updatePostItContent,
        handleDragStart,
        handleDrop,
        boardRef
    };
};