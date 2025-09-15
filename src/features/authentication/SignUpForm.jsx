import React, { useState } from "react";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import supabase from "../../services/supabaseClient";

// ---------- styled-components ----------
const Form = styled.form`
  max-width: 420px;
  margin: 3rem auto;
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid var(--color-grey-200);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 0.9rem 1.4rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  color: #fff;
  background-color: black;
  transition: background 0.2s ease;

  &:hover {
    background: white;
    color: black;
  }

  &:disabled {
    background: var(--color-grey-400);
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.9rem 1.4rem;
  border: 1px solid var(--color-grey-300);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  background-color: black;
  color: white;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: var(--color-grey-100);
    color: black;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid black;
  border-radius: 8px;
  margin-top: 0.5rem;
  background: #fff;
  color: #111827;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
  }
`;

const FileInput = styled.input`
  margin-top: 0.5rem;
`;

const AvatarPreview = styled.img`
  display: block;
  margin: 1rem auto;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

const ErrorMsg = styled.p`
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: #dc2626;
`;

const FormRowVertical = ({ label, children, error }) => (
  <div style={{ marginBottom: "1.25rem" }}>
    <label style={{ fontWeight: 600, color: "var(--color-grey-700)" }}>
      {label}
      {children}
    </label>
    {error && <ErrorMsg>{error}</ErrorMsg>}
  </div>
);

// ---------- main component ----------
export default function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // regex checks
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setAvatarPreview(URL.createObjectURL(selected));
    }
  };

  // upload avatar to Supabase storage
  const uploadAvatar = async (userId) => {
    if (!file) return null;

    const filePath = `avatars/${userId}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Avatar upload failed");
      throw uploadError;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!emailRegex.test(email)) newErrors.email = "Enter a valid email.";
    if (!passwordRegex.test(password))
      newErrors.password =
        "Password must be at least 8 chars, include 1 uppercase, 1 lowercase, 1 digit, and 1 special character.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      // 1. Sign up first
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { fullName } },
      });
      if (error) throw error;

      const user = data?.user;
      if (!user) throw new Error("User not created");

      // 2. Upload avatar if provided
      let avatarUrl = null;
      if (file) {
        avatarUrl = await uploadAvatar(user.id);

        // update user metadata with avatar URL
        await supabase.auth.updateUser({
          data: { fullName, avatar: avatarUrl },
        });
      }

      toast.success("Account created! Check your email to confirm.");
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFile(null);
      setAvatarPreview(null);
      setErrors({});
    } catch (err) {
      toast.error(err.message || "Failed to sign up");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          fontWeight: 700,
          fontSize: "1.5rem",
          color: "var(--color-grey-800)",
        }}
      >
        Create Account
      </h2>

      <FormRowVertical label="Full Name" error={errors.fullName}>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </FormRowVertical>

      <FormRowVertical label="Email Address" error={errors.email}>
        <Input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormRowVertical>

      <FormRowVertical label="Password" error={errors.password}>
        <Input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormRowVertical>

      <FormRowVertical label="Confirm Password" error={errors.confirmPassword}>
        <Input
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormRowVertical>

      <FormRowVertical label="Avatar (optional)">
        {avatarPreview && (
          <AvatarPreview src={avatarPreview} alt="Avatar preview" />
        )}
        <FileInput type="file" accept="image/*" onChange={handleFileChange} />
      </FormRowVertical>

      <Actions>
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </PrimaryButton>
        <CancelButton
          type="button"
          onClick={() => {
            setFullName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setFile(null);
            setAvatarPreview(null);
            setErrors({});
          }}
        >
          Cancel
        </CancelButton>
      </Actions>
    </Form>
  );
}
