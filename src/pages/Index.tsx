
import React, { useState } from "react";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import { MaterialItem, EstimateData, CurrencyType } from "@/types";
import MaterialForm from "@/components/MaterialForm";
import MaterialsTable from "@/components/MaterialsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign, Euro, PoundSterling, JapaneseYen, IndianRupee, SwissFranc } from "lucide-react";
import { generatePDF } from "@/utils/pdfUtils";
import { useToast } from "@/components/ui/use-toast";
import ShareOptions from "@/components/ShareOptions";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Custom Ghanaian Cedi Icon Component
const CediIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className || "h-4 w-4"}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8" />
    <path d="M8 7h6" />
    <path d="M8 17h6" />
    <path d="M14 7v10" />
  </svg>
);

const Index = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [currency, setCurrency] = useState<CurrencyType>("$");
  
  const [estimateData, setEstimateData] = useState<EstimateData>({
    clientName: "",
    clientEmail: "",
    items: materials,
    date: format(new Date(), "PPP"),
    estimateNumber: `EST-${nanoid(6).toUpperCase()}`,
    currency: "$"
  });

  const handleAddMaterial = (material: MaterialItem) => {
    setMaterials((prev) => [...prev, material]);
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((item) => item.id !== id));
  };

  const handleExportPDF = () => {
    if (materials.length === 0) {
      toast({
        title: "Error",
        description: "Add at least one material to generate PDF",
        variant: "destructive",
      });
      return;
    }

    // Update the estimate data with the latest materials
    const currentEstimateData = {
      ...estimateData,
      items: materials,
      currency: currency
    };

    try {
      generatePDF(currentEstimateData);
      toast({
        title: "Success",
        description: "PDF generated successfully!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClientInfoChange = (field: string, value: string) => {
    setEstimateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCurrencyChange = (newCurrency: CurrencyType) => {
    setCurrency(newCurrency);
    setEstimateData((prev) => ({
      ...prev,
      currency: newCurrency
    }));
  };

  // Update estimateData when materials change
  React.useEffect(() => {
    setEstimateData((prev) => ({
      ...prev,
      items: materials,
    }));
  }, [materials]);

  const getCurrencyIcon = (currencyType: CurrencyType) => {
    switch(currencyType) {
      case "$": return <DollarSign className="h-4 w-4" />;
      case "€": return <Euro className="h-4 w-4" />;
      case "£": return <PoundSterling className="h-4 w-4" />;
      case "¥": return <JapaneseYen className="h-4 w-4" />;
      case "₹": return <IndianRupee className="h-4 w-4" />;
      case "₣": return <SwissFranc className="h-4 w-4" />;
      case "₵": return <CediIcon className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  const totalAmount = materials.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-8">
      <motion.div 
        className="container max-w-5xl mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.header 
          className="mb-8 text-center"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2 tracking-tight">
            Professional Electrical Estimate
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            Create detailed estimates for electrical services with customizable materials and pricing
          </p>
        </motion.header>

        <motion.div 
          className="grid gap-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-slate-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-800 to-blue-900 text-white p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-blue-200 mb-1">Estimate Reference</p>
                    <CardTitle className="text-xl font-bold tracking-tight">
                      #{estimateData.estimateNumber}
                    </CardTitle>
                    <p className="text-sm text-blue-200 mt-1">
                      {estimateData.date}
                    </p>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-white text-slate-800 font-medium flex items-center gap-1 hover:bg-blue-50 transition-all">
                          {getCurrencyIcon(currency)} {currency} <span className="sr-only">Change currency</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleCurrencyChange("$")}>
                          <DollarSign className="mr-2 h-4 w-4" /> USD ($)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCurrencyChange("€")}>
                          <Euro className="mr-2 h-4 w-4" /> EUR (€)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCurrencyChange("£")}>
                          <PoundSterling className="mr-2 h-4 w-4" /> GBP (£)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCurrencyChange("¥")}>
                          <JapaneseYen className="mr-2 h-4 w-4" /> JPY (¥)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCurrencyChange("₹")}>
                          <IndianRupee className="mr-2 h-4 w-4" /> INR (₹)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCurrencyChange("₣")}>
                          <SwissFranc className="mr-2 h-4 w-4" /> CHF (₣)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCurrencyChange("₵")}>
                          <CediIcon className="mr-2 h-4 w-4" /> GHS (₵)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <motion.div
                      className="bg-white text-slate-800 px-5 py-3 rounded-lg shadow-md"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <p className="text-sm text-slate-500 font-medium">Total</p>
                      <p className="text-2xl font-bold">{currency}{totalAmount.toFixed(2)}</p>
                    </motion.div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Tabs defaultValue="materials" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="materials" className="text-sm">Materials Entry</TabsTrigger>
                <TabsTrigger value="preview" className="text-sm">Estimate Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="materials">
                <MaterialForm onAddMaterial={handleAddMaterial} />
              </TabsContent>
              
              <TabsContent value="preview">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <span className="inline-block w-1 h-6 bg-blue-500 mr-2 rounded"></span>
                      Estimate Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">This is how your estimate will appear to clients</p>
                    <ShareOptions
                      estimateData={{...estimateData, currency}}
                      onClientInfoChange={handleClientInfoChange}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div 
            className="space-y-4"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-800 flex items-center">
                <span className="inline-block w-1 h-6 bg-blue-500 mr-2 rounded"></span>
                Materials List
              </h3>
              
              {materials.length > 0 && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleExportPDF}
                    className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Export to PDF
                  </Button>
                </motion.div>
              )}
            </div>
            
            <MaterialsTable
              materials={materials}
              onRemoveMaterial={handleRemoveMaterial}
              currency={currency}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
