import {postItApi} from "../data/postItApi";

export const postItService = {
    createNewPostIt: async (content: string, color: string) => {
        const payload = {
            content,
            color,
            x: 50,
            y: 50
        };
        const response = await postItApi.create(payload)
        return Array.isArray(response.data) ? response.data[0] : response.data;
    },

    removePostIt: async (id: number) => {
        await postItApi.delete(id);
        return id;
    }
}