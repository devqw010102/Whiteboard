import {useState, useCallback, useRef} from "react";
import {Client} from "@stomp/stompjs";

export const useCursors = (stompClient: React.MutableRefObject<Client | null>) => {

    const [cursors, setCursors] = useState<Record<string, {x: number, y: number}>>({});
    const [myId] = useState(() => "user_" + Math.random().toString(36).substring(2, 7));
    const lastSent = useRef<number>(0);

    const [myColor] = useState(() => {
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
        return colors[Math.floor(Math.random() * colors.length)];
    })

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const now = Date.now();

        if(now - lastSent.current < 50) return;

        if (stompClient.current && stompClient.current.connected) {
            stompClient.current.publish({
                destination: '/app/cursor',
                body: JSON.stringify({
                    userId: myId,
                    x: e.clientX,
                    y: e.clientY,
                    color: myColor
                })
            });
            lastSent.current = now;
        }
    }, [stompClient, myId, myColor]);

    return {cursors, setCursors, myId, handleMouseMove};
}