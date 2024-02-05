"use client"

import { useState } from "react";

// for successful login, use the user object:
// {
//   "email": "eve.holt@reqres.in",
//   "password": "cityslicka"
// }

const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const requestUrl = 'https://reqres.in/api/login';

export default function LoginScreen() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [isEmailClean, setIsEmailClean] = useState(true)
  const [isPasswordClean, setIsPasswordClean] = useState(true)

  const [errMessage, setErrMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('prokeep-login') ? true : false)

  const passwordError = password.length < 1;
  const emailError = !validRegex.test(email)
  const btnDisabled = passwordError || emailError || isSubmitting

  const resetForm = () => {
    setEmail("")
    setIsEmailClean(true)

    setPassword("")
    setIsPasswordClean(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    localStorage.removeItem('prokeep-login')
    setIsSubmitting(true)

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (data.error) {
      setErrMessage(data.error)
    } else {
      localStorage.setItem('prokeep-login', data.token)
      setIsLoggedIn(true)

      resetForm()
    }

    setIsSubmitting(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('prokeep-login')
    setIsLoggedIn(false)
  }

  if (isLoggedIn) {
    return (
      <div className="dark w-full h-screen bg-gray-800 flex items-center justify-center px-2">
        <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-xl overflow-hidden p-6 space-y-4">
          <h2 className="text-base font-bold text-white text-center">You are logged in</h2>
          <button data-testid="logoutBtn" onClick={handleLogout} className="p-2 rounded w-full text-gray-900 bg-white hover:bg-gray-200 cursor-pointer transition">Logout</button>
        </div>
      </div>
    )
  }

  return (
    <div className="dark w-full h-screen bg-gray-800 flex items-center justify-center px-2">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-900 rounded-lg shadow-xl overflow-hidden p-6 space-y-4">
        <h2 className="text-xl font-bold text-white text-center">Login</h2>
        <div className="space-y-2 flex flex-col">
          <label className="text-white" htmlFor="email">
            Email
          </label>
          <input data-testid="emailField" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setIsEmailClean(false)} className="p-2 rounded bg-gray-700 text-white" id="email" placeholder="email@example.com" required type="email" />
          {emailError && !isEmailClean && <p className="text-red-500 text-sm">Please enter a valid email</p>}
        </div>
        <div className="space-y-2 flex flex-col">
          <label className="text-white" htmlFor="password">
            Password
          </label>
          <input data-testid="passwordField" value={password} onChange={e => setPassword(e.target.value)} onBlur={() => setIsPasswordClean(false)} className="p-2 rounded bg-gray-700 text-white" id="password" required type="password" />
          {passwordError && !isPasswordClean && <p className="text-red-500 text-sm">Please enter a password</p>}
        </div>
        <button data-testid="submitBtn" disabled={btnDisabled} className={`p-2 rounded w-full text-gray-900 ${btnDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-200 cursor-pointer '} transition`}>Sign in</button>
        {errMessage && <p className="text-red-500 text-sm">{errMessage}</p>}
      </form>
    </div>
  )
}

