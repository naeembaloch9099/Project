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

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--color-grey-800);
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

const ErrorMsg = styled.p`
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: #dc2626;
`;

const FormRow = ({ label, children, error }) => (
  <div style={{ marginBottom: "1.25rem" }}>
    <label style={{ fontWeight: 600, color: "var(--color-grey-700)" }}>
      {label}
      {children}
    </label>
    {error && <ErrorMsg>{error}</ErrorMsg>}
  </div>
);

// ---------- main component ----------
export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!oldPassword.trim())
      newErrors.oldPassword = "Old password is required.";
    if (!passwordRegex.test(newPassword))
      newErrors.newPassword =
        "New password must be 8+ chars, include uppercase, lowercase, number, and special char.";
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      // ✅ Step 1: get current user email
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) throw userError;

      const email = userData.user?.email;
      if (!email) throw new Error("Could not fetch user email.");

      // ✅ Step 2: Reauthenticate with old password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: oldPassword,
      });
      if (signInError) {
        throw new Error("Old password is incorrect.");
      }

      // ✅ Step 3: Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updateError) throw updateError;

      // ✅ Step 4: Notify success
      toast.success("Password updated successfully! Please check your email.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (err) {
      toast.error(err.message || "Failed to update password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Change Password</Title>

      <FormRow label="Old Password" error={errors.oldPassword}>
        <Input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </FormRow>

      <FormRow label="New Password" error={errors.newPassword}>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </FormRow>

      <FormRow label="Confirm New Password" error={errors.confirmPassword}>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormRow>

      <Actions>
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </PrimaryButton>
        <CancelButton type="button" onClick={handleCancel}>
          Cancel
        </CancelButton>
      </Actions>
    </Form>
  );
}
