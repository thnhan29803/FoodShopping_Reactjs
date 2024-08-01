import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Lable, WrapperCountOrder, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';
import { Button, Checkbox, Form, Radio } from 'antd';

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { convertPice } from '../../utils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import * as message from '../../components/Message/message'
import { useMutationhooks } from '../../hooks/useMutationHooks';
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slides/userSlide';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
import { useNavigate } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';
import * as PaymentService from '../../services/PaymentService'

export const PaymentPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [delivery, setDilivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  const navigate = useNavigate()
  const [sdkReady, setSdkReady] = useState(false)
  
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  })

  const [form] = Form.useForm();

  const dispatch = useDispatch()

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
    if(priceMemo > 200000) {
      return 10000
    }else if(priceMemo === 0){
      return 0 
    }else {
      return 20000
    }
  }, [priceMemo])

  const totalPriceMemo = useMemo(() => {//TongTien
    return Number(priceMemo) -  Number(priceDiscountMemo) +  Number(diliveryPriceMemo)
  },[priceMemo,priceDiscountMemo,diliveryPriceMemo])

  const handleAddOrder = () => {
    if(user?.access_token && order?.orderItemsSelected && user?.name
      && user?.address && user?.phone && user?.city && priceMemo && user?.id){
        // eslint-disable-next-line no-unused-expressions
        mutationAddOrder.mutate(
         { 
           token: user?.access_token, 
           orderItems: order?.orderItemsSelected, 
           fullName: user?.name, 
           address: user?.address, 
           phone: user?.phone, 
           city: user?.city, 
           paymentMethod: payment, 
           itemsPrice: priceMemo, 
           shippingPrice: diliveryPriceMemo, 
           totalPrice: totalPriceMemo, 
           user: user?.id,
           email: user?.email
         }
        )
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

  const mutationAddOrder = useMutationhooks(
    (data) => {
        const {  
          token, 
         ...rests } = data
       const res = OrderService.createOrder( 
          { ...rests }, token)
        return res;
    },
  )


  const {isLoading, data} = mutationUpdate
  const {data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError} = mutationAddOrder

  useEffect(() => {
    if(isSuccess && dataAdd?.status === 'OK'){
      const arrayOrderd = [] 
      order?.orderItemsSelected?.forEach(element => {
        arrayOrderd.push(element.product)
      });
      dispatch(removeAllOrderProduct({listChecked: arrayOrderd}))
      message.success('Đặt hàng thành công')
      navigate('/orderSuccess', {
        state: {
          delivery,
          payment,
          order: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo
        }
      })
    }else if (isError){
      message.error()
    }
  }, [isSuccess, isError])

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

  const onSuccessPaypal = (details, data) => {
     mutationAddOrder.mutate(
         { 
           token: user?.access_token, 
           orderItems: order?.orderItemsSelected, 
           fullName: user?.name, 
           address: user?.address, 
           phone: user?.phone, 
           city: user?.city, 
           paymentMethod: payment, 
           itemsPrice: priceMemo, 
           shippingPrice: diliveryPriceMemo, 
           totalPrice: totalPriceMemo, 
           user: user?.id,
           isPaid: true,
           paidAt: details.update_time,
           email: user?.email
         }
        )
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

  const handleDilivery = (e) => {
    setDilivery(e.target.value)
  }

    const handlePayment = (e) => {
    setPayment(e.target.value)
  }

  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true;
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(() => {
    if(!window.paypal) {
      addPaypalScript()
    }else {
      setSdkReady(true)
    }
  }, [])


  return (
      <div style={{background: '#f5f5fa', width:'100%', height: '100vh'}}>
        <Loading isLoading={isLoadingAddOrder}>
          <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
            <h3>Thanh Toán</h3>
            <div style={{display:'flex', justifyContent:'center'}}>
              <WrapperLeft>
               <WrapperInfo>
                  <div>
                    <Lable>Chọn phương thức giao hàng</Lable>
                    <WrapperRadio onChange={handleDilivery} value={delivery}>
                      <Radio value="fast"><span style={{color: '#ea8500', fontWeight:'bold'}}>FAST</span>Giao hàng tiết kiệm</Radio>
                      <Radio value="ShopeFood"><span style={{color: '#ea8500', fontWeight:'bold'}}>ShopeFood</span>Giao hàng tiết kiệm</Radio>
                    </WrapperRadio>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div>
                  <Lable>Chọn phương thức thanh toán</Lable>
                  <WrapperRadio onChange={handlePayment} value={payment}>
                    <Radio value="later_money">Thanh toán tiền mặt khi nhận hàng</Radio>
                    <Radio value="paypal">Thanh toán tiền bằng paypal</Radio>
                  </WrapperRadio>
                </div>
                </WrapperInfo>
              </WrapperLeft>
              <WrapperRight>
                <div style={{width: '100%'}}>
                  <WrapperInfo style={{width: '100%'}}>
                    <div>
                      <span>Địa chỉ: </span>
                      <span style={{fontWeight: 'bold'}}>{`${user?.address} ${user?.city}`} </span>
                      <span onClick={handleChangeAddress} style={{color:'blue',cursor:'pointer'}}>Thay đổi</span>
                    </div>
                  </WrapperInfo>
                  <WrapperInfo style={{width: '100%'}}>
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
                {payment === 'paypal' && sdkReady  ? (
                  <div style={{width:'360px', marginLeft: '40px'}}>
                  <PayPalButton
                          amount={Math.round(totalPriceMemo / 30000)}
                          // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                          onSuccess={onSuccessPaypal}
                          onError={() => {
                            alert('Error')
                          }}
                        />
                  </div>
                ) : (
                <ButtonComponent
                      onClick={() => handleAddOrder()}
                      size={40} 
                      styleButton={{
                          background : 'rgb(255, 57, 69)', 
                          height:'48px',
                          width:'360px',
                          border:'none',
                          borderRadius:'4px',
                          marginLeft: ' 40px'
                      }}
                      textbutton={"Đặt Hàng"}
                      styletextbutton={{color:"#fff",fontSize:"15px",fontWeight:"700"}} />
                )}
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
        </Loading>
      </div>
  )
}

export default PaymentPage