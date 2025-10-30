"use client"
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"; 
import { Button } from "./ui/button";
import { Edit2, Check, X, Pencil } from "lucide-react";
import Link from "next/link";
import { Form } from "@/types/form";
import { deleteForm } from "@/actions/deleteForm";
import { updateForm } from "@/actions/updateForm";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FormPublishButton from "./FormPublishButton";
import { Input } from "./ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
 
type Props = {
  form: Form;
};

const FormList: React.FC<Props> = ({ form }) => {
  const router = useRouter();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Parse content if it's a string
  const formContent = typeof form.content === 'string' 
    ? JSON.parse(form.content) 
    : form.content;
  
  const [formTitle, setFormTitle] = useState(formContent.formTitle);
  const [isSaving, setIsSaving] = useState(false);

  const deleteFormHandler = async () => {
      setIsDeleting(true);
      try {
        const data = await deleteForm(form.uuid);

        if(data.success){
          toast.success(data.message);
          setShowDeleteDialog(false);
        } else {
          toast.error(data.message);
        }
      } finally {
        setIsDeleting(false);
      }
  }

  const saveFormTitle = async () => {
    if (!formTitle.trim()) {
      toast.error("Form title cannot be empty");
      return;
    }
    
    setIsSaving(true);
    try {
      const result = await updateForm(form.uuid, {
        formTitle: formTitle,
        formFields: (formContent.formFields || []).map((field: any) => ({
          id: field.name || field.id || '',
          label: field.label || '',
          name: field.name || '',
          type: field.type || 'text',
          placeholder: field.placeholder || '',
          options: field.options || [],
          required: field.required !== undefined ? field.required : true
        }))
      });

      if (result.success) {
        toast.success("Form title updated");
        setIsEditingTitle(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Error updating form title:", err);
      toast.error("Failed to update title");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormTitle(formContent.formTitle);
    setIsEditingTitle(false);
  };
 
  return (
  <div className="w-full sm:w-[350px]">
    <Card className="w-full">
      <CardHeader>
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <Input 
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="flex-1"
              disabled={isSaving}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveFormTitle();
                if (e.key === 'Escape') cancelEdit();
              }}
            />
            <Button 
              size="sm" 
              onClick={saveFormTitle}
              disabled={isSaving}
              className="h-8 w-8 p-0"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={cancelEdit}
              disabled={isSaving}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="truncate flex-1">{formTitle}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingTitle(true)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
        <CardDescription>
          Deploy your new project in one-click.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/dashboard/forms/${form.uuid}/submissions`}>
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
            onClick={() => router.push(`/dashboard/forms/edit/${form.uuid}`)}
          >
            <Edit2 className="w-4 h-4 mr-2" /> Edit
          </Button>
          <FormPublishButton 
            formId={form.uuid}
            isPublished={form.published}
            variant="default"
            className="w-full sm:w-auto flex-1"
          />
        </div>
        <Button
          onClick={() => setShowDeleteDialog(true)}
          variant={"destructive"}
          className="w-full sm:w-auto"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the form{" "}
            <span className="font-semibold text-red-600 dark:text-red-400">
              &quot;{formTitle}&quot;
            </span>{" "}
            and remove all its data including{" "}
            <span className="font-semibold">{form.submissions} submission{form.submissions !== 1 ? 's' : ''}</span>{" "}
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              deleteFormHandler();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Deleting..." : "Delete Form"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);
};

export default FormList;