import axios from 'axios'

export const API_URL = "https://camu-crm.uz";

const $axios = axios.create({
    baseURL: `${API_URL}/`
})

export default $axios