import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
}

export const fetchUserFromApi = async (userId: string): Promise<User> => {
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

// Call this to fetch user and save role in localStorage
export const updateLocalUserFromApi = async (userId: string) => {
  const user = await fetchUserFromApi(userId);
  localStorage.setItem('userRole', user.role ?? '');
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};
