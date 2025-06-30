import axios from 'axios';

const API = '/api/modulos';

export const getModulos = () => axios.get(API);
