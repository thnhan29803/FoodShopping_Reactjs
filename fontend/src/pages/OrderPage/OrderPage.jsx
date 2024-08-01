import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperTotal } from './style';
import { Button, Checkbox, Form } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide';
import { convertPice } from '../../utils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import * as UserService from '../../services/UserService'
import * as message from '../../components/Message/message'
import { useMutationhooks } from '../../hooks/useMutationHooks';
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import StepComponent from '../../components/stepComponent/StepComponent';

export const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  })

  const navigate = useNavigate()
  
  const [form] = Form.useForm();

  const dispatch = useDispatch()
  const onChange = (e) => {
    if(listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    }else {
      setListChecked([...listChecked, e.target.value])
    }
  };

  const handleChangeCount = (type, idProduct, limited) => {//số lượng tăng giảm cho nó giới hạn
    if(type === 'increase') {
      if(!limited) {
        dispatch(increaseAmount({idProduct}))
      }
    }else {
      if(!limited) {
        dispatch(decreaseAmount({idProduct}))
      }
    }
  }

  const handleOnchangeCheckAll = (e) => {

    if(e.target.checked) {
      const newListChecked = [] 
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    }else {
      setListChecked([])
    }
  }

  useEffect(() => {
    dispatch(selectedOrder({listChecked}))
  },[listChecked])

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  const handleRemoveAllOrder = () => {
    if(listChecked?.length > 1){
      dispatch(removeAllOrderProduct({listChecked}))
    }
  }

  const priceMemo = useMemo(() => {//tam tinh
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return result
  }, [order])

   const priceDiscountMemo = useMemo(() => {//giam gia
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0
      return total + (priceMemo * (totalDiscount  * cur.amount) / 100)
    },0)
    if(Number(result)){
      return result
    }
    return 0
  },[order])

  const diliveryPriceMemo = useMemo(() => {//phi giao hang
    if(priceMemo >= 200000 && priceMemo < 500000) {
      return 10000
    }else if(priceMemo >= 500000 || order?.orderItemsSelected?.length === 0){
      return 0 
    }else {
      return 20000
    }
  }, [priceMemo])

  const totalPriceMemo = useMemo(() => {//TongTien
    return Number(priceMemo) -  Number(priceDiscountMemo) +  Number(diliveryPriceMemo)
  },[priceMemo,priceDiscountMemo,diliveryPriceMemo])

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({idProduct}))
  }

  const handleAddCard = () => {
    if(!order?.orderItemsSelected?.length) {
      message.error('Vui lòng chọn sản phẩm')
    }else if(!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true)
    }else {
      navigate('/payment')
    }
  }

  const mutationUpdate = useMutationhooks(
    (data) => {
        const { 
          id, 
          token, 
         ...rests } = data
       const res = UserService.updateUser(
          id, 
          { ...rests }, token)
        return res;
    },
  )

  const {isLoading, data} = mutationUpdate

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }
  const handleUpdateInfoUser = () => {
    const {name, address,city, phone} = stateUserDetails
    if(name && address && city && phone){
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({name, address,city, phone}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

  const itemsDelivery = [
    {
      title:'20.000 VND',
      description: 'Dưới 200.000 VND',
    },
    {
      title:'10.000 VND',
      description: 'Từ 200.000 VND đến dưới 500.000 VND',
    },
    {
      title: '0',
      description: 'Trên 500.000 VND',
    }
  ]

  return (
      <div style={{background: '#f5f5fa', width:'100%', height: '100vh'}}>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h3>Giỏ Hàng</h3>
          <div style={{display:'flex', justifyContent:'center'}}>
            <WrapperLeft>
              <wrapperStyleHeader>
                <StepComponent  items={itemsDelivery} current={diliveryPriceMemo === 10000 ? 2 : 
                diliveryPriceMemo === 20000 ? 1 : order.orderItemsSelected.length === 0 ? 0 : 3}/>
              </wrapperStyleHeader>
              <WrapperStyleHeader>
                 <span style={{display: 'inline-block', width: '390px'}}>
                    <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></Checkbox>
                    <span>Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                 </span>
                 <div style={{flex: 1, display:'flex', alignItems: 'center', justifyContent:'space-between'}}>
                  <span>Đơn Giá</span>
                  <span>Số lượng</span>
                  <span>Thành Tiền</span>
                  <DeleteOutlined style={{cursor:'pointer'}} onClick={handleRemoveAllOrder}/>
                 </div>
              </WrapperStyleHeader>
              <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                  <div style={{width: '390px', display:'flex', alignItems:'center', gap: 4}}>
                    <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></Checkbox>
                    <img src={order?.image} style={{width: '77px', height:'79px', objectFit:'cover'}} />
                    <div style={{
                      width:'260px',
                      overflow:'hidden',
                      textOverflow:'ellipsis',
                      whiteSpace:'nowrap'
                      }}>{order?.name}</div>
                  </div>
                  <div style={{flex: 1, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <span>
                      <span style={{fontSize:'13px', color:'#242424'}}>{convertPice(order?.price)}</span>
                    </span>
                    <WrapperCountOrder>
                      <button style={{border:'none', background:'transparent', cursor:'pointer'}} onClick={() => handleChangeCount('decrease', order?.product,
                       order?.amount === 1)}>
                        <MinusOutlined style={{color: '#000', fontSize:'10px'}} />
                      </button>
                      <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size='small' min ={1} limited={order?.countInStock}/>
                      <button style={{border:'none', background:'transparent', cursor:'pointer'}} onClick={() => handleChangeCount('increase', order?.product,
                       order?.amount === order.countInStock)}>
                        <PlusOutlined style={{color: '#000', fontSize: '10px'}} />
                      </button>
                    </WrapperCountOrder>
                    <span style={{color: 'rgb(255, 66, 78)', fontSize:'13px', fontWeight:500}}>{convertPice(order?.price * order?.amount)}</span>
                    <DeleteOutlined  style={{cursor:'pointer'}} onClick={() => handleDeleteOrder(order?.product)}/>
                  </div>
                </WrapperItemOrder>
                )
              })}
              </WrapperListOrder>
            </WrapperLeft>
            <WrapperRight>
              <div style={{width: '100%'}}>
                <WrapperInfo>
                  <div>
                    <span>Địa chỉ: </span>
                    <span style={{fontWeight: 'bold'}}>{`${user?.address} ${user?.city}`} </span>
                    <span onClick={handleChangeAddress} style={{color:'blue',cursor:'pointer'}}>Thay đổi</span>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <span>Tạm tính</span>
                    <span style={{color: '#000', fontSize:'14px', fontWeight:'bold'}}>{convertPice(priceMemo)}</span>
                  </div>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <span>Giảm giá</span>
                    <span style={{color: '#000', fontSize:'14px', fontWeight:'bold'}}>{convertPice(priceDiscountMemo)}</span>
                  </div>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                    <span>Phí giao hàng</span>
                    <span style={{color: '#000', fontSize:'14px', fontWeight:'bold'}}>{convertPice(diliveryPriceMemo)}</span>
                  </div>
                </WrapperInfo>
                <WrapperTotal style={{width: '100%'}}>
                  <span>Tổng tiền</span>
                  <span style={{display:'flex', flexDirection:'column'}}>
                    <span style={{color: 'rgb(254, 56, 52)', fontSize:'24px',fontWeight:'bold'}}>{convertPice(totalPriceMemo)}</span>
                    <span style={{color:'#000', fontSize:'11px'}}>(Đã bao gồm VAT nếu có)</span>
                  </span>
                </WrapperTotal>
              </div>
              <ButtonComponent
                    onClick={() => handleAddCard()}
                    size={40} 
                    styleButton={{
                        background : 'rgb(255, 57, 69)', 
                        height:'48px',
                        width:'360px',
                        border:'none',
                        borderRadius:'4px',
                        marginLeft: ' 40px'
                    }}
                    textbutton={"Mua hàng"}
                    styletextbutton={{color:"#fff",fontSize:"15px",fontWeight:"700"}} />
            </WrapperRight>
          </div>
        </div>
        <ModalComponent forceRender title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfoUser}>
            <Loading isLoading={isLoading}>
            <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          // onFinish={onUpdateUser}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <InputComponent  value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name"/>
          </Form.Item>

          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'Please input your city!' }]}
          >
            <InputComponent  value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city"/>
          </Form.Item>
          
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone!' }]}
          >
            <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone"/>
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address"/>
          </Form.Item>
          </Form>                 
            </Loading>
        </ModalComponent>
      </div>
  )
}

export default OrderPage
