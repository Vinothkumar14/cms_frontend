// services/user.ts
import api from './api';

export const fetchUserFromApi = async (userId: string) => {
  try {
    const response = await api.get(`/api/users/${userId}?populate=role`);
    const userData = response.data.data;
    const attributes = userData.attributes;
    const roleName = attributes.role?.data?.attributes?.name ?? null;

    return {
      id: userData.id.toString(),
      name: attributes.username,
      email: attributes.email,
      role: roleName,
    };
  } catch (error) {
    console.error('Failed to fetch user from API:', error);
    throw error;
  }
};
