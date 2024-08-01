import React, { useEffect } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import imageLogo from "../../assets/images/logo-login.png"
import  { useState } from 'react' 
import { useLocation, useNavigate } from 'react-router-dom'
import { EyeFilled,  EyeInvisibleFilled } from '@ant-design/icons'
import * as UserService from '../../services/UserService'
import { useMutationhooks } from '../../hooks/useMutationHooks'
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'
import Loading from '../../components/LoadingComponent/Loading'


const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch();

  const navigate = useNavigate()

  const mutation = useMutationhooks(
     data => UserService.loginUser(data)
  )
  const { data, isLoading, isSuccess } = mutation

  useEffect(() => {
    if(isSuccess && data?.status !== 'ERR'){//Nếu đăng nhập thành công chuyển về trang home
      if(location?.state) {
        navigate(location?.state)
      }else {
        navigate('/')
      }
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      if(data?.access_token) {
        const decoded = jwt_decode(data?.access_token)
        if(decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    }
  }, [isSuccess])

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token }))
  }

  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }

  const handleOnchangePassword = (value) => {
    setPassword(value)
  }

  const handleSignIn = () => {  
    mutation.mutate({
      email,
      password
    })
  } 


  
  const handleNavigateSignUp = () => {
    navigate('/sign-up')
  }
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',background:'#ccc',height:'100vh'}}>
      <div style={{ width:'800px', height:'445px',borderRadius:'6px',background:'#fff',display:'flex'}}>
        <WrapperContainerLeft>
          <h1>Xin Chào</h1>
          <p>Đăng nhập vào tài khoản</p>
          <InputForm style={{marginBottom:'10px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail}/>
          <div style={{position:'relative'}}>
            <span onClick={() => setIsShowPassword(!isShowPassword)}
              style={{zIndex:'10',position:'absolute', top:'4px',right:'8px', paddingTop:'5px'}}>
              {isShowPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)}
            </span>
            <InputForm placeholder="password" type={isShowPassword ? "text" : "password"} value={password} onChange={handleOnchangePassword}/>
          </div>

          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
          
          <Loading isLoading={isLoading}> 
            <ButtonComponent
                    disabled={!email.length || !password.length }
                    onClick={handleSignIn}
                    size={40} 
                    styleButton={{background : 'rgb(255, 57, 69)', height:'48px',width:'100%',border:'none',borderRadius:'4px', margin:'26px 0 10px'}}
                    textbutton={"Đăng Nhập"}
                    styletextbutton={{color:"#fff",fontSize:"15px",fontWeight:"700"}} />
          </Loading>
              <p><WrapperTextLight>Quên Mật Khẩu?</WrapperTextLight></p>
              <p>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperTextLight></p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
            <Image  src={imageLogo} preview={false} alt='image-logo' height="203px" width="203px"/>
            <h4>Mua Đồ Ăn Tại Leafstore</h4>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignInPage
