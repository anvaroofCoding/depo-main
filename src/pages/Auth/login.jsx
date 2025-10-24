import { useEffect, useState } from "react";
import { Input, Button } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { cn } from "@/lib/utils";
import { AnimatedBackground } from "./particles-background";
import { useLoginMutation } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";

export default function LoginForm() {
  const [login, { isLoading, error }] = useLoginMutation();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (field, value) => {
    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error("Foydalanuvchi nomi yoki parolingiz xato!");
    }
  }, [error, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(loginData).unwrap();
      toast.success("muvaffaqiyatli tastiqlandi");

      if (res?.access) {
        localStorage.setItem("tokens", res.access);
      }

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Toaster position="bottom-center" richColors />
      <AnimatedBackground />

      {/* Floating orbs for Apple-like ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Login container with Apple glass morphism */}
      <div
        className={cn(
          "relative w-full max-w-md mx-4 transition-all duration-700 ease-out transform",
          "backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl",
          "bg-gradient-to-b from-white/80 via-white/60 to-white/40",
          isHovered && " shadow-3xl border-white/30"
        )}
        style={{ zIndex: 10 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-20 " />
            <img src="/logo.png" alt="" />
          </div>
        </div>

        {/* Apple-style typography */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-800 mb-2 tracking-tight">
            DEPO ERP
          </h1>
          <p className="text-gray-600 text-sm font-medium">
            Foydalanuvchi nomi va parolni kiriting
          </p>
        </div>

        {/* Form with Apple-style inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-4">
            {/* Username Input */}
            <div className="relative group">
              <div
                className={cn(
                  "relative transition-all duration-300",
                  focusedField === "username" && "transform scale-[1.02]"
                )}
              >
                <Input
                  size="large"
                  placeholder="Foydalanuvchi nomi"
                  prefix={
                    <UserOutlined
                      className={cn(
                        "transition-colors duration-300",
                        focusedField === "username"
                          ? "text-blue-500"
                          : "text-gray-400"
                      )}
                    />
                  }
                  value={loginData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="apple-input"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderColor:
                      focusedField === "username"
                        ? "#3b82f6"
                        : "rgba(0, 0, 0, 0.1)",
                    color: "#1f2937",
                    borderRadius: "16px",
                    height: "56px",
                    fontSize: "16px",
                    fontWeight: "500",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow:
                      focusedField === "username"
                        ? "0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 25px -8px rgba(0, 0, 0, 0.1)"
                        : "0 2px 8px -2px rgba(0, 0, 0, 0.05)",
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div
                className={cn(
                  "relative transition-all duration-300",
                  focusedField === "password" && "transform scale-[1.02]"
                )}
              >
                <Input.Password
                  size="large"
                  placeholder="Parol"
                  prefix={
                    <LockOutlined
                      className={cn(
                        "transition-colors duration-300",
                        focusedField === "password"
                          ? "text-blue-500"
                          : "text-gray-400"
                      )}
                    />
                  }
                  value={loginData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="apple-input"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderColor:
                      focusedField === "password"
                        ? "#3b82f6"
                        : "rgba(0, 0, 0, 0.1)",
                    color: "#1f2937",
                    borderRadius: "16px",
                    height: "56px",
                    fontSize: "16px",
                    fontWeight: "500",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow:
                      focusedField === "password"
                        ? "0 0 0 4px rgba(59, 130, 246, 0.1), 0 8px 25px -8px rgba(0, 0, 0, 0.1)"
                        : "0 2px 8px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  iconRender={(visible) =>
                    visible ? (
                      <EyeTwoTone
                        twoToneColor={
                          focusedField === "password" ? "#3b82f6" : "#6b7280"
                        }
                      />
                    ) : (
                      <EyeInvisibleOutlined
                        style={{
                          color:
                            focusedField === "password" ? "#3b82f6" : "#6b7280",
                          transition: "color 0.3s",
                        }}
                      />
                    )
                  }
                />
              </div>
            </div>
          </div>

          {/* Apple-style gradient button */}
          <Button
            type="primary"
            size="large"
            block
            loading={isLoading}
            htmlType="submit"
            className="apple-button group relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderColor: "transparent",
              color: "white",
              borderRadius: "16px",
              height: "56px",
              fontWeight: "600",
              fontSize: "16px",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 8px 25px -8px rgba(102, 126, 234, 0.4)",
              border: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 35px -8px rgba(102, 126, 234, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 25px -8px rgba(102, 126, 234, 0.4)";
            }}
          >
            <span className="flex items-center justify-center gap-2 relative z-10">
              {!isLoading && (
                <>
                  Kirish
                  <div className="w-1 h-1 bg-white/80 rounded-full animate-pulse" />
                </>
              )}
            </span>

            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Button>
        </form>

        {/* Bottom indicator */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 rounded-full opacity-60">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse" />
        </div>
      </div>

      <div>
        {/* boshqa kodlar */}
        <style>
          {`
      .apple-input .ant-input {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding-left: 16px !important;
      }

      .apple-input .ant-input::placeholder {
        color: #9ca3af !important;
        font-weight: 500 !important;
      }

      .apple-input .ant-input-prefix {
        margin-right: 12px !important;
      }

      .apple-button.ant-btn-loading .ant-btn-loading-icon {
        color: white !important;
      }

      .apple-button:hover {
        background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%) !important;
      }
    `}
        </style>
      </div>
    </div>
  );
}
