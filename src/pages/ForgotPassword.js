import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ForgotPassword.css';

const auth = getAuth(app);

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); 

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setLoading(true); 

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
      setEmail(''); 
    } catch (error) {
      console.error(error);

      if (error.code === 'auth/user-not-found') {
        toast.error('هذا البريد الإلكتروني غير مسجل لدينا');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('البريد الإلكتروني غير صالح');
      } else {
        toast.error('حدث خطأ أثناء إرسال رابط استعادة كلمة المرور: ' + error.message);
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>نسيت كلمة المرور</h2>
      <form onSubmit={handlePasswordReset}>
        <input
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading} 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
        </button>
      </form>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
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

export default ForgotPassword;
