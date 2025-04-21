// import axios from 'axios';
// window.axios = axios;

// window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// resources/js/bootstrap.ts atau file setup Axios Anda
import axios from "axios";

axios.defaults.baseURL = "https://gis_2205551087.manpits.xyz";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;
