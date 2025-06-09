import api from './api';
import { 
  Content, 
  ContentCreateData, 
  Contentstatuss, 
  ContentUpdateData,
  ContentPublishData
} from '../types/content';

const ContentService = {
  async getAll(): Promise<Content[]> {
    try {
      const response = await api.get('/api/contents');
      return response.data.data.map((item: any) => ({
        id: item.id.toString(),
        documentId: item.documentId,
        title: item.title,
        description: item.description,
        body: item.body,
        authorName: item.authorName,
        statuss: item.statuss,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        publishedAt: item.publishedAt,
      }));
    } catch (error) {
      console.error('Get content error:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Content> {
    try {
      const response = await api.get(`/api/contents/${id}`);
      const item = response.data.data;
      
      return {
        id: item.id.toString(),
        title: item.attributes.title,
        description: item.attributes.description,
        body: item.attributes.body,
        statuss: item.attributes.statuss,
        authorId: item.attributes.author?.data?.id.toString(),
        authorName: item.attributes.author?.data?.attributes?.username || 'Unknown',
        createdAt: item.attributes.createdAt,
        updatedAt: item.attributes.updatedAt,
        publishedAt: item.publishedAt,
      };
    } catch (error) {
      console.error('Get content by ID error:', error);
      throw error;
    }
  },

  async create(data: ContentCreateData): Promise<Partial<Content>> {
    try {
      const response = await api.post('/api/contents', {
        data: {
          title: data.title,
          description: data.description,
          body: data.body,
          statuss: Contentstatuss.DRAFT,
        },
      });

      const item = response.data.data;
      return {
        id: item.id.toString(),
        title: item.title,
        description: item.description,
        body: item.body,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        publishedAt: item.publishedAt,
      };
    } catch (error) {
      console.error('Create content error:', error);
      throw error;
    }
  },

  async update(data: ContentUpdateData): Promise<Content> {
    try {
      const response = await api.put(`/api/contents/${data.id}`, {
        data: {
          title: data.title,
          description: data.description,
          body: data.body,
        },
      });

      const item = response.data.data;
      return {
        id: item.id.toString(),
        title: item.attributes.title,
        description: item.attributes.description,
        body: item.attributes.body,
        statuss: item.attributes.statuss,
        authorId: item.attributes.author?.data?.id.toString(),
        authorName: item.attributes.author?.data?.attributes?.username || 'Unknown',
        createdAt: item.attributes.createdAt,
        updatedAt: item.attributes.updatedAt,
        publishedAt: item.publishedAt,

      };
    } catch (error) {
      console.error('Update content error:', error);
      throw error;
    }
  },

  async publish(data: ContentPublishData): Promise<Content> {
    try {
      const response = await api.put(`/api/contents/${data.id}`, {
        data: {
          statuss: data.statuss,
        },
      });

      const item = response.data.data;
      return {
        id: item.id.toString(),
        title: item.attributes.title,
        description: item.attributes.description,
        body: item.attributes.body,
        statuss: item.attributes.statuss,
        authorId: item.attributes.author?.data?.id.toString(),
        authorName: item.attributes.author?.data?.attributes?.username || 'Unknown',
        createdAt: item.attributes.createdAt,
        updatedAt: item.attributes.updatedAt,
        publishedAt: item.publishedAt,

      };
    } catch (error) {
      console.error('Publish content error:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/contents/${id}`);
    } catch (error) {
      console.error('Delete content error:', error);
      throw error;
    }
  }
};

export default ContentService;