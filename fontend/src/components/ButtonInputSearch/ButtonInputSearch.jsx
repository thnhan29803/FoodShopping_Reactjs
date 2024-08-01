import { SearchOutlined } from '@ant-design/icons'
import React from 'react'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtonInputSearch = (props) => {
    const { 
        size, placeholder, textbutton, bordered, 
        backgroundColorInput = '#fff', 
        backgroundColorButton = '#e4002B',
        colorButton = '#fff'
    } = props
  return (
    <div style={{display:'flex',}}>
        <InputComponent //inputcomponent sẽ dùng nhìu nơi khác nhau
            size={size} 
            placeholder={placeholder} 
            bordered={bordered} 
            style={{backgroundColor: backgroundColorInput, borderRadius: '0px' }}     
            {...props} 
        />
        <ButtonComponent 
            size={size} 
            icon={<SearchOutlined color={colorButton} style={{ color:'#fff'}} />} 
            styleButton={{background : backgroundColorButton, border: !bordered && 'none', borderRadius: '0px' }}
            textbutton={textbutton}
            styletextbutton={{color:colorButton}}
        />
    </div>
  )
}

export default ButtonInputSearch
