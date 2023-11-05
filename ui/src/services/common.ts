import axios, { AxiosError, AxiosResponse } from 'axios';

export const localRepoServer = axios.create({
  baseURL: import.meta.env.VITE_LOCAL_REPO_SERVER,
  withCredentials: true
});

export const trackerServer = axios.create({
  baseURL: import.meta.env.VITE_TRACKER_SERVER,
  withCredentials: true
})

export async function invoke<R = unknown, D = unknown>(call: Promise<AxiosResponse<R, D>>) {
  try {
    const response = await call;
    return response.data;
  } catch (err) {
    const e = err as AxiosError;
    const errPayload = e.response?.data ? (e.response.data as ResponseError) : e;
    throw errPayload;
  }
}
