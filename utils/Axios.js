import axios from 'axios';

const Axios = axios.create({
  baseURL: `${process.env.API || typeof window !== 'undefined' && window.location.origin + '/api'}/`,
});


export default Axios; 