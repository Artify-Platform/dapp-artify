import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const backendUrl = String(process.env.NEXT_PUBLIC_API_ENDPOINT)

const axiosClient = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    return config
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    throw err
  }
)

export default axiosClient
