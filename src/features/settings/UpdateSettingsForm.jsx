// src/pages/UpdateSettingsForm.jsx
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FaUser, FaBed, FaCoffee } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../../ui/Spinner";
import { getSettings, updateSetting } from "../../services/apiSetting";
import toast from "react-hot-toast";

// 🎬 Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

// Styled Components
const Form = styled.form`
  background: linear-gradient(145deg, #ffffff, #f3f4f6);
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  margin: 2rem auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12),
    inset 2px 2px 6px rgba(255, 255, 255, 0.6),
    inset -2px -2px 6px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.6s ease-out;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 200px;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  background: #f9fafb;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #2563eb;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
`;

const Button = styled.button`
  padding: 0.9rem 1.6rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  border: none;
  background: linear-gradient(145deg, #2563eb, #1e40af);
  color: #fff;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(145deg, #1e40af, #1b30a1);
  }
`;

export default function UpdateSettingsForm() {
  const queryClient = useQueryClient();

  // Fetch settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  // Local state for form values
  const [formValues, setFormValues] = useState({
    minBookingLength: "",
    maxBookingLength: "",
    maxGuestsPerBooking: "",
    breakfastPrice: "",
  });

  // Update local state when data is loaded
  useEffect(() => {
    if (settings) {
      setFormValues({
        minBookingLength: settings.minBookingLength || 1,
        maxBookingLength: settings.maxBookingLength || 1,
        maxGuestsPerBooking: settings.maxGuestsPerBooking || 1,
        breakfastPrice: settings.breakfastPrice || 0,
      });
    }
  }, [settings]);

  // Mutation for updating settings
  const { mutate: updateSettings, isLoading: isUpdating } = useMutation({
    mutationFn: (newSettings) => updateSetting(settings.id, newSettings),
    onSuccess: () => {
      toast.success("Settings updated successfully ✅");
      queryClient.invalidateQueries(["settings"]);
    },
    onError: (err) =>
      toast.error(err.message || "Failed to update settings ❌"),
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value !== "" ? Number(value) : "",
    }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formValues);
  };

  if (isLoading) return <Spinner />;

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow>
        <LabelContainer>
          <FaBed /> Minimum Nights/Bookings
        </LabelContainer>
        <Input
          type="number"
          id="minBookingLength"
          min="1"
          value={formValues.minBookingLength}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow>
        <LabelContainer>
          <FaBed /> Maximum Nights/Bookings
        </LabelContainer>
        <Input
          type="number"
          id="maxBookingLength"
          min="1"
          value={formValues.maxBookingLength}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow>
        <LabelContainer>
          <FaUser /> Maximum Guests
        </LabelContainer>
        <Input
          type="number"
          id="maxGuestsPerBooking"
          min="1"
          value={formValues.maxGuestsPerBooking}
          onChange={handleChange}
        />
      </FormRow>

      <FormRow>
        <LabelContainer>
          <FaCoffee /> Breakfast Price
        </LabelContainer>
        <Input
          type="number"
          id="breakfastPrice"
          min="0"
          value={formValues.breakfastPrice}
          onChange={handleChange}
        />
      </FormRow>

      <Button type="submit" disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Settings"}
      </Button>
    </Form>
  );
}
