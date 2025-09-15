import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../../services/supabaseClient";

// ✨ Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 10px rgba(37,99,235,0.4); }
  50% { box-shadow: 0 0 25px rgba(37,99,235,0.8); }
  100% { box-shadow: 0 0 10px rgba(37,99,235,0.4); }
`;

// 🌌 Page Wrapper
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3a8a, #3b82f6, #9333ea);
  background-size: 300% 300%;
  animation: gradientShift 10s ease infinite;

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

// 💎 3D Glass Card
const FormCard = styled.form`
  max-width: 420px;
  width: 100%;
  padding: 2.5rem;
  border-radius: 20px;
  backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  color: #fff;
  text-align: center;
  animation: ${float} 6s ease-in-out infinite;
`;

// 🌟 Input
const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  margin-top: 0.6rem;
  border-radius: 10px;
  border: none;
  outline: none;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.3);

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

// 🔘 Button
const Button = styled.button`
  width: 100%;
  padding: 0.9rem;
  margin-top: 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(135deg, #2563eb, #9333ea);
  color: #fff;
  transition: all 0.3s ease;
  animation: ${glow} 3s infinite;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    background: linear-gradient(135deg, #1d4ed8, #7e22ce);
  }

  &:disabled {
    background: #6b7280;
    animation: none;
    cursor: not-allowed;
  }
`;

// 📌 Labels
const FormRowVertical = ({ label, children }) => (
  <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
    <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#e5e7eb" }}>
      {label}
      {children}
    </label>
  </div>
);

// 🔗 Signup link
const SignupLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #e5e7eb;

  a {
    color: #60a5fa;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormCard onSubmit={handleSubmit}>
        <h2
          style={{
            marginBottom: "2rem",
            fontSize: "1.8rem",
            fontWeight: "700",
          }}
        >
          Welcome Back 🚀
        </h2>

        <FormRowVertical label="Email Address">
          <Input
            type="email"
            autoComplete="username"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormRowVertical>

        <FormRowVertical label="Password">
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormRowVertical>

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </FormCard>
    </PageWrapper>
  );
}
