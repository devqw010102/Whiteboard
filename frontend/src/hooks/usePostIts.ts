import { useState, useEffect, useRef } from 'react';
import { PostIt, postItApi } from '../data/postItApi';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const usePostIts = (onCursorReceived?: (data: any) => void) => {
    const [postIts, setPostIts] = useState<PostIt[]>([]);
    const boardRef = useRef<HTMLDivElement>(null);
    const stompClient = useRef<Client | null>(null);
    const [highestZ, setHighestZ] = useState(10);

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

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws-postits'),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("WebSocket Connected");

                client.subscribe('/topic/public', (message) => {
                    const data = JSON.parse(message.body);

                    if(data.userId) {
                        if(onCursorReceived) onCursorReceived(data);
                        return;
                    }

                    if(typeof data === 'number') {
                        setPostIts(prev => prev.filter(p => p.id !== data));
                    }
                    else {
                        setPostIts(prev => {
                            const exists = prev.find(p => p.id === data.id);
                            if(exists) {
                                return prev.map(p => p.id === data.id ? data : p);
                            }
                            return [...prev, data];
                        });
                    }


                });
            },
            onStompError : (frame) => {console.error("STOMP ERROR:", frame.headers);}
        });

        client.activate();
        stompClient.current = client;

        return () => {if(stompClient.current) stompClient.current.deactivate();};
    }, []);

    const sendWSMessage = (destination: string, data: any) => {
        if(stompClient.current && stompClient.current.connected) {
            stompClient.current.publish({
                destination: `/app${destination}`,
                body: JSON.stringify(data)
            });
        }
    };

    const addPostIt = async (content: string, color: string) => {
        const newNote = {
            content : content,
            x :  100 + Math.random() * 300,
            y : 100 + Math.random() * 300,
            color : color
        };

        if(stompClient.current && stompClient.current.connected) {
            stompClient.current.publish({
                destination: '/app/create',
                body: JSON.stringify(newNote)
            });
        }
    };

    const deletePostIt = async (id: number) => {
        if(stompClient.current && stompClient.current.connected) {
            stompClient.current.publish({
                destination: '/app/delete',
                body: JSON.stringify(id)
            })
        }
    };

    const updatePostItContent = async(id: number, newContent: string) => {
        if(stompClient.current && stompClient.current.connected) {
            stompClient.current.publish({
                destination: '/app/edit',
                body: JSON.stringify({ id, content: newContent })
            })
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

        const updatedPostIt = {id: Number(id), x : newX, y: newY};
        sendWSMessage('/move', updatedPostIt);
    };

    const handleBringToFront = (id: number) => {
        const newZ = highestZ + 1;
        setHighestZ(newZ);

        sendWSMessage('/front', {id, zIndex : newZ});
    }

    const updatePostItColor = (id: number, color: string) => {
        sendWSMessage('/color', {id, color});
    }

    return {
        postIts,
        stompClient,
        addPostIt,
        deletePostIt,
        updatePostItContent,
        handleDragStart,
        handleDrop,
        boardRef,
        handleBringToFront,
        updatePostItColor
    };
};