import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
    color: #000;
    font-size: 14px;
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