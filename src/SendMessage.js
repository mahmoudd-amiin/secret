import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function SendMessage() {
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState(localStorage.getItem("nickname"));

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "messages"), {
        nickname,
        message,
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="text-center mt-6">
      <h2 className="text-xl font-semibold mb-4">أرسل رسالتك</h2>
      <form onSubmit={handleSendMessage}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 border rounded-md mb-4 w-full"
          placeholder="اكتب رسالتك هنا..."
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
          إرسال
        </button>
      </form>
    </div>
  );
}

export default SendMessage;
    