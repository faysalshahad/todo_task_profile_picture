// // import { useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // const Register = () => {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const navigate = useNavigate();

// //   //   const handleRegister = async (e) => {
// //   //     e.preventDefault();
// //   //     try {
// //   //       const res = await axios.post("http://localhost:5000/api/auth/register", {
// //   //         email,
// //   //         password,
// //   //       });
// //   //       alert("Registration successful! Please log in.");
// //   //       navigate("/login");
// //   //     } catch (error) {
// //   //       alert("Error: " + error.response.data.error);
// //   //     }
// //   //   };

// //   const handleRegister = async (userData) => {
// //     try {
// //       const response = await axios.post(
// //         "http://localhost:5000/api/auth/register",
// //         userData,
// //         {
// //           headers: { "Content-Type": "application/json" },
// //           withCredentials: true,
// //         }
// //       );

// //       console.log(" Registration Successful:", response.data);
// //     } catch (error) {
// //       console.error(" Registration Error:", error);

// //       // Debugging the actual response
// //       if (error.response) {
// //         console.error(" Response Data:", error.response.data);
// //         console.error(" Status Code:", error.response.status);
// //       } else if (error.request) {
// //         console.error(" No Response from Server:", error.request);
// //       } else {
// //         console.error(" Error Message:", error.message);
// //       }
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Register</h2>
// //       <form onSubmit={handleRegister}>
// //         <input
// //           type="email"
// //           placeholder="Email"
// //           onChange={(e) => setEmail(e.target.value)}
// //           required
// //         />
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           onChange={(e) => setPassword(e.target.value)}
// //           required
// //         />
// //         <button type="submit">Register</button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Register;

// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   const [name, setName] = useState(""); // Add name field
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault(); // Prevent default form submission

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/register",
//         { name, email, password }, // ✅ Send name too
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );

//       console.log("✅ Registration Successful:", response.data);
//       alert("Registration successful! Please log in.");
//       navigate("/login");
//     } catch (error) {
//       console.error("❌ Registration Error:", error);

//       if (error.response) {
//         console.error("❌ Response Data:", error.response.data);
//         console.error("❌ Status Code:", error.response.status);
//       } else if (error.request) {
//         console.error("❌ No Response from Server:", error.request);
//       } else {
//         console.error("❌ Error Message:", error.message);
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// };

// export default Register;

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      alert("Error: " + error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
