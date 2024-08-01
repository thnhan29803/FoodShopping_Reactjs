import axios from "axios"

export const getConfig = async () => {
    const res = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/payment/config`)
    return res.data
}

