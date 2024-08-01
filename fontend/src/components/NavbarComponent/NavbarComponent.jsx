import React, { useEffect, useState } from 'react'
import { WrapperContent, WrapperLabelText, WrapperTextPrice, WrapperTextValue } from './style'
import { Checkbox, Rate } from 'antd'
import TypeProduct from '../TypeProduct/TypeProduct'
import * as ProductService from '../../services/ProductService'


const NavbarComponent = () => {
    const onChange = () => { }
    const [typeProduct, setTypeProduct] = useState([])
    const renderContent = (type, options) => {
        switch(type) {
            case 'text':
                return options.map((option) =>{
                    return ( 
                            <WrapperTextValue>{option}</WrapperTextValue>
                    )
                })
            case 'Checkbox':
                return(
                    <Checkbox.Group style={{ width: '100%', display:'flex', flexDirection:'column', gap:'12px' }} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <Checkbox value={option.value}>{option.label}</Checkbox>
                            )
                        })}
                    </Checkbox.Group>
                ) 
                case 'star'://Ngôi sao
                    return options.map((option) => {
  
                        return (
                            <div style={{display:'flex', gap:'10px'}}>
                                <Rate style={{fontSize:'12px'}} disabled defaultValue={option} />
                                <span>{`tu ${option} sao`}</span>
                            </div>
                        )
                    })
                case 'price'://giá sản phẩm
                    return options.map((option) => {
                        return (
                              <WrapperTextPrice>{option}</WrapperTextPrice>
                        )
                    })
            default:
                return {}
        }
    }

    const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'OK'){
      setTypeProduct(res?.data)
    }
  }

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  return (
    <div>
      <WrapperLabelText style={{marginLeft:'10px'}}> Thực đơn </WrapperLabelText>
        <WrapperContent>
        {typeProduct.map((item) => {
            return (
              <TypeProduct name={item} key={item} />
            )
          })}
            {/* {renderContent('text', ['Do An Vat', 'Do An', 'Food'])} */}
        </WrapperContent>
    </div> 
  )
}

export default NavbarComponent
