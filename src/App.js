import React, { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged,signInWithEmailAndPassword } from 'firebase/auth';
import { app } from './firebase'; 
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query } from 'firebase/firestore';
import { db,analytics} from './firebase'; 
import './App.css';
import { signOut } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore"; 
import { Link, Routes, Route } from 'react-router-dom';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Register from './pages/Register'; 
import ForgotPassword from './pages/ForgotPassword'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logEvent } from "firebase/analytics";

function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link to="/privacypolicy" className="hover:text-gray-300">سياسة الخصوصية</Link>
          </li>
          <li>
            <Link to="/termsofuse" className="hover:text-gray-300">شروط الاستخدام</Link>
          </li>
          <li>
            <Link to="/" className="hover:text-gray-300">الرئيسية</Link>
          </li>
        </ul>
      </nav>
      <div className="text-xl font-bold">
        <Link to="/" className="text-white">
          <img src="/secret.png" alt="شعار الموقع" className="h-8" />
        </Link>
      </div>
    </header>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showPassword, setShowPassword] = useState(false); 
  const [password, setPassword] = useState('');
  const [switchOn, setSwitchOn] = useState(false); 
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedMessage, setSelectedMessage] = useState(null); 
  const [email,setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(true); 


  const maxCharCount = 500;
  const auth = getAuth(app);
  const adminEmail = "adham.gh1111@gmail.com"; 


  const handleLogin = async () => {
    try {
      if (!email.trim()) {
        toast.error("من فضلك أدخل البريد الإلكتروني");
        return;
      }
  
      if (!password) {
        toast.error("من فضلك أدخل كلمة المرور");
        return;
      }
  
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast.success("تم تسجيل الدخول بنجاح!");
    } catch (err) {
      console.error("خطأ أثناء تسجيل الدخول: ", err.code);
      switch (err.code) {
        case 'auth/invalid-email':
          toast.error("البريد الإلكتروني غير صالح.");
          break;
        case 'auth/user-not-found':
          toast.error("البريد الإلكتروني غير موجود.");
          break;
        case 'auth/wrong-password':
          toast.error("كلمة المرور غير صحيحة.");
          break;
        default:
          toast.error("حدث خطأ غير معروف أثناء تسجيل الدخول.");
      }
    }
  };
  
  
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      alert("حدث خطأ أثناء تسجيل الدخول باستخدام جوجل");
      console.error(err);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("هل أنت متأكد من تسجيل الخروج؟");
  
    if (confirmLogout) {
      signOut(auth)
        .then(() => console.log("تم تسجيل الخروج"))
        .catch((error) => console.error("خطأ:", error));
    } else {
      console.log("تم إلغاء عملية تسجيل الخروج");
    }
  };

const sanitizeMessage = (message) => {
  const div = document.createElement('div');
  div.textContent = message;
  return div.innerHTML;
};

