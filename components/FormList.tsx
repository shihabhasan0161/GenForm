"use client"
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"; 
import { Button } from "./ui/button";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import { Form } from "@/types/form";
import { deleteForm } from "@/actions/deleteForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FormPublishButton from "./FormPublishButton";
 
type Props = {
  form: Form;
};

const FormList: React.FC<Props> = ({ form }) => {
  const router = useRouter();

  const deleteFormHandler = async (formId:number) => {
      const data = await deleteForm(formId);

      if(data.success){
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

  }
 
  return (
  <div className="w-full sm:w-[350px]">
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="truncate">{form.content.formTitle}</CardTitle>
        <CardDescription>
          Deploy your new project in one-click.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/dashboard/forms/${form.id}/submissions`}>
          <Button variant={"link"} className="text-blue-600 p-0">
            Submission - {form.submissions}
          </Button>
        </Link>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full">
          <Button
            variant="outline"
            className="w-full sm:w-auto flex-1"
            onClick={() => router.push(`/dashboard/forms/edit/${form.id}`)}
          >
            <Edit2 className="w-4 h-4 mr-2" /> Edit
          </Button>
          <FormPublishButton 
            formId={form.id}
            isPublished={form.published}
            variant="default"
            className="w-full sm:w-auto flex-1"
          />
        </div>
        <Button
          onClick={() => deleteFormHandler(form.id)}
          variant={"destructive"}
          className="w-full sm:w-auto"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  </div>
);
};

export default FormList;