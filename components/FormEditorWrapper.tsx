"use client";
import React from "react";
import FormEditor from "./FormEditor";
import { updateForm } from "@/actions/updateForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type FormData = {
  formTitle: string;
  formFields: Array<{
    id: string;
    label: string;
    name: string;
    type: string;
    placeholder?: string;
    options?: string[];
    required: boolean;
  }>;
};

type Props = {
  form: any;
};

const FormEditorWrapper: React.FC<Props> = ({ form }) => {
  const router = useRouter();

  const handleSave = async (formData: FormData) => {
    try {
      const result = await updateForm(form.id, formData);
      
      if (result.success) {
        toast.success(result.message);
        router.refresh(); // Refresh the page to show updated data
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("An error occurred while saving the form");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Form</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Customize your form by adding, editing, or removing fields
        </p>
      </div>
      
      <FormEditor form={form} onSave={handleSave} />
    </div>
  );
};

export default FormEditorWrapper;