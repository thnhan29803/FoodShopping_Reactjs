import { Badge, Col, Popover } from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading';
import { searchProduct } from '../../redux/slides/ProductSlide';
import Logo  from '../../assets/images/Logo.png'

const HeaderComponent = ({isHiddenSearch = false, isHiddenCart = false}) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const [ loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search, setSearch] = useState('')
    const [isOpenPopup, setIsOpenPopup] = useState(false)
  const order = useSelector((state) => state.order)
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleLogout = async () => {
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    localStorage.removeItem('access_token')//remove nó là ko bị khi bắt đầu npm start không bị lỗi
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.name, user?.avatar])

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile-user')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && (
      <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>Đơn hàng của tôi</WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng Xuất</WrapperContentPopup>
    </div>
  );

    const handleClickNavigate = (type) => {
    if(type === 'profile-user') {
      navigate('/profile-user')
    }else if(type === 'admin'){
      navigate('/system/admin')
    }else if(type === 'my-order') {
      navigate('/my-order', { state: {
         id: user?.id,
        token: user?.access_token
      }
      })
    }else {
      handleLogout()
    }
    setIsOpenPopup(false)
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div style={{width:'100%',background:'#202124',display:'flex',justifyContent:'center'}}>
      <WrapperHeader style={{justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset'}}>
        <Col span={5}>
         <WrapperTextHeader onClick={() => navigate('/')} style={{cursor:'pointer'}}><img src={Logo} width='100px' height='40px' /></WrapperTextHeader>
        </Col>

        {!isHiddenSearch && (
        <Col span={13}>
          <ButtonInputSearch 
            size="large"
            bordered={false}
            textbutton="Tìm Kiếm"
            placeholder="input search text" 
            onChange={onSearch}
          />
        </Col>
        )}

        <Col span={6} style={{ display: 'flex', gap: '54px',alignItems:'center'}} >
        <Loading isLoading={loading}>
          <WrapperHeaderAccount>
            {userAvatar ? (//Hình ảnh  trên thanh header khi login vào
              <img src={userAvatar} alt="avatar" style={{
                  height: '30px',
                  width: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover'
              }}/>
            ) : (
              <UserOutlined style={{ fontSize: '30px' }} />
            )}
            {user?.access_token ? (//sao ghi đăng nhập thành công sẽ được hiển thị tên lên trang Chủ
              <>
                <Popover content={content} trigger="click" open={isOpenPopup}>
                  <div style={{cursor: 'pointer'}} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName?.length ? userName : user?.email}</div>
                </Popover>
              </>
            ) : (
              <div onClick={handleNavigateLogin} style={{cursor: 'pointer'}}>
              <span>Đăng Nhập/Đăng ký</span>
              <div>
                <span>Tài Khoản</span>
                <CaretDownOutlined />
              </div>   
            </div>
            )}
          </WrapperHeaderAccount>
        </Loading>   
        {!isHiddenCart && (
          <div onClick={() => navigate('/order')} style={{cursor:'pointer'}}>
            <Badge count={order?.orderItems?.length} size='small'>
              <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
            </Badge>
            <WrapperTextHeaderSmall>Giỏ Hàng</WrapperTextHeaderSmall>
          </div>
        )}  
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent
