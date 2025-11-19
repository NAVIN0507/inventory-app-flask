

import axios from 'axios';
const Me =async () => {
    const token = localStorage.getItem("token");
    console.log(token);
    
const res = await axios.get("http://127.0.0.1:5000/api/me", {
    headers: {
        Authorization: `Bearer ${token}`
    }
});


  return (
    <div>
    <p>Hi </p>
    </div>
  )
}

export default Me