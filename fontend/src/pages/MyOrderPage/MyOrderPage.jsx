import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading'
import { useLocation, useNavigate } from 'react-router-dom'
import { WrapperContainer, WrapperFooterItem, WrapperHeaderItem, WrapperItemOrder, WrapperListOrder, WrapperStatus } from './style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { convertPice } from '../../utils'
import { useMutationhooks } from '../../hooks/useMutationHooks'
import { message } from 'antd'

export const MyOrderPage = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token)
    return res.data
  }
  
  const queryOrder = useQuery({ queryKey: ['orders'],queryFn : fetchMyOrder }, {
    enabled: state?.id && state?.token
  })

  const { isLoading, data } = queryOrder

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token:state?.token
      }
    })
  }

  const mutation = useMutationhooks(
    (data) => {
      const { id, token, orderItems } = data
      const res = OrderService.cancelOrder(id, token, orderItems)
      return res
    }
  )

  const handleCancelOrder = (order) => {
    mutation.mutate({id: order._id, token:state?.token, orderItems: order?.orderItems}, {
      onSuccess: () => {
        queryOrder.refetch()
      }
    })
  }

  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation

  useEffect(() => {
    if(isSuccessCancel && dataCancel?.status === 'OK' ) {
      message.success('Bạn đã hủy đơn hàng thành công')
    }else if(isErrorCancel) {
      message.error()
    }
  }, [isErrorCancel, isSuccessCancel])

  const renderProduct = (data) => {
   return data?.map((order) => {
      return (
        <WrapperHeaderItem key={order?._id}>
            <img src={order?.image} 
            style={{
            width: '70px', 
            height:'70px', 
            objectFit:'cover',
            border: '1px solid rgb(238, 238, 238)',
            padding: '2px'
        }} 
      />
        <div style={{
          width:'260px',
          overflow:'hidden',
          textOverflow:'ellipsis',
          whiteSpace:'nowrap'
          }}>{order?.name}</div>
          <span style={{fontSize:'13px', color:'#242424', marginLeft:'auto'}}>{convertPice(order?.price)}</span>
        </WrapperHeaderItem>
      )
    })
  }

  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{height:'100%',width:'1270px', margin:'0 auto'}}>
          <h4>Đơn hàng của tôi</h4>
          <WrapperListOrder>
           {data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{fontSize: '14px', fontWeight: ' bold'}}>Trạng Thái</span>
                    <div><span style={{color:'rgb(255, 66, 78)'}}>Giao hàng: </span>{`${order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}`}</div>
                    <div><span style={{color:'rgb(255, 66, 78)'}}>Thanh toán: </span>{`${order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}`}</div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{color:'rgb(255, 66, 78)'}}>Tổng tiền: </span>
                      <span style={{fontSize:'13px', color:'rgb(56, 56, 61)',fontWeight: 700}}>{convertPice(order?.totalPrice)}</span>
                    </div>
                    <div style={{display:'flex', gap:'10px'}}>
                      <ButtonComponent
                        onClick={() => handleCancelOrder(order)}
                        size={40}
                        styleButton={{
                          height:'36px',
                          border: '1px solid rgb(11, 116, 229)',
                          borderRadius:'4px'
                        }}
                        textbutton={'Hủy đơn hàng'}
                        styletextbutton={{color:'rgb(11, 116, 229)', fontSize:'14px'}}
                      >
                      </ButtonComponent>
                       <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                          height:'36px',
                          border: '1px solid rgb(11, 116, 229)',
                          borderRadius:'4px'
                        }}
                        textbutton={'Xem chi tiết'}
                        styletextbutton={{color:'rgb(11, 116, 229)', fontSize:'14px'}}
                      >
                      </ButtonComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              )
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  )
}

export default MyOrderPage
