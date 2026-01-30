import axiosInstance from '../utils/axiosInstance';

export interface PostIt {
    id: number;
    content: string;
    x: number;
    y: number;
    color: string;
}

export const postItApi = {

    getAll: () => axiosInstance.get<PostIt[]>('/postits'),

    create: (postIt: Partial<PostIt>) => axiosInstance.post<PostIt>('/postits', postIt),

    updatePosition: (id: number, x: number, y: number) =>
        axiosInstance.put(`/postits/${id}/position?x=${x}&y=${y}`),
};