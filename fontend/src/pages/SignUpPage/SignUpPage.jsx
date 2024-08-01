import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import imageLogo from "../../assets/images/logo-login.png"
import { Image } from 'antd'
import { useNavigate } from 'react-router-dom'
import { EyeFilled,  EyeInvisibleFilled } from '@ant-design/icons'
import * as UserService from '../../services/UserService'
import { useMutationhooks } from '../../hooks/useMutationHooks'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/message'

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }

  const mutation = useMutationhooks(
    data => UserService.signupUser(data)
 )
  const { data, isLoading, isSuccess, isError } = mutation

  useEffect(() => {//tạo nó một cái message trên compennt gắn vào sign up 
    if(isSuccess && data?.status !== 'ERR'){//Nếu đăng ký thành công sẽ trả về cái trang Sign In
      message.success('Bạn đã đăng ký thành công')
      handleNavigateSignIn()
    }else if(isError){
      message.error()
    }
  }, [isSuccess, isError])

  const handleOnchangePassword = (value) => {
    setPassword(value)
  }

  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value)
  }

  const navigate = useNavigate()
  const handleNavigateSignIn = () => {
    navigate('/sign-in')
  }

  const handleSignUp = () => {
      mutation.mutate({email, password, confirmPassword})
  } 
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',background:'#ccc',height:'100vh'}}>
      <div style={{ width:'800px', height:'445px',borderRadius:'6px',background:'#fff',display:'flex'}}>
        <WrapperContainerLeft>
          <h1>Xin Chào</h1>
          <p>Đăng nhập vào tài khoản</p>
          <InputForm style={{marginBottom:'10px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail}/>

          <div style={{position:'relative',marginBottom:'10px'}} >
           <span onClick={() => setIsShowPassword(!isShowPassword)}
              style={{zIndex:'10',position:'absolute', top:'4px',right:'8px', paddingTop:'5px'}}>
              {isShowPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)}
            </span>
            <InputForm placeholder="password" type={isShowPassword ? "text" : "password"} value={password} onChange={handleOnchangePassword}/>
          </div>
          
          <div style={{position:'relative'}}>
            <span onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{zIndex:'10',position:'absolute', top:'4px',right:'8px', paddingTop:'5px'}}>
              {isShowConfirmPassword ? (<EyeFilled />) : (<EyeInvisibleFilled />)}
            </span>
            <InputForm placeholder="ConfirmPassword" type={isShowConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={handleOnchangeConfirmPassword}/>
          </div>
          
          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}

          <Loading isLoading={isLoading}>
            <ButtonComponent
                  disabled={!email.length || !password.length || !confirmPassword.length}
                  onClick={handleSignUp}
                  size={40} 
                  styleButton={{background : 'rgb(255, 57, 69)', height:'48px',width:'100%',border:'none',borderRadius:'4px', margin:'26px 0 10px'}}
                  textbutton={"Đăng ký"}
                  styletextbutton={{color:"#fff",fontSize:"15px",fontWeight:"700"}} />
          </Loading>
            <p><WrapperTextLight>Quên Mật Khẩu?</WrapperTextLight></p>
            <p>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}>Đăng Nhập</WrapperTextLight></p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
            <Image  src={imageLogo} preview={false} alt='image-logo' height="203px" width="203px"/>
            <h4>Mua Đồ Ăn Tại Leafstore</h4>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignUpPage
