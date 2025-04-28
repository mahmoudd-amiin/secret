import { useEffect } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        onLogin(user);
      }
    });

    return unsubscribe;
  }, [onLogin]);

  return (
    <div className="text-center mt-6">
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        تسجيل الدخول باستخدام Google
      </button>
    </div>
  );
}

export default Login;
    