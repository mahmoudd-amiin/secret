import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import ReCAPTCHA from 'react-google-recaptcha';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import './Register.css'; 

const auth = getAuth(app);

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      toast.error('جميع الحقول مطلوبة');
      return;
    }

    if (password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
      return;
    }

    if (!captchaValue) {
      toast.error('يجب التحقق من أنك لست روبوتًا');
      return;
    }

    try {
      toast.info('جاري إنشاء الحساب...');

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      toast.success('تم إنشاء الحساب بنجاح! سيتم تحويلك خلال لحظات...');

      setTimeout(() => {
        navigate("/");
      }, 7000); 

    } catch (error) {
      toast.error('حدث خطأ أثناء إنشاء الحساب: ' + error.message);
      console.error(error);
    }
  };

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  return (
    <div className="register-container">
      <h2>تسجيل حساب جديد</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="الاسم"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <ReCAPTCHA
          sitekey="6LeD7iUrAAAAAOs2-cdQfQ1l_PUmXjOMOIAEiaWv" 
          onChange={onCaptchaChange}
        />

        <button type="submit">تسجيل</button>
      </form>

      <ToastContainer
        position="top-center" 
        autoClose={6000} 
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl 
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" 
      />
    </div>
  );
}

export default Register;
