import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
    display: flex;//cho tên món ăn mình đặt tên điều nằm ngang  
    align-items: center;//căn giữa 
    gap: 20px;//tên món ăn cách nhau 24px
    justify-content: center;// cho tất cả điều nằm bên trái
    height: 44px;//heigh cho nó rộng 
`

export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
        color: #fff;
        background: rgb(228, 0, 43);
        span {
            color: #fff;
        }
    }
    width: 100%;
    text-align: center;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointers'};
`

export const WrapperProducts = styled.div`//những hình ảnh
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin-top: 20px;
    flex-wrap: wrap;
`