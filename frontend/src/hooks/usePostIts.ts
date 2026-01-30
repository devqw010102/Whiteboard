import React, { useState, useEffect, useRef } from 'react';
import {PostIt, postItApi} from "../data/postItApi";

export const usePostIts = () => {
    const [postIts, setPostIts] = useState<PostIt[]>([]);
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadPostIts();
    }, []);

    const loadPostIts = async () => {
        try {
            const response = await postItApi.getAll();
            setPostIts(response.data);
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        }
    };

    const handleDragStart = (e: React.DragEvent, id: number) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        // dataTransfer에 확실히 박아넣기
        e.dataTransfer.setData("id", id.toString());
        e.dataTransfer.setData("offsetX", (e.clientX - rect.left).toString());
        e.dataTransfer.setData("offsetY", (e.clientY - rect.top).toString());
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();


        if (!boardRef.current) return;
        const boardRect = boardRef.current.getBoundingClientRect();

        const id = e.dataTransfer.getData("id");
        const offsetX = parseFloat(e.dataTransfer.getData("offsetX"));
        const offsetY = parseFloat(e.dataTransfer.getData("offsetY"));


        const newX = e.clientX - boardRect.left - offsetX;
        const newY = e.clientY - boardRect.top - offsetY;

        setPostIts(prev => prev.map(p => p.id === Number(id) ? { ...p, x: newX, y: newY } : p));

        try {
            await postItApi.updatePosition(Number(id), Math.round(newX), Math.round(newY));
        } catch (error) {
            console.error("좌표 저장 실패:", error);
            loadPostIts();
        }
    };

    return { postIts, handleDragStart, handleDrop, boardRef };
};