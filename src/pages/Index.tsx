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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-electric-700">
            Electrical Estimate App
          </h1>
          <p className="text-gray-600 mt-2">
            Create and share professional electrical estimates
          </p>
        </header>

        <div className="grid gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Estimate #{estimateData.estimateNumber}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Date: {estimateData.date}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <MaterialForm onAddMaterial={handleAddMaterial} />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Materials List</h3>
            <MaterialsTable
              materials={materials}
              onRemoveMaterial={handleRemoveMaterial}
            />

            {materials.length > 0 && (
              <div className="flex justify-between items-center mt-6">
                <Button
                  onClick={handleExportPDF}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <FileText className="mr-2 h-4 w-4" /> Export to PDF
                </Button>
                <ShareOptions
                  estimateData={estimateData}
                  onClientInfoChange={handleClientInfoChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
