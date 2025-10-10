"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

export const updateForm = async (formId: number, formData: FormData) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Check if the form exists and belongs to the user
    const existingForm = await prisma.form.findUnique({
      where: {
        id: formId,
      },
    });

    if (!existingForm) {
      return { success: false, message: "Form not found" };
    }

    if (existingForm.ownerId !== user.id) {
      return { success: false, message: "Unauthorized to edit this form" };
    }

    // Remove the id field from formFields before saving
    const cleanedFormData = {
      formTitle: formData.formTitle,
      formFields: formData.formFields.map((field) => ({
        label: field.label,
        name: field.name,
        type: field.type,
        placeholder: field.placeholder,
        options: field.options,
        required: field.required
      }))
    };

    // Update the form
    const updatedForm = await prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        content: JSON.stringify(cleanedFormData),
      },
    });

    revalidatePath(`/dashboard/forms/edit/${formId}`);
    revalidatePath('/dashboard/forms');

    return {
      success: true,
      message: "Form updated successfully",
      data: updatedForm,
    };
  } catch (error: any) {
    console.error("Error updating form:", error);
    return {
      success: false,
      message: "An error occurred while updating the form",
    };
  }
};