import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import { Navigate, Route, Routes } from "react-router-dom";
import Me from './me';

function App() {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: ""
  });
  const [msg, setMsg] = useState("");
  const [userData, setuserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/getallusers")
        setuserData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const submit = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/v1/register", {
        name: userDetails.name,
        email: userDetails.email,
        password: userDetails.password
      });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.error || "Error occurred");
    }
  };

  const onLogin = async() => {
    try {
        const res = await axios.post("http://127.0.0.1:5000/api/login", {
        email: loginDetails.email,
        password: loginDetails.password
      });
localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user)); // optional      
    } catch (error) {
      
    }
  }

  return (
    <div className=''>
      <h2>Register</h2>

      {/* Name */}
      <input
        placeholder="Username"
        value={userDetails.name}
        onChange={(e) =>
          setUserDetails(prev => ({ ...prev, name: e.target.value }))
        }
      />
      <br />

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        value={userDetails.email}
        onChange={(e) =>  
          setUserDetails(prev => ({ ...prev, email: e.target.value }))
        }
      />
      <br />

      {/* Password */}
      <input
        placeholder="Password"
        type="password"
        value={userDetails.password}
        onChange={(e) =>
          setUserDetails(prev => ({ ...prev, password: e.target.value }))
        }
      />
      <br />

      <button onClick={submit}>Register</button>

      <p>{msg}</p>

      <h2>All Users</h2>
      {userData ? (
        <ul>
          {userData.map((user) => (
            <li key={user.user_id} style={{ color: "white" }}>
              {user.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading users...</p>
      )}


      <hr />
        <h2>Login</h2>

      {/* Name */}
      <input
        placeholder="Email"
        value={loginDetails.email}
        onChange={(e) =>
          setLoginDetails(prev => ({ ...prev,email: e.target.value }))
        }
      />
      <br />

      {/* Email */}
      <input
        type="password"
        placeholder="Password"
        value={loginDetails.password}
        onChange={(e) =>
          setLoginDetails(prev => ({ ...prev, password: e.target.value }))
        }
      />
      <br />

      {/* Password */}
      <button onClick={onLogin}>Login</button>
      <Routes>
       <Route
            path="/me"
            element={<Me/>}
          />
          </Routes>
    </div>
  );
}

export default App;
