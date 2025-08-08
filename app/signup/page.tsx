"use client";
import { useState } from "react";
import {
  IconEye,
  IconEyeOff,
  IconMail,
  IconLock,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { signUp, isAuthenticated } from "@/service/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.userName || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      await signUp(formData);
      setSuccess("Account created successfully!");
      setFormData({
        userName: "",
        email: "",
        password: "",
      });
      toast.success("Account created successfully!");
      router.push("/signin");
    } catch (error: any) {
      if (error.response?.data?.error) {
        setError(error.response.data.error);
        toast.error(error.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <img
              src="/brainly.png"
              alt="Brainly Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-3xl font-bold text-purple-900">Brainly</h1>
          </div>
          <p className="text-gray-600">Create your Second Brain account</p>
        </div>

        {/* Sign Up Form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              Create Account
            </h2>
            <p className="text-sm text-gray-600">
              Join thousands of users organizing their thoughts
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <IconUser className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <IconMail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <IconLock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 py-3 pr-12 pl-10 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <IconEyeOff className="h-5 w-5" />
                  ) : (
                    <IconEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-purple-600 py-3 font-medium text-white transition-all duration-200 hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">
                  or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-purple-600 hover:text-purple-700"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
