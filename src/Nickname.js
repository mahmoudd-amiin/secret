import { useState } from "react";

function Nickname({ onSet }) {
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("nickname", nickname);
    onSet(nickname);
  };

  return (
    <div className="text-center mt-6">
      <h2 className="text-xl font-semibold mb-4">اختر اسم مستعار</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="p-2 border rounded-md mb-4"
          placeholder="أدخل اسمك المستعار"
        />
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md">
          تأكيد
        </button>
      </form>
    </div>
  );
}

export default Nickname;
    