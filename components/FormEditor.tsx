"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Save, ArrowUp, ArrowDown } from "lucide-react";
import toast from "react-hot-toast";

type FieldType = {
  id: string;
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  options?: string[];
  required: boolean;
};

type FormData = {
  formTitle: string;
  formFields: FieldType[];
};

type Props = {
  form: any;
  onSave: (formData: FormData) => void;
};

const fieldTypes = [
  { value: "text", label: "Text Input" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Textarea" },
  { value: "select", label: "Dropdown" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkboxes" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "datetime-local", label: "Date & Time" },
];

const FormEditor: React.FC<Props> = ({ form, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    formTitle: "",
    formFields: []
  });

  useEffect(() => {
    if (form) {
      const parsedContent = typeof form.content === 'string' ? JSON.parse(form.content) : form.content;
      setFormData({
        formTitle: parsedContent.formTitle || "",
        formFields: parsedContent.formFields?.map((field: any, index: number) => ({
          id: `field-${index}`,
          ...field
        })) || []
      });
    }
  }, [form]);

  const addField = () => {
    const newField: FieldType = {
      id: `field-${Date.now()}`,
      label: "New Field",
      name: `field_${formData.formFields.length + 1}`,
      type: "text",
      placeholder: "Enter value",
      required: false
    };

    setFormData(prev => ({
      ...prev,
      formFields: [...prev.formFields, newField]
    }));
  };

  const updateField = (fieldId: string, updates: Partial<FieldType>) => {
    setFormData(prev => ({
      ...prev,
      formFields: prev.formFields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const deleteField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      formFields: prev.formFields.filter(field => field.id !== fieldId)
    }));
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const currentIndex = formData.formFields.findIndex(field => field.id === fieldId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= formData.formFields.length) return;

    const items = Array.from(formData.formFields);
    const [movedItem] = items.splice(currentIndex, 1);
    items.splice(newIndex, 0, movedItem);

    setFormData(prev => ({
      ...prev,
      formFields: items
    }));
  };

  const handleSave = () => {
    if (!formData.formTitle.trim()) {
      toast.error("Form title is required");
      return;
    }

    if (formData.formFields.length === 0) {
      toast.error("At least one field is required");
      return;
    }

    // Validate fields
    for (const field of formData.formFields) {
      if (!field.label.trim() || !field.name.trim()) {
        toast.error("All fields must have a label and name");
        return;
      }
    }

    onSave(formData);
  };

  const addOption = (fieldId: string) => {
    updateField(fieldId, {
      options: [
        ...(formData.formFields.find(f => f.id === fieldId)?.options || []),
        "New Option"
      ]
    });
  };

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = formData.formFields.find(f => f.id === fieldId);
    if (field?.options) {
      const newOptions = [...field.options];
      newOptions[optionIndex] = value;
      updateField(fieldId, { options: newOptions });
    }
  };

  const deleteOption = (fieldId: string, optionIndex: number) => {
    const field = formData.formFields.find(f => f.id === fieldId);
    if (field?.options) {
      const newOptions = field.options.filter((_, index) => index !== optionIndex);
      updateField(fieldId, { options: newOptions });
    }
  };

  const needsOptions = (type: string) => ["select", "radio", "checkbox"].includes(type);
  const needsPlaceholder = (type: string) => !["select", "radio", "checkbox", "date", "time", "datetime-local"].includes(type);

  return (
    <div className="space-y-6">
      {/* Form Title */}
      <Card>
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="formTitle">Form Title</Label>
              <Input
                id="formTitle"
                value={formData.formTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, formTitle: e.target.value }))}
                placeholder="Enter form title"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fields Editor */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Form Fields ({formData.formFields.length})</CardTitle>
          <Button onClick={addField} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.formFields.map((field, index) => (
              <Card key={field.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-1 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveField(field.id, 'up')}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveField(field.id, 'down')}
                        disabled={index === formData.formFields.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <Label>Field Label</Label>
                                    <Input
                                      value={field.label}
                                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                                      placeholder="Field label"
                                    />
                                  </div>
                                  <div>
                                    <Label>Field Name</Label>
                                    <Input
                                      value={field.name}
                                      onChange={(e) => updateField(field.id, { name: e.target.value })}
                                      placeholder="field_name"
                                    />
                                  </div>
                                  <div>
                                    <Label>Field Type</Label>
                                    <Select
                                      value={field.type}
                                      onValueChange={(value) => updateField(field.id, { type: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {fieldTypes.map((type) => (
                                          <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {needsPlaceholder(field.type) && (
                                    <div>
                                      <Label>Placeholder</Label>
                                      <Input
                                        value={field.placeholder || ""}
                                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                        placeholder="Enter placeholder text"
                                      />
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={`required-${field.id}`}
                                      checked={field.required}
                                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                      className="rounded"
                                    />
                                    <Label htmlFor={`required-${field.id}`}>Required field</Label>
                                  </div>
                                </div>

                                {/* Options for select, radio, checkbox */}
                                {needsOptions(field.type) && (
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <Label>Options</Label>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => addOption(field.id)}
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Add Option
                                      </Button>
                                    </div>
                                    <div className="space-y-2">
                                      {field.options?.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center gap-2">
                                          <Input
                                            value={option}
                                            onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                                            placeholder={`Option ${optionIndex + 1}`}
                                          />
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={() => deleteOption(field.id, optionIndex)}
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      )) || []}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteField(field.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

          {formData.formFields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No fields added yet. Click &quot;Add Field&quot; to get started.
            </div>
          )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Form Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {formData.formTitle || "Untitled Form"}
            </h3>
            {formData.formFields.length > 0 ? (
              <div className="space-y-4">
                {formData.formFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    {field.type === "textarea" ? (
                      <div className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-400">
                        {field.placeholder || "Textarea field"}
                      </div>
                    ) : field.type === "select" ? (
                      <div className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-400">
                        Select {field.options?.[0] || "option"}...
                      </div>
                    ) : (
                      <div className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-400">
                        {field.placeholder || `${field.type} field`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No fields added yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-between">
        <div className="text-sm text-gray-500">
          {formData.formFields.length} field{formData.formFields.length !== 1 ? 's' : ''} in this form
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Form
        </Button>
      </div>
    </div>
  );
};

export default FormEditor;