import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin, updateCabin } from "../../services/apiCabin";
import {
  FaCalendarAlt,
  FaHome,
  FaUser,
  FaDollarSign,
  FaPercentage,
  FaAlignLeft,
  FaImage,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

// ✨ Animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

// 🎨 Styled Components
const Form = styled.form`
  background: linear-gradient(145deg, #ffffff, #f9fafb);
  border-radius: 18px;
  padding: 2.2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12),
    inset 3px 3px 6px rgba(255, 255, 255, 0.6),
    inset -3px -3px 6px rgba(0, 0, 0, 0.1);
  max-width: 650px;
  width: 100%;
  animation: ${fadeIn} 0.6s ease-out;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.4rem;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.6rem;
  color: #1f2937;
`;

const Input = styled.input`
  padding: 0.9rem 1rem;
  border-radius: 12px;
  border: 2px solid ${(props) => (props.error ? "#ef4444" : "#d1d5db")};
  background: ${(props) => (props.error ? "#fee2e2" : "#f9fafb")};
  outline: none;
  font-size: 0.95rem;
  transition: 0.25s ease;

  &:focus {
    border-color: ${(props) => (props.error ? "#dc2626" : "#2563eb")};
    background: #fff;
    box-shadow: 0 0 0 4px
      ${(props) =>
        props.error ? "rgba(239,68,68,0.25)" : "rgba(37,99,235,0.25)"};
  }
`;

const TextArea = styled.textarea`
  padding: 0.9rem 1rem;
  border-radius: 12px;
  border: 2px solid ${(props) => (props.error ? "#ef4444" : "#d1d5db")};
  background: ${(props) => (props.error ? "#fee2e2" : "#f9fafb")};
  font-size: 0.95rem;
  resize: none;
  min-height: 110px;

  &:focus {
    border-color: ${(props) => (props.error ? "#dc2626" : "#2563eb")};
    background: #fff;
    box-shadow: 0 0 0 4px
      ${(props) =>
        props.error ? "rgba(239,68,68,0.25)" : "rgba(37,99,235,0.25)"};
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.85rem;
  color: #dc2626;
  margin-top: 0.4rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  padding: 0.9rem 1.8rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  min-width: 150px;

  ${(props) =>
    props.$variation === "secondary"
      ? `
    background: #f9fafb;
    color: #374151;
    border: 2px solid #d1d5db;

    &:hover {
      background: #e5e7eb;
      transform: translateY(-2px);
    }
  `
      : `
    background: linear-gradient(145deg, #2563eb, #1e40af);
    color: #fff;
    border: none;

    &:hover {
      background: linear-gradient(145deg, #1e40af, #1e3a8a);
      transform: translateY(-2px);
    }
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
  margin-top: 1.8rem;
`;

// 🏕 Main Component
export default function CreateCabin({ cabin = null, onClose }) {
  const mode = cabin ? "edit" : "add";
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (cabin) {
      setValue("created_at", cabin.created_at || "");
      setValue("name", cabin.name || "");
      setValue("maxCapacity", cabin.maxCapacity || "");
      setValue("regularPrice", cabin.regularPrice || "");
      setValue("discount", cabin.discount || 0);
      setValue("description", cabin.description || "");
    }
  }, [cabin, setValue]);

  const { mutate, isLoading } = useMutation({
    mutationFn:
      mode === "edit" ? (data) => updateCabin(cabin.id, data) : createCabin,
    onSuccess: () => {
      toast.success(
        mode === "edit"
          ? "Cabin updated successfully ✅"
          : "Cabin added successfully ✅"
      );
      reset();
      queryClient.invalidateQueries(["cabins"]);
      if (onClose) onClose();
    },
    onError: (err) => {
      toast.error(err?.message || "Something went wrong ❌");
    },
  });

  const onSubmit = (data) => {
    const cabinData = {
      ...data,
      image: data.image?.[0] || cabin?.image || null,
    };
    mutate(cabinData);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* Created At */}
      <FormRow>
        <LabelContainer>
          <FaCalendarAlt /> Created At
        </LabelContainer>
        <Input
          type="datetime-local"
          {...register("created_at", { required: "Created date is required" })}
          error={errors.created_at}
        />
        {errors.created_at && (
          <ErrorMessage>{errors.created_at.message}</ErrorMessage>
        )}
      </FormRow>

      {/* Cabin Name */}
      <FormRow>
        <LabelContainer>
          <FaHome /> Cabin Name
        </LabelContainer>
        <Input
          type="text"
          {...register("name", { required: "Cabin name is required" })}
          error={errors.name}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
      </FormRow>

      {/* Max Capacity */}
      <FormRow>
        <LabelContainer>
          <FaUser /> Max Capacity
        </LabelContainer>
        <Input
          type="number"
          {...register("maxCapacity", {
            required: "Capacity is required",
            min: { value: 1, message: "Must be at least 1" },
          })}
          error={errors.maxCapacity}
        />
        {errors.maxCapacity && (
          <ErrorMessage>{errors.maxCapacity.message}</ErrorMessage>
        )}
      </FormRow>

      {/* Regular Price */}
      <FormRow>
        <LabelContainer>
          <FaDollarSign /> Regular Price
        </LabelContainer>
        <Input
          type="number"
          {...register("regularPrice", {
            required: "Price is required",
            min: { value: 1, message: "Must be greater than 0" },
          })}
          error={errors.regularPrice}
        />
        {errors.regularPrice && (
          <ErrorMessage>{errors.regularPrice.message}</ErrorMessage>
        )}
      </FormRow>

      {/* Discount */}
      <FormRow>
        <LabelContainer>
          <FaPercentage /> Discount (%)
        </LabelContainer>
        <Input
          type="number"
          {...register("discount", {
            min: { value: 0, message: "Cannot be negative" },
          })}
          error={errors.discount}
        />
        {errors.discount && (
          <ErrorMessage>{errors.discount.message}</ErrorMessage>
        )}
      </FormRow>

      {/* Description */}
      <FormRow>
        <LabelContainer>
          <FaAlignLeft /> Description
        </LabelContainer>
        <TextArea
          {...register("description", { required: "Description is required" })}
          error={errors.description}
        />
        {errors.description && (
          <ErrorMessage>{errors.description.message}</ErrorMessage>
        )}
      </FormRow>

      {/* Photo */}
      <FormRow>
        <LabelContainer>
          <FaImage /> Cabin Photo
        </LabelContainer>
        <Input
          type="file"
          accept="image/*"
          {...register("image")}
          error={errors.image}
        />
        {errors.image && <ErrorMessage>{errors.image.message}</ErrorMessage>}
      </FormRow>

      {/* Buttons */}
      <ButtonGroup>
        <Button $variation="secondary" type="button" onClick={onClose}>
          <FaTimes /> Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            mode === "edit" ? (
              <>
                <FaCheck /> Updating...
              </>
            ) : (
              <>
                <FaCheck /> Adding...
              </>
            )
          ) : mode === "edit" ? (
            <>
              <FaCheck /> Update Cabin
            </>
          ) : (
            <>
              <FaCheck /> Add Cabin
            </>
          )}
        </Button>
      </ButtonGroup>
    </Form>
  );
}
