import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function AdminPanel() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📥 الرسائل المستلمة</h1>
      {messages.length === 0 ? (
        <p className="text-gray-500">لا توجد رسائل حالياً.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="p-4 border rounded shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-indigo-700">{msg.nickname}</span>
                <span className="text-sm text-gray-400">
                  {msg.createdAt?.toDate().toLocaleString()}
                </span>
              </div>
              <p className="text-gray-800">{msg.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
    