import { Col, Row, Image, Rate, message } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import ImageProductSmall from '../../assets/images/small.webp'
import { WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide'
import { convertPice, initFacebookSDK } from '../../utils'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'


const ProductDetailsComponent = ({idProduct}) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [errorLimitOrder,setErrorLimitOrder] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const onChange = (value) => { 
        setNumProduct(Number(value))
    }

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if(id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
    }

    useEffect(() => {
        initFacebookSDK()
    }, [])

     useEffect(() => {
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id) 
        if((orderRedux?.amount + numProduct) <= orderRedux?.countInStock || (!orderRedux && productDetails?.countInStock > 0)) {
            setErrorLimitOrder(false)
        } else if(productDetails?.countInStock === 0){
            setErrorLimitOrder(true)
        }
    },[numProduct])

    useEffect(() => {//trong phần orderslide
        if(order.isSuccessOrder) {
            message.success('Đã thêm vào giỏ hàng')
        }
        return () => {
            dispatch(resetOrder())
        }
    }, [order.isSuccessOrder])

    const handleChangeCount = (type, limited) => {
        if(type === 'increase') {
            if(!limited) {
                setNumProduct(numProduct + 1)
            }
        }else {
            if(!limited){
                setNumProduct(numProduct - 1)
            }
        }
    }

    const {isLoading, data: productDetails} = useQuery(['product-details', idProduct], fetchGetDetailsProduct, {enabled: !!idProduct})
    const handleAddOrderProduct = () => {
        if(!user?.id) {
            navigate('/sign-in', {state: location?.pathname})
        }else {
            // {
            //     name: { type: String, required: true },
            //     amount: { type: Number, required: true },
            //     image: { type: String, required: true },
            //     price: { type: Number, required: true },
            //     discount: { type: Number },
            //     product: {
            //         type: mongoose.Schema.Types.ObjectId,
            //         ref: 'Product',
            //         required: true,
            //     },
            // },
            const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id) 
            if((orderRedux?.amount + numProduct) <= orderRedux?.countInStock || (!orderRedux && productDetails?.countInStock > 0)) {
                dispatch(addOrderProduct({
                    orderItem: {
                        name: productDetails?.name,
                        amount: numProduct,//số lượng
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                        discount: productDetails?.discount,//mã giảm giá
                        countInStock: productDetails?.countInStock//số lượng trong kho
                    }
                }))
            }else {
                setErrorLimitOrder(true)
            }
        }
    }

  return (
    <Loading isLoading={isLoading}>
        <Row style={{padding:'16px', background:'#fff',borderRadius:"4px"}}>
            <Col span={10} style={{ borderRight:"1px solid #e5e5e5",paddingRight:"8px"}}>
                <Image src={productDetails?.image} alt="image product" preview={false}/>
                {/* <Row style={{paddingTop:"10px"}}>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={ImageProductSmall} alt="image small" preview={false} />
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={ImageProductSmall} alt="image small" preview={false} />
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={ImageProductSmall} alt="image small" preview={false} />
                    </WrapperStyleColImage>
                    <WrapperStyleColImage span={4}>
                        <WrapperStyleImageSmall src={ImageProductSmall} alt="image small" preview={false} />
                    </WrapperStyleColImage>
                </Row> */}
            </Col>
            <Col span={14} style={{paddingLeft:"10px"}}>
                <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                <div>
                    <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                    <WrapperStyleTextSell> | Da ban 1000+</WrapperStyleTextSell>
                </div>
                <WrapperPriceProduct>
                    <WrapperPriceTextProduct>{convertPice(productDetails?.price)}</WrapperPriceTextProduct>
                </WrapperPriceProduct>
                <WrapperAddressProduct>
                    <span>Giao đến: </span>
                    <span className='address'>{user?.address}</span> - 
                    <span className='change-address'> Đổi Địa Chỉ</span>
                </WrapperAddressProduct>

                <LikeButtonComponent 
                dataHref= {process.env.REACT_APP_IS_LOCAL 
                            ? "https://developers.facebook.com/docs/plugins/" 
                            : window.location.href}/>
                            
                <div style={{margin: '10px 0 20px', padding:'10px 0', borderTop:'1px solid #e5e5e5', borderBottom:'1px solid #e5e5e5 '}}>
                    <div style={{marginBottom:'10px'}}>Số lượng</div>
                    <WrapperQualityProduct>
                        <button style={{border:'none', background:'transparent', cursor:'pointer'}} onClick={() => handleChangeCount('decrease', numProduct === 1)}>
                            <MinusOutlined style={{color: '#000', fontSize: '20px'}} />
                        </button>
                        <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock}  min={1}  value={numProduct} size='small'/>
                        <button style={{border:'none', background:'transparent', cursor:'pointer'}} onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStock)}>
                            <PlusOutlined style={{color: '#000', fontSize: '20px'}} />
                        </button>
                    </WrapperQualityProduct>
                </div>
                <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
                    <div>
                        <ButtonComponent
                            size={40} 
                            styleButton={{
                                background : 'rgb(255, 57, 69)', 
                                height:'48px',width:'220px',
                                border:'none',
                                borderRadius:'4px'
                            }}
                            onClick={handleAddOrderProduct}
                            textbutton={"Chọn mua"}
                            styletextbutton={{color:"#fff",fontSize:"15px",fontWeight:"700"}} 
                        />
                        {errorLimitOrder && <div style={{color:'red'}}>Sản phẩm hết hàng</div>}
                    </div>      
                    <ButtonComponent
                        size={40} 
                        styleButton={{
                            background : '#fff', 
                            height:'48px',
                            width:'220px',
                            border:'1px solid rgb(13, 92, 182)',
                            borderRadius:'4px'
                        }}
                        textbutton={"Mua trả sau"}
                        styletextbutton={{color:"rgb(13, 92, 182)", fontSize:"15px"}} />
                </div>
            </Col>
            <CommentComponent dataHref={process.env.REACT_APP_IS_LOCAL ? 
                                        "https://developers.facebook.com/docs/plugins/comments#configurator" 
                                        : window.location.href} width='1270'/>
        </Row>
    </Loading>
  )
}

export default ProductDetailsComponent