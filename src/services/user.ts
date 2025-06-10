// services/user.ts
import api from './api';

export const fetchUserWithRole = async (userId: string) => {
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

export const updateLocalUserFromApi = async () => {
  try {
    // Implementation depends on your auth system
    // This is just a placeholder - adjust according to your needs
    const userId = localStorage.getItem('userId');
    if (userId) {
      const user = await fetchUserWithRole(userId);
      localStorage.setItem('user', user.role || '');
      return user;
    }
    return null;
  } catch (error) {
    console.error('Failed to update local user:', error);
    throw error;
  }
};

// Export all functions as named exports
export default {
  fetchUserWithRole,
  updateLocalUserFromApi
};