
import React, { useState } from "react";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import { MaterialItem, EstimateData } from "@/types";
import MaterialForm from "@/components/MaterialForm";
import MaterialsTable from "@/components/MaterialsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { generatePDF } from "@/utils/pdfUtils";
import { useToast } from "@/components/ui/use-toast";
import ShareOptions from "@/components/ShareOptions";
import { motion } from "framer-motion";

const Index = () => {
  const { toast } = useToast();
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  
  const [estimateData, setEstimateData] = useState<EstimateData>({
    clientName: "",
    clientEmail: "",
    items: materials,
    date: format(new Date(), "PPP"),
    estimateNumber: `EST-${nanoid(6).toUpperCase()}`,
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
    };

    generatePDF(currentEstimateData);
  };

  const handleClientInfoChange = (field: string, value: string) => {
    setEstimateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update estimateData when materials change
  React.useEffect(() => {
    setEstimateData((prev) => ({
      ...prev,
      items: materials,
    }));
  }, [materials]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <motion.div 
        className="container max-w-4xl mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.header 
          className="mb-8 text-center"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold text-electric-700 mb-2">
            Electrical Estimate App
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Create and share professional electrical estimates with ease
          </p>
        </motion.header>

        <motion.div 
          className="grid gap-6"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-electric-100 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-electric-800">
                      Estimate #{estimateData.estimateNumber}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Date: {estimateData.date}
                    </p>
                  </div>
                  
                  <motion.div 
                    className="text-2xl font-bold text-electric-700 bg-white p-3 rounded-lg shadow"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    ${materials.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <MaterialForm onAddMaterial={handleAddMaterial} />
          </motion.div>

          <motion.div 
            className="space-y-4"
            variants={itemVariants}
          >
            <h3 className="text-lg font-medium text-electric-700 flex items-center">
              <span className="inline-block w-2 h-6 bg-electric-500 mr-2 rounded"></span>
              Materials List
            </h3>
            <MaterialsTable
              materials={materials}
              onRemoveMaterial={handleRemoveMaterial}
            />

            {materials.length > 0 && (
              <motion.div 
                className="flex justify-between items-center mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleExportPDF}
                    className="bg-orange-600 hover:bg-orange-700 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Export to PDF
                  </Button>
                </motion.div>
                <ShareOptions
                  estimateData={estimateData}
                  onClientInfoChange={handleClientInfoChange}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
