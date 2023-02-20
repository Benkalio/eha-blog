import { api } from './api';

interface BlogPostData {
  title: string;
  description: string;
  image: File;
  categories: string[];
}

export const BlogService = {
  getAll: async () => {
    const response = await api.get('/blog');
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get(`/blog/${id}`);
    return response.data;
  },

  create: async (data: BlogPostData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('image', data.image);
    formData.append('categories', JSON.stringify(data.categories));
    const response = await api.post('/blog', formData);
    return response.data;
  },

  update: async (id: string, data: BlogPostData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.image) {
      formData.append('image', data.image);
    }
    formData.append('categories', JSON.stringify(data.categories));
    const response = await api.put(`/blog/${id}`, formData);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/blog/${id}`);
  },
};
