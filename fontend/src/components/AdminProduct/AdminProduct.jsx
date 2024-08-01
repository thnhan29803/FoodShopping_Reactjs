import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Select, Space } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64, renderOptions } from '../../utils'
import * as ProductService from '../../services/ProductService'
import { useMutationhooks } from '../../hooks/useMutationHooks'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'


const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const [typeSelect, setTypeSelect] = useState('')
  const user = useSelector((state) => state?.user)
  const searchInput = useRef(null);
  const initial = () => ({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
    newType: '',
    discount: ''
  })

  const [stateProduct, setStateProduct] = useState(initial())
  const [stateProductDetails, setStateProductDetails] = useState(initial())

  const [form] = Form.useForm();

  const mutation = useMutationhooks(
    (data) => {
        const { 
          name, 
          price, 
          description, 
          rating, image, 
          type, 
          countInStock, discount } = data
       const res = ProductService.createProduct({
          name, 
          price, 
          description, 
          rating, 
          image, 
          type, 
          countInStock,
          discount
        })
        return res;
    } 
  )


  const mutationUpdate = useMutationhooks(
    (data) => {
        const { 
          id, 
          token, 
         ...rests } = data
       const res = ProductService.updateProduct(
          id, 
          token, 
          { ...rests })
        return res;
    },
  )
  
  const mutationDelete = useMutationhooks(
    (data) => {
        const { 
          id, 
          token} = data
       const res = ProductService.deleteProduct(
          id, 
          token)
        return res;
    },
  )

  const mutationDeleteMany = useMutationhooks(
    (data) => {
        const { token, ...ids
        } = data
       const res = ProductService.deleteManyProduct(
          ids, 
          token)
        return res;
    },
  )

  const getAllProduct = async () => {
    const res = await ProductService.getAllProduct()
    return res
  }

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected)
    if(res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount
      })
    }
    setIsLoadingUpdate(false)
  }
  
  useEffect(() => {
    if(!isModalOpen) {
      form.setFieldsValue(stateProductDetails)
    }else {
      form.setFieldsValue(initial())
    }
  }, [form, stateProductDetails, isModalOpen])

  useEffect(() => {
    if(rowSelected && isOpenDrawer){
      setIsLoadingUpdate(true)
      fetchGetDetailsProduct(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)
  }

  const handleDeleteManyProduct = (ids) => {
    mutationDeleteMany.mutate({ ids: ids, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }

  const { data, isLoading, isSuccess, isError } = mutation
  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
  const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany
  
  const queryProduct = useQuery({queryKey: ['products'],queryFn : getAllProduct})
  const typeProduct = useQuery({queryKey: ['type-product'],queryFn : fetchAllTypeProduct})
  const { isLoading : isLoadingProducts, data : products } = queryProduct
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{color:'red', fontSize:'30px', cursor:'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
        <EditOutlined style={{color:'blue', fontSize:'30px', cursor:'pointer'}} onClick={handleDetailsProduct}/>
      </div>
    )
  }


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: '>= 50',
          value: '>=',
        },
        {
          text: '<= 50',
          value: '<=',
        }
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return record.price >= 50
        }
        return record.price <= 50
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: '>= 3',
          value: '>=',
        },
        {
          text: '<= 3',
          value: '<=',
        }
      ],
      onFilter: (value, record) => {
        if (value === '>=') {
          return Number(record.rating) >= 3
        }
        return Number(record.rating) <= 3
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
  ];
  const dataTable = products?.data?.length && products?.data?.map((products) => {
    return {...products, key: products._id}
  })

  useEffect(() => {
    if(isSuccess && data?.status === 'OK'){
      message.success()
      handleCancel()
    }else if (isError){
      message.error()
    }
  }, [isSuccess])

  useEffect(() => {
    if(isSuccessDeletedMany && dataDeletedMany?.status === 'OK'){
      message.success()
    }else if (isErrorDeletedMany){
      message.error()
    }
  }, [isSuccessDeletedMany])

  useEffect(() => {
    if(isSuccessDeleted && dataDeleted?.status === 'OK'){
      message.success()
      handleCancelDelete()
    }else if (isErrorDeleted){
      message.error()
    }
  }, [isSuccessDeleted])

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStock: '',
      discount: ''
    })
    form.resetFields()
  }

  useEffect(() => {
    if(isSuccessUpdated && dataUpdated?.status === 'OK'){
      message.success()
      handleCloseDrawer()
    }else if (isErrorUpdated){
      message.error()
    }
  }, [isSuccessUpdated])

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }


  const handleDeleteProduct = () => {
    mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: '',
      price: '',
      description: '',
      rating: '',
      image: '',
      type: '',
      countInStock: '',
      discount: '',
    })
    form.resetFields()
  }

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.countInStock,
    }
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeAvatar = async ({fileList}) => {
    const file = fileList[0]
    if(!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview
    })
  }

  const handleOnchangeAvatarDetails = async ({fileList}) => {
    const file = fileList[0]
    if(!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview
    })
  }

  const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails}, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleChangeSelect = (value) => {
      setStateProduct({
        ...stateProduct,
        type: value
      })

  }

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{marginTop:'10px'}}>
        <Button style={{height:'150px', width:'150px', borderRadius:'6px',borderStyle:'dashed'}} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{fontSize:'60px'}}/></Button>
      </div>
      <div style={{marginTop:'20px'}}>
            <TableComponent handleDeleteMany={handleDeleteManyProduct} columns={columns} isLoading={isLoadingProducts} data={dataTable} onRow={(record, rowIndex) => {
              return {
              onClick: event => {
                setRowSelected(record._id)
              } 
            };
          }}/>    
      </div>
      <ModalComponent forceRender title="Tạo Sản Phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Loading isLoading={isLoading}>
          <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <InputComponent  value={stateProduct['name']} onChange={handleOnchange} name="name"/>
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Please input your type!' }]}
          >
            <Select 
              name="type"
              value={stateProduct.type}
              onChange={handleChangeSelect}
              options={renderOptions(typeProduct?.data?.data)}
            />
          </Form.Item>
          
          {stateProduct.type === 'add_type' && (
            <Form.Item
            label='New type'
            name="newType"
            rules={[{ required: true, message: 'Please input your type!' }]}
          >
            <InputComponent  value={stateProduct.newType} onChange={handleOnchange} name="newType"/>
          </Form.Item>
          )}
         
          <Form.Item
            label="Count inStock"
            name="countInStock"
            rules={[{ required: true, message: 'Please input your count inStock!' }]}
          >
            <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock"/>
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please input your price!' }]}
          >
            <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price"/>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input your description!' }]}
          >
            <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description"/>
          </Form.Item>

          <Form.Item
            label="Rating"
            name="rating"
            rules={[{ required: true, message: 'Please input your rating!' }]}
          >
            <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating"/>
          </Form.Item>  

          <Form.Item
            label="Discount"
            name="discount"
            rules={[{ required: true, message: 'Please input your discount of product!' }]}
          >
            <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount"/>
          </Form.Item>  

          <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Please input your image!' }]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                <Button>Flied chooses</Button>
                {stateProduct?.image && (
                            <img src={stateProduct?.image} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginLeft: '10px',
                                marginBottom:'-35px'
                            }} alt='avatar'/>
                        )}
              </WrapperUploadFile>
          </Form.Item> 

          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='90%'>
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
          <Form
          name="basic"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          onFinish={onUpdateProduct}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <InputComponent  value={stateProductDetails['name']} onChange={handleOnchangeDetails} name="name"/>
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Please input your type!' }]}
          >
            <InputComponent  value={stateProductDetails.type} onChange={handleOnchangeDetails} name="type"/>
          </Form.Item>
          
          <Form.Item
            label="Count inStock"
            name="countInStock"
            rules={[{ required: true, message: 'Please input your count inStock!' }]}
          >
            <InputComponent value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock"/>
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please input your price!' }]}
          >
            <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price"/>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input your description!' }]}
          >
            <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description"/>
          </Form.Item>

          <Form.Item
            label="Rating"
            name="rating"
            rules={[{ required: true, message: 'Please input your rating!' }]}
          >
            <InputComponent value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating"/>
          </Form.Item> 
          
          <Form.Item
            label="Discount"
            name="discount"
            rules={[{ required: true, message: 'Please input your discount of product!' }]}
          >
            <InputComponent value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount"/>
          </Form.Item> 
        
          <Form.Item
              label="Image"
              name="image"
              rules={[{ required: true, message: 'Please input your image!' }]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                <Button>Flied chooses</Button>
                {stateProductDetails?.image && (
                            <img src={stateProductDetails?.image} style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginLeft: '10px',
                                marginBottom:'-35px'
                            }} alt='avatar'/>
                        )}
              </WrapperUploadFile>
          </Form.Item> 

          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Apply
            </Button>
          </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
      <ModalComponent forceRender title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa sản phẩm này không?</div>                  
        </Loading>
      </ModalComponent>
    </div>
  )
}

export default AdminProduct