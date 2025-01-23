import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // URL de l'API backend Symfony
});

export default api;
