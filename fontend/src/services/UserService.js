import axios from "axios"

export const axiosJWT = axios.create()

export const loginUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/sign-in`, data)
    return res.data
}

export const signupUser = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/sign-up`, data)
    return res.data
}

export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_URL_BACKEND}/user/get-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,

        }
    },)
    return res.data  
}

export const deleteUser = async (id, access_token, data) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_URL_BACKEND}/user/delete-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,

        }
    },)
    return res.data  
}

export const getAllUser = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_URL_BACKEND}/user/getAll`, {
        headers: {
            token: `Bearer ${access_token}`,

        }
    },)
    return res.data  
}

export const refreshToken = async () => {
    const res = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/refresh-token`, {
        withCredentials: true
    })
    return res.data
}

export const logoutUser = async () => {
    const res = await axios.post(`${process.env.REACT_APP_URL_BACKEND}/user/log-out`)
    return res.data
}

export const updateUser= async (id, data, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_URL_BACKEND}/user/update-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,

        }
    })
    return res.data
}

export const deleteManyUser = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_URL_BACKEND}/user/delete-many`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}