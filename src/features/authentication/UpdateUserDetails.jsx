import React, { useState } from "react";
import styled from "styled-components";
import { useUser } from "./useUser";
import supabase from "../../services/supabaseClient";
import { toast } from "react-hot-toast";

const Form = styled.form`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border: 1px solid var(--color-grey-200);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.4rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--color-grey-700);
  text-align: right;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid black;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
  }
`;

const FileInput = styled.input`
  font-size: 0.9rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.4rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const CancelButton = styled(Button)`
  background: #e5e7eb;
  color: #111827;

  &:hover {
    background: #d1d5db;
  }
`;

const SubmitButton = styled(Button)`
  background: #2563eb;
  color: #fff;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

export default function UpdateUserDetails() {
  const { user } = useUser();
  const [email, setEmail] = useState(user?.email || "");
  const [fullName, setFullName] = useState(user?.user_metadata?.fullName || "");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = user?.user_metadata?.avatar || "";

      // Upload avatar if new file chosen
      if (avatar) {
        const fileName = `avatar-${user.id}-${Date.now()}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatar);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

        avatarUrl = publicUrl.publicUrl;
      }

      // Update user in Supabase
      const { error } = await supabase.auth.updateUser({
        email,
        data: { fullName, avatar: avatarUrl },
      });

      if (error) throw error;

      toast.success("Account updated successfully!");
    } catch (err) {
      toast.error(err.message || "Update failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2
        style={{
          marginBottom: "1.5rem",
          fontSize: "1.4rem",
          fontWeight: "700",
          color: "var(--color-grey-900)",
        }}
      >
        Update your account
      </h2>

      <FormRow>
        <Label>Email address</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FormRow>

      <FormRow>
        <Label>Full name</Label>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </FormRow>

      <FormRow>
        <Label>Avatar image</Label>
        <FileInput type="file" accept="image/*" onChange={handleAvatarChange} />
      </FormRow>

      <Actions>
        <CancelButton type="button" onClick={() => window.history.back()}>
          Cancel
        </CancelButton>
        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update account"}
        </SubmitButton>
      </Actions>
    </Form>
  );
}
