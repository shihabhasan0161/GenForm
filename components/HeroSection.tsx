"use client"
import React, { useState } from "react";
import GenerateFormInput from "./GenerateFormInput";
import { Button } from "./ui/button";

type SuggestionText = {
  label: string;
  text: string;
};

const suggestionBtnText: SuggestionText[] = [
  {
    label: "Job Application",
    text: "Develop a basic job application form that serves as a one-page solution form collecting essential information from applicants.",
  },
  {
    label: "Registration Form",
    text: "Create a course registration form suitable form any scheool or instituition.",
  },
  {
    label: "Feedback Form",
    text: "Create a client feedback form to gather valuable insights from any clients.",
  },
];

type Props = {
  totalForms: number;
  isSubscribed: boolean;
};

type GenerateFormInput = {
  text: string;
  totalForms: number;
  isSubscribed: boolean;
};

const HeroSection: React.FC<Props> = ({ totalForms, isSubscribed }) => {
  const [text, setText] = useState<string>("");

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-600 blur-2xl opacity-50 -z-10 rounded-lg" />

        <div className="container mx-auto text-center relative px-4 py-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Effortlessly Create AI-Powered Forms
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Harness AI technology to build dynamic, responsive forms in just minutes.
          </p>
        </div>
      </div>

      {/* Form input section */}
      <div className="max-w-4xl mx-auto">
        <GenerateFormInput text={text} totalForms={totalForms} isSubscribed={isSubscribed} />

        {/* Suggestion buttons */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {suggestionBtnText.map((item: SuggestionText, index: number) => (
            <Button
              onClick={() => setText(item.text)}
              key={index}
              className="rounded-full h-10 whitespace-nowrap overflow-hidden text-ellipsis px-4"
              variant={"outline"}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;