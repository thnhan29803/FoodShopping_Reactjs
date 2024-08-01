import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReporText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
import logo  from '../../assets/images/logosale.png'
import { useNavigate } from 'react-router-dom'
import { convertPice } from '../../utils'


const CardComponent = (props) => {
  const {countInStock, description, image, name, price, rating, type, discount, selled, id} = props
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`)
  }
  return (
    <WrapperCardStyle
        hoverable
        headStyle={{width:'200px', height:'200px'}}
        style={{ width: 200 }}
        bodyStyle={{ padding: '10px', }}
        cover={<img alt="example" src={image} />}
        onClick={() => handleDetailsProduct(id)}
    >
      <img src={logo} style={{ width: '32px', height:'32px', position:'absolute', top:'0', left:'0', marginLeft:'-1px',marginTop:'-1px'}}/>  
      <StyleNameProduct>{name}</StyleNameProduct>
        <WrapperReporText>
            <span style={{marginRight:'4px'}}>
                <span>{rating}</span><StarFilled style={{color:'yellow', fontSize:'12px'}}/>
            </span>
            <WrapperStyleTextSell> | {selled || 1000}+ </WrapperStyleTextSell>
        </WrapperReporText>
        <WrapperPriceText>
            <span style={{marginRight:'8px'}}>{convertPice(price)}</span>
            <WrapperDiscountText>
               - {discount || 5}%
            </WrapperDiscountText>
        </WrapperPriceText>
    </WrapperCardStyle>
    )
}

export default CardComponent
