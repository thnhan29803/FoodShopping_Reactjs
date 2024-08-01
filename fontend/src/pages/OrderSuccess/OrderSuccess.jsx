import React from 'react'
import { useSelector } from 'react-redux'
import { Lable, WrapperCountOrder, WrapperInfo, WrapperContainer, WrapperValue, WrapperItemOrder, WrapperItemOrderInfo } from './style';
import Loading from '../../components/LoadingComponent/Loading';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../contant';
import { convertPice } from '../../utils';


export const OrderSuccess = () => {
  const location = useLocation()
  const {state} = location
  return (
      <div style={{background: '#f5f5fa', width:'100%', height: '100vh'}}>
        <Loading isLoading={false}>
          <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
            <h3>Đơn hàng đặt thành công</h3>
            <div style={{display:'flex', justifyContent:'center'}}>
              <WrapperContainer>
                <WrapperInfo>
                  <div>
                    <label>Phương thức giao hàng</label>
                      <WrapperValue>
                        <span style={{color: '#ea8500', fontWeight:'bold'}}>{orderContant.delivery[state?.delivery]}</span> Giao hàng tiết kiệm
                      </WrapperValue>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div>
                    <Lable>Phương thức thanh toán</Lable>

                    <WrapperValue>
                      {orderContant.payment[state?.payment]}
                    </WrapperValue>
                  </div>
                </WrapperInfo>
                <WrapperItemOrderInfo>
                  {state.order?.map((order) => {
                    return(
                      <WrapperItemOrder key={order?.name}>
                      <div style={{width: '500px', display:'flex', alignItems:'center', gap: 4}}>
                        <img src={order?.image} style={{width: '77px', height:'79px', objectFit:'cover'}} />
                        <div style={{
                          width:'260px',
                          overflow:'hidden',
                          textOverflow:'ellipsis',
                          whiteSpace:'nowrap'
                          }}>{order?.name}</div>
                      </div>
                      <div style={{flex: 1, display:'flex', alignItems:'center', gap:'10px'}}>
                        <span>
                          <span style={{fontSize:'13px', color:'#242424'}}>Giá tiền: {convertPice(order?.price)}</span>
                        </span>
                         <span>
                          <span style={{fontSize:'13px', color:'#242424'}}>Số lượng: {order?.amount}</span>
                        </span>
                      </div>
                      </WrapperItemOrder>
                    )
                  })}
                </WrapperItemOrderInfo>
                        <span>
                          <span style={{fontSize:'16px', color:'red'}}>Tổng tiền: {convertPice(state?.totalPriceMemo)}</span>
                        </span>
              </WrapperContainer>
            </div>
          </div>
        </Loading>
      </div>
  )
}

export default OrderSuccess
