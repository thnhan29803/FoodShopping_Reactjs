import React, { useEffect, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1  from '../../assets/images/Slider1.jpg'
import slider2  from '../../assets/images/Slider2.jpg'
import slider3  from '../../assets/images/Slider3.jpg'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'
import FoodTypePage from '../FoodTypePages/FoodTypePages'

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(12)
  const [typeProduct, setTypeProduct] = useState([])

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
      return res
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if(res?.status === 'OK'){
      setTypeProduct(res?.data)
    }
  }

  const {isLoading, data: products, isPreviousData} = useQuery(['products', limit, searchDebounce], fetchProductAll, { retry: 3, retryDelay: 1000, keepPreviousData: true})
  
  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  return (
    <Loading isLoading={isLoading || loading}>
      <div style={{ width:'1270px', margin:'0 auto' }}>
        <WrapperTypeProduct>
          {typeProduct.map((item) => {
            return (
              <TypeProduct name={item} key={item} />
            )
          })}
        </WrapperTypeProduct>
      </div>
      <div className='body' style={{width:'100%', backgroundColor:'#efefef'}}>
        <div id="container" style={{ height:'auto', width:'1270px', margin:'0 auto'}}>
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
          <WrapperProducts>
            {products?.data?.map((product) => {
              return (
                <CardComponent 
                  key={product._id} 
                  countInStock={product.countInStock} 
                  description={product.description} 
                  image={product.image} 
                  name={product.name}
                  price={product.price}     
                  rating={product.rating}
                  type={product.type}   
                  selled={product.selled}
                  discount={product.discount} 
                  id={product._id}
                />
              )
            })}
          </WrapperProducts>
          <div style={{width:'100%', display:'flex', justifyContent:'center', marginTop:'10px'}}>
            <WrapperButtonMore 
            textbutton={isPreviousData ? 'Load more' : "Xem thêm"} type="outline" 
            styleButton={{ 
              border:'1px solid rgb(288, 0, 43)', color: `${products?.total === products?.data?.length ? '#ccc' : 'rgb(288, 0, 43)'}`, 
              width:'240px', height:'38px', borderRadius:'4px'}}
            disabled={products?.total === products?.data?.length || products?.totalPage === 1} 
            styletextbutton={{fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }} 
            onClick = {() => setLimit((prev) =>  prev + 6)}
            />
          </div>  
          <FoodTypePage/>     
        </div>
      </div>
    </Loading>
  )
}

export default HomePage
