import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const signupUser = async (formData) => {
    console.log('API_URL:', API_URL);
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, formData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Something went wrong!');
  }
};
