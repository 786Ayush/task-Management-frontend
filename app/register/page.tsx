"use client";

import api from "@/utils/axiosInstance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const [form, setform] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const handleSubmit = async () => {
    try {
      const response = await api.post("/auth/register", form);
      if (response?.status === 200) {
        toast.success("Logged In Successfully!");
        router.push("/login");
      }
    } catch (error) {
      console.log(">>>>Login:", error);
      toast.error("Somegthing went Wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Your Account ✨
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={form.name}
            placeholder="Enter your full name"
            onChange={(e) =>
              setform((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            placeholder="Enter your email"
            onChange={(e) =>
              setform((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={form.password}
            placeholder="Enter your password"
            onChange={(e) =>
              setform((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Register Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Register
        </button>

        {/* Links */}
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
