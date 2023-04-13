//пакет запросов на сервер  axios

import axios from 'axios'

axios.defaults.headers.common["token"] = window.localStorage.token;

window.axios = axios;

export default axios;