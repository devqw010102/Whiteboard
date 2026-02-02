import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/postits';

export interface PostIt {
    id: number;
    content: string;
    x: number;
    y: number;
    color: string;
    zIndex: number;
}

export const postItApi = {
    getAll: () => axios.get<PostIt[]>(BASE_URL),
    create: (data: Partial<PostIt>) => axios.post<PostIt[]>(BASE_URL, data),
    delete: (id: number) => axios.delete(`${BASE_URL}/${id}`),
    updatePosition: (id: number, x: number, y: number) => axios.put(`${BASE_URL}/${id}/position?x=${x}&y=${y}`),
    updateContent: (id:number, content: string) => axios.put(`${BASE_URL}/${id}/content`, { content }),
};