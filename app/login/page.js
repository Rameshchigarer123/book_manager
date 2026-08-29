"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(false);

    try{
        const response=await fetch("api/auth/login",{
            method:"POST",
            headers:{ 'Content-Type': 'application/json' },
            body:JSON.stringify({email,password})
        });
        const result = await response.json();

        if(res.ok){
            router.push("/dashboard");
        }else{
            setErrorMsg("Something went wrong. Please try again.");
        }
    }catch(err){
        setErrorMsg("Something went wrong. Please try again.");
    }finally{
        setIsLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errorMsg}
          </div>
        )} 
        <form onSubmit={handleLogin}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />  
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}







