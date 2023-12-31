import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import axios from "axios";
import { useUserLoginMutation } from "../services/Post";
function Login() {
  const [loginData, res] = useUserLoginMutation();
  console.log("resp login", res);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (res.isSuccess) {
      localStorage.setItem("loginId", res.data?.results?.verifyUser?._id);
      localStorage.setItem("token", res.data?.results?.token);
      localStorage.setItem(
        "userName2",
        res.data?.results?.verifyUser?.userName
      );
      localStorage.setItem(
        "userLoginEmail",
        res.data?.results?.verifyUser?.userEmail
      );
      Swal.fire({
        title: "Login Successful!",
        icon: "success",
        text: "You have successfully logged in.",
        showConfirmButton: false,
        timer: 500,
      }).then(() => {
        navigate("/dashboard");

        window?.location?.reload();
      });
    } else if (res.isError && res.error?.data?.error) {
      Swal.fire({
        title: "Incorrect Password!",
        icon: "error",
        text: res.error?.data?.message || "Unknown error occurred.",
      });
    }
  }, [res, navigate]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setUserNameError("");
    setPasswordError("");

    if (userName.trim() === "") {
      setUserNameError("Username is required.");
      return;
    }

    if (password.trim() === "") {
      setPasswordError("Password is required.");
      return;
    }

    try {
      const response = await loginData({
        userName: userName,
        password: password,
      });
      console.log("response login", response);

      if (response.data.error) {
        const errorMessage = response.data.message;

        let alertTitle, alertText;

        if (errorMessage === "userName is Incorrect") {
          alertTitle = "Incorrect Username!";
          alertText = "Please check your username.";
        } else if (errorMessage === "User Password is Incorrect") {
          alertTitle = "Incorrect Password!";
          alertText = "Please check your password.";
        } else {
          alertTitle = "Login Failed!";
          alertText = "An error occurred during login.";
        }

        Swal.fire({
          title: alertTitle,
          icon: "error",
          text: alertText,
        });
      } else {
        Swal.fire({
          title: "Login Successful!",
          icon: "success",
          text: "You have successfully logged in.",
          showConfirmButton: false,
          timer: 500,
        }).then(() => {
          navigate("/dashboard");
          window?.location?.reload();
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      Swal.fire({
        title: "Login Failed!",
        icon: "error",
        text: "An error occurred during login.",
      });
    }
  };

  return (
    <>
      <section className="login_page">
        <div className="container-fluid px-0">
          <div className="row justify-content-start">
            <div className="col-4">
              <div className="login_page_form shadow">
                <div className="row">
                  <div className="col-12 formheader mb-4">
                    <div className="text-center">
                      <img src={require("../asset/img/logo.png")} alt="" />
                      {/* <img src="../assets/img/logo.png" alt="" /> */}
                    </div>
                    <h1>Login for Admin </h1>
                    <p>Please enter your email and password</p>
                  </div>
                  <div className="col-12">
                    <form className="row form-design">
                      <div className="form-group col-12">
                        <label htmlFor="userEmail">User Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="User@gmail.com"
                          name="userEmail"
                          id="userEmail"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                        {userNameError && (
                          <span className="error-message text-danger">
                            {userNameError}
                          </span>
                        )}
                      </div>
                      <div className="form-group col-12">
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="**********"
                          name="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && (
                          <span className="error-message text-danger">
                            {passwordError}
                          </span>
                        )}
                      </div>
                      <div className="form-group col-12">
                        <Link className="for_got" to="/forget-password">
                          Forgot Password?
                        </Link>
                      </div>
                      <Link to="#">
                        <div className="form-group col-12">
                          <button
                            type="submit"
                            className="comman_btn"
                            onClick={handleSaveChanges}
                          >
                            <span>Submit</span>
                          </button>
                        </div>
                      </Link>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
