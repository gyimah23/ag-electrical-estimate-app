
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
import { useToast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface ShareOptionsProps {
  estimateData: EstimateData;
  onClientInfoChange: (field: string, value: string) => void;
}

const ShareOptions: React.FC<ShareOptionsProps> = ({
  estimateData,
  onClientInfoChange,
}) => {
  const { toast } = useToast();
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

    // Create a detailed message with item breakdown
    let messageText = `📋 *ELECTRICAL ESTIMATE* 📋\n\n`;
    messageText += `*Estimate #:* ${estimateData.estimateNumber}\n`;
    messageText += `*Date:* ${estimateData.date}\n`;
    messageText += `*Client:* ${estimateData.clientName}\n\n`;
    
    messageText += `*MATERIALS LIST:*\n`;
    estimateData.items.forEach((item, index) => {
      messageText += `${index + 1}. ${item.name}${item.brand ? ` (${item.brand})` : ''} - ${item.quantity} ${item.unit} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}\n`;
    });
    
    messageText += `\n*TOTAL AMOUNT: $${totalAmount.toFixed(2)}*\n\n`;
    messageText += `Thank you for your business!\n`;
    messageText += `For a detailed PDF, please check your email.`;

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
    
    // Create a detailed email body
    let body = `Dear ${estimateData.clientName},\n\n`;
    body += `Please find below your electrical estimate:\n\n`;
    body += `Estimate #: ${estimateData.estimateNumber}\n`;
    body += `Date: ${estimateData.date}\n\n`;
    
    body += `MATERIALS LIST:\n`;
    estimateData.items.forEach((item, index) => {
      body += `${index + 1}. ${item.name}${item.brand ? ` (${item.brand})` : ''} - ${item.quantity} ${item.unit} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}\n`;
    });
    
    body += `\nTOTAL AMOUNT: $${totalAmount.toFixed(2)}\n\n`;
    body += `A detailed PDF estimate is attached to this email.\n\n`;
    body += `Thank you for your business!\n`;

    window.location.href = `mailto:${estimateData.clientEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-electric-600 hover:bg-electric-700 shadow-md hover:shadow-lg transition-all duration-300">
            Share Estimate
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-5 shadow-lg border-electric-100">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="font-medium text-electric-700 text-lg">Share with Client</h4>
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-sm text-gray-600">Client Name</Label>
            <Input
              id="clientName"
              name="clientName"
              placeholder="John Doe"
              value={estimateData.clientName}
              onChange={handleClientInfoChange}
              className="transition-all focus-within:border-electric-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientEmail" className="text-sm text-gray-600">Client Email</Label>
            <Input
              id="clientEmail"
              name="clientEmail"
              type="email"
              placeholder="client@example.com"
              value={estimateData.clientEmail}
              onChange={handleClientInfoChange}
              className="transition-all focus-within:border-electric-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={shareViaWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <MessageSquare className="mr-2 h-4 w-4" /> WhatsApp
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={shareViaEmail}
                className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <Mail className="mr-2 h-4 w-4" /> Email
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareOptions;
