import FormEditorWrapper from "@/components/FormEditorWrapper";
import prisma from "@/lib/prisma"; 
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Edit = async ({ params }: { params: Promise<{ formId: string }> }) => {
  const formId = (await params).formId;

  if (!formId) {
    return <h1>No form id found for id {formId}</h1>;
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const form : any = await prisma.form.findUnique({
    where: {
      id: Number(formId),
    },
  });

  if (!form) {
    return <h1>Form not found</h1>;
  }

  if (form.ownerId !== user.id) {
    return <h1>Unauthorized to edit this form</h1>;
  }
 
  return (
    <div className="container mx-auto py-6">
      <FormEditorWrapper form={form} />
    </div>
  );
};

export default Edit;