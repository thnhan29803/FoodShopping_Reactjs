import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.div`
    color: black;
    font-size: 18px;
    margin: 4px 0;
`
export const WrapperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    width: 600px;
    margin: 0 auto;
    padding: 30px;
    border-radius: 10px;
    gap: 30px;
`
export const WrapperLabel = styled.label`
    color: #000;
    font-size: 12px;
    font-weight: 600;
    width: 60px;
    text-align: left;
`
export const WrapperInput = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`
export const WrapperUploadFile = styled(Upload)`
    & .ant-upload-list-item-container {
        display: none;
    }
    & .ant-upload-list-item-name {
        display: none;
    }
    & .ant-upload-list-item-actions {
        display: none;
    }
    & .ant-upload-icon {
        display: none;
    }
`