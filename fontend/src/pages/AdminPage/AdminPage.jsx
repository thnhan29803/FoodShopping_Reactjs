import { Menu } from 'antd'
import React, { useState } from 'react'
import { getItem } from '../../utils';
import { AppstoreOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import OrderAdmin from '../../components/OrderAdmin/OrderAdmin';
import  img1  from '../../assets/images/125.jpg';

const AdminPage = () => {
  const items = [
    getItem('Người Dùng', 'user', <UserOutlined />),
    getItem('Sản Phẩm', 'product', <AppstoreOutlined />),
    getItem('Đơn hàng', 'order', <ShoppingCartOutlined />)
  ];

  const [keySelected, setKeySelected] = useState('')
  const renderPage = (key) => {
    switch(key) {
      case 'user':
        return (
          <AdminUser />
        )
      case 'product':
        return (
          <AdminProduct />
        )
      case 'order':
        return (
        <OrderAdmin />
      )
      default:
        return <> </>
    }
  }

  const handleOnclick = ({ key }) => {
    setKeySelected(key)
  }


  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart/>
        <div style={{display:'flex', overflow:'hidden'}}>
          <Menu
            mode="inline"
            style={{
              width: 256,
              boxShadow: '1px 1px 2px #ccc',
              height: '100vh'  
            }}
            items={items}
            onClick={handleOnclick}
          />
          <div style={{flex: 1, padding:'15px 0 15px 15px'}}>
              {renderPage(keySelected)}
          </div>
        </div>
    </>
  )
}

export default AdminPage
