import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`//bao gồm tất cả
    background-color: 202124;
    align-items: center;
    gap:16px;
    flex-wrap: nowrap;
    width: 1270px;
    padding: 20px 0;
`
export const WrapperTextHeader = styled.span`//phần food
    font-size: 18px;//Chỉ cho thằng Food
    color: white;
    font-weight: bold;
    text-align: left;
`

export const WrapperHeaderAccount = styled.div`//phần người dùng
    display: flex;
    align-items: center;
    color: white;
    gap: 10px;
    font-size: 12px;
`

export const WrapperTextHeaderSmall = styled.span`//phần giỏ hàng
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
`
export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: rgb(26, 148, 255);
    }
`