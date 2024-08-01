import React, { useEffect, useState } from 'react'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'

const FoodTypePage = () => {
//   const searchProduct = useSelector((state) => state?.product?.search)
//   const searchDebounce = useDebounce(searchProduct, 500)
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(50)
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

  const {isLoading, data: products, isPreviousData} = useQuery(['products', limit], fetchProductAll, { retry: 0, retryDelay: 0, keepPreviousData: true})

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  return (
    <Loading isLoading={isLoading || loading}>
        <div className='body' style={{width:'100%', backgroundColor:'#efefef', paddingBottom: "20px"}}>
            <div id="container" style={{ height:'auto', maxWidth:'1080px', margin:'0 auto'}}>
                    {typeProduct.map((item) => {
                        return (
                        <>
                            <h1 style={{marginTop: "60px"}}>{item}</h1>
                            <div>
                                <WrapperProducts>
                                    {products?.data?.map((product) => {
                                    return (
                                        <>                           
                                        {product.type === item ? (              
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
                                        ) : null}
                                        
                                        </>
                                    )
                                    })}  
                                </WrapperProducts>
                            </div> 
                        </>
                        )
                    })} 
            </div>
        </div>
    </Loading>
  )
}

export default FoodTypePage