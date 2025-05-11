
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EstimateData } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";
// Fixed import for WhatsApp icon
import { MessageSquare } from "lucide-react";

interface ShareOptionsProps {
  estimateData: EstimateData;
  onClientInfoChange: (field: string, value: string) => void;
}

const ShareOptions: React.FC<ShareOptionsProps> = ({
  estimateData,
  onClientInfoChange,
}) => {
  const [open, setOpen] = useState(false);

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onClientInfoChange(e.target.name, e.target.value);
  };

  const shareViaWhatsApp = () => {
    if (!estimateData.clientName) {
      toast({
        title: "Error",
        description: "Please enter client name before sharing",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = estimateData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const messageText = `Hello ${
      estimateData.clientName
    },\n\nHere is your electrical estimate:\n\nEstimate #: ${
      estimateData.estimateNumber
    }\nDate: ${estimateData.date}\nTotal Amount: $${totalAmount.toFixed(
      2
    )}\n\nPlease check your email for the detailed estimate.\n\nThank you!`;

    const encodedMessage = encodeURIComponent(messageText);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    setOpen(false);
  };

  const shareViaEmail = () => {
    if (!estimateData.clientEmail || !estimateData.clientName) {
      toast({
        title: "Error",
        description: "Please enter client name and email before sharing",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = estimateData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const subject = `Electrical Work Estimate #${estimateData.estimateNumber}`;
    const body = `Hello ${
      estimateData.clientName
    },\n\nHere is your electrical estimate:\n\nEstimate #: ${
      estimateData.estimateNumber
    }\nDate: ${estimateData.date}\nTotal Amount: $${totalAmount.toFixed(
      2
    )}\n\nPlease find attached the detailed estimate.\n\nThank you!`;

    window.location.href = `mailto:${estimateData.clientEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="bg-electric-600 hover:bg-electric-700">
          Share Estimate
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="space-y-4">
          <h4 className="font-medium">Share with Client</h4>
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="John Doe"
              value={estimateData.clientName}
              onChange={handleClientInfoChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Client Email</Label>
            <Input
              id="clientEmail"
              name="clientEmail"
              type="email"
              placeholder="client@example.com"
              value={estimateData.clientEmail}
              onChange={handleClientInfoChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={shareViaWhatsApp}
              className="bg-green-600 hover:bg-green-700"
            >
              <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
            </Button>
            <Button
              onClick={shareViaEmail}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Mail className="mr-2 h-4 w-4" /> Email
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareOptions;