const handleSendMessage = async (e) => {
  e.preventDefault(); 

  if (!user) return alert("يجب تسجيل الدخول أولاً!");
  if (!nickname.trim() || !message.trim()) return alert("يرجى ملء جميع الحقول!");

  const safeNickname = sanitizeMessage(nickname);
  const safeMessage = sanitizeMessage(message);

  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      nickname: safeNickname,
      message: safeMessage,
      uid: user.uid,
      createdAt: serverTimestamp()
    });

    console.log("تم إرسال الرسالة بنجاح: ", docRef.id); 
    setSent(true);
    setMessage('');
    setNickname('');
  } catch (error) {
    alert("حدث خطأ أثناء إرسال الرسالة");
    console.error(error);
  }
};


  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleSwitch = () => {
    setSwitchOn(!switchOn);

    if (!switchOn) {
      alert("جميع معلوماتك سرية الان");
    } else {
      alert("سيتم الان إظهار معلوماتك الشخصية ");
    }
  };

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    if (newMessage.length <= maxCharCount) {
      setMessage(newMessage);
      setCharCount(newMessage.length); 
    }
  };
  const handleDeleteMessage = async (id) => {
    const confirmDelete = window.confirm("هل تريد حذف هذه الرسالة؟");
  
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "messages", id));
        setMessages(messages.filter((msg) => msg.id !== id)); 
        alert("تم حذف الرسالة بنجاح");
      } catch (error) {
        console.error("خطأ أثناء الحذف:", error);
        alert("حدث خطأ أثناء حذف الرسالة");
      }
    }
  };
  const handleShowDetails = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };
    
  

  useEffect(() => {
    logEvent(analytics, 'page_view');
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAdmin(currentUser?.email === adminEmail);
      setLoading(false);
  
      if (!currentUser) {
        setShowPopup(true);   
      } else {
        setShowPopup(false);
  
        logEvent(analytics, 'user_login', {
          user_email: currentUser?.email || "unknown",
        });
        
      }
    });
  
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (isAdmin) {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(fetchedMessages);
        setMessages(fetchedMessages);
        setShowPopup(true);
      }
    };
  
    fetchMessages();
  }, [isAdmin, auth]);
  if (loading) {
    return <div> </div>; 
  }


  const closePopup = () => {
    setShowPopup(false);  
  };


  return (
    <>
      <Header />
      <div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
          <h2> Mahmoud أرسل رسالة مجهولة إلي</h2>
            <p>نحن سعداء بزيارتك ! إذا كنت بحاجة إلى مساعدة، لا تتردد في الاتصال بنا.</p>
            <button className="close-btn" onClick={closePopup}>إغلاق</button>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/termsofuse" element={<TermsOfUse />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} /> 
        <Route path="/" element={loading ? <div>جاري التحميل...</div> : (
          <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-center">
              {user && isAdmin && (
                <div className="text-right mb-4">
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              )}

              {!user ? (
                <div className="space-y-8">
                  <div className="border p-4 rounded-xl shadow-sm">
                    <h2 className="text-lg font-bold mb-4">تسجيل الدخول</h2>

                    <input
                       type="email"
                       className="input-email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="أدخل بريدك الإلكتروني"
                       />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="كلمة المرور"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                    />
                    <div className="checkbox-container">
                      <label htmlFor="showPassword" className="checkbox-label">عرض كلمة المرور</label>
                      <input
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={togglePassword}
                      />
                    </div>
                    <button 
                            onClick={handleLogin} disabled={loading}
                            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 w-full">
                             تسجيل الدخول 
                    </button>
                    <div className="register-prompt">
                       <p><span className="text-black">ليس لديك حساب؟ </span>
                          <Link to="/register" className="register-link text-blue-600 hover:text-blue-800">
                           سجل حسابك الآن
                          </Link>
                       </p>
                      </div>
                      <p>
  <Link to="/forgotpassword">هل نسيت كلمة المرور؟</Link>
</p>
                  </div>
                  <div className="border p-4 rounded-xl shadow-sm">
                    <h2 className="text-lg font-bold mb-4">تسجيل دخول مباشر</h2>
                    <button
                      onClick={handleGoogleLogin}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 w-full flex items-center justify-center space-x-2"
                    >
                      <i className="fab fa-google"></i>
                      <span>تسجيل الدخول بحساب جوجل</span>
                    </button>
                  </div>
                </div>
              ) : isAdmin ? (
                <div>
                  <h2 className="text-lg font-semibold mb-2">📨 جميع الرسائل</h2>
                  <div className="messages-container">
                    <h2>جميع الرسائل</h2>
                    <table className="messages-table">
                      <thead>
                        <tr>
                          <th>الاسم</th>
                          <th>الرسالة</th>
                          <th>التاريخ</th>
                          <th>التفاصيل</th>
                          <th>حذف</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((msg) => (
                          <tr key={msg.id}>
                            <td>{msg.nickname}</td>
                            <td>{msg.message.substring(0, 50)}...</td>
                            <td>{new Date(msg.createdAt.seconds * 1000).toLocaleString()}</td>
                            <td>
                              <button onClick={() => handleShowDetails(msg)} className="details-btn">
                                تفاصيل
                              </button>
                            </td>
                            <td>
                              <button onClick={() => handleDeleteMessage(msg.id)} className="delete-btn">
                                حذف
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {isModalOpen && (
                      <div className="modal-overlay">
                        <div className="modal-content">
                          <h3>تفاصيل الرسالة</h3>
                          <p><strong>الاسم المستعار:</strong> {selectedMessage.nickname}</p>
                          <p><strong>الرسالة كاملة:</strong> {selectedMessage.message}</p>
                          <button onClick={handleCloseModal} className="close-btn">إغلاق</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSendMessage} className="form-container">
                    <h2 className="text-xl font-semibold mb-4">  Mahmoud إرسال رسالة مجهولة .الي </h2>
                    <input
                      type="text"
                      placeholder="اسمك المستعار"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="input-field"
                    />
                    <textarea
                      placeholder="اكتب رسالتك هنا بدون ان يعرفك..."
                      value={message}
                      onChange={handleMessageChange}
                      className="textarea-field"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span>{charCount}/{maxCharCount}</span>
                      {charCount === maxCharCount && <span className="text-red-500">لقد وصلت إلى الحد الأقصى!</span>}
                    </div>
                    <button
                      type="submit"
                      disabled={charCount > maxCharCount}
                      className="submit-button mt-4"
                    >
                      إرسال الرسالة
                    </button>
                    {sent && <p className="text-green-500 mt-3">تم إرسال رسالتك بنجاح ✅</p>}
                    <div className="flex justify-end items-center mt-6">
                      <span className="ml-3 text-lg font-semibold">{switchOn ? "بشكل سري" : "بشكل غير سري"}</span>
                      <label className="switch small">
                        <input type="checkbox" checked={switchOn} onChange={toggleSwitch} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </form>
                  <div className="mt-6">
                    <form onSubmit={handleLogout} className="text-center">
                      <button
                        type="submit"
                        className="w-full px-4 py-2 rounded-xl text-white bg-red-600 hover:bg-red-700"
                      >
                        تسجيل الخروج
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        />
      </Routes>
      <ToastContainer/>
      </div>

    </>
  );
}

export default App;