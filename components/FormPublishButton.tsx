"use client"
import React, { useState } from "react";
import { Button } from "./ui/button";
import { 
  Share2, 
  Copy, 
  ExternalLink,
  MessageCircle,
  Send,
  Mail,
  Twitter,
  Facebook,
  Linkedin
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { publishForm } from "@/actions/publishForm";
import toast from "react-hot-toast";
import FormPublishDialog from "./FormPublishDialog";

type Props = {
  formId: number;
  isPublished: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
  showText?: boolean;
};

const FormPublishButton: React.FC<Props> = ({ 
  formId, 
  isPublished, 
  variant = "default", 
  className = "",
  showText = true 
}) => {
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [published, setPublished] = useState(isPublished);

  const handlePublish = async () => {
    if (!published) {
      const result = await publishForm(formId);
      if (result?.success === false) {
        toast.error(result.message);
        return;
      }
      toast.success("Form published successfully!");
      setPublished(true);
    }
    setPublishDialogOpen(true);
  };

  const getFormUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://genform-8x4o.onrender.com";
    return `${baseUrl}/forms/${formId}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFormUrl());
    toast.success("Form URL copied to clipboard!");
  };

  const shareOnWhatsApp = () => {
    const url = getFormUrl();
    const text = encodeURIComponent(`Check out this form: ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareOnTelegram = () => {
    const url = getFormUrl();
    const text = encodeURIComponent(`Check out this form: ${url}`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = getFormUrl();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const url = getFormUrl();
    const text = encodeURIComponent(`Check out this form: ${url}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = getFormUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareViaEmail = () => {
    const url = getFormUrl();
    const subject = encodeURIComponent("Check out this form");
    const body = encodeURIComponent(`I'd like to share this form with you: ${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const openForm = () => {
    window.open(getFormUrl(), '_blank');
  };

  if (!published) {
    return (
      <>
        <Button
          variant={variant}
          className={className}
          onClick={handlePublish}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {showText && "Publish"}
        </Button>
        <FormPublishDialog 
          formId={formId}
          open={publishDialogOpen}
          onOpenChange={setPublishDialogOpen}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} className={className}>
            <Share2 className="w-4 h-4 mr-2" />
            {showText && "Share"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openForm}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Form
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={shareOnWhatsApp}>
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareOnTelegram}>
            <Send className="w-4 h-4 mr-2" />
            Telegram
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareOnLinkedIn}>
            <Linkedin className="w-4 h-4 mr-2" />
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareOnTwitter}>
            <Twitter className="w-4 h-4 mr-2" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareOnFacebook}>
            <Facebook className="w-4 h-4 mr-2" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareViaEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <FormPublishDialog 
        formId={formId}
        open={publishDialogOpen}
        onOpenChange={setPublishDialogOpen}
      />
    </>
  );
};

export default FormPublishButton;