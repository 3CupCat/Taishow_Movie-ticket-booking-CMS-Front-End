import React, {useState} from 'react'
import './loginpage.css'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const[account, setAccount] = useState('');;
  const[passwd, setPasswd] = useState('');
  const[loading, setLoading] = useState(false);
  const navigate = useNavigate(); //注意放置的位置

  const handleAccountChange = (e) => {
    setAccount(e.target.value)
  }
  const handlePasswdChange = (e) => {
    setPasswd(e.target.value)
  }

  // 注意body的寫法
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginURL = 'http://localhost:8080/permission/login';
    try {
      const res = await fetch(loginURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: account,
          passwd: passwd,
        }),
        credentials: 'include',
      });
      
      // read response test 作為 token => 設置token
      if(res.ok){
        const token = await res.text();
        Cookies.set('token', token, {expires: 1});

        setTimeout(() => {
          setLoading(false);
          const redirectTo = location.state?.from?.pathname || '/movies';
          navigate(redirectTo);
        }, 1000);
        console.log('登入成功');
      }else {
        console.log('登入失敗', res.statusText);
      }

    } catch (error) {
      console.error('錯誤 ', error);
    }
  }

  return (
    <section>
      <form method='post' className='login-box'>
        <h2 className='login-signin'>員工登入</h2>
        <div className='input-box'>
          <span className='icon'><ion-icon name="person"></ion-icon></span>
          <input type="text" value={account} onChange={handleAccountChange} required/>
          <label htmlFor="account">帳號</label>
        </div>

        <div className='input-box'>
          <span className='icon'><ion-icon name="lock-closed"></ion-icon></span>
          <input type="password" value={passwd} onChange={handlePasswdChange} required/>
          <label htmlFor="passwd">密碼</label>
        </div>

        <button className='login-btn' onClick={handleSubmit}>登入</button>

        <div className='register-link'>
          <p>尚未有權限？<a href="#">申請</a></p>
        </div>
      
      </form>
    </section>
  )
}

export default LoginPage