
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { MaterialItem, CableStandard } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { nanoid } from "nanoid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface MaterialFormProps {
  onAddMaterial: (material: MaterialItem) => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ onAddMaterial }) => {
  const [material, setMaterial] = useState<Omit<MaterialItem, "id">>({
    name: "",
    quantity: 1,
    unit: "pcs",
    price: 0,
    isCable: false,
    brand: "",
  });

  const [isCable, setIsCable] = useState(false);
  const [cableStandard, setCableStandard] = useState<CableStandard>("Nexans");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMaterial((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleMaterialTypeChange = (value: string) => {
    const newIsCable = value === "cable";
    setIsCable(newIsCable);
    setMaterial(prev => ({
      ...prev,
      isCable: newIsCable,
      // Reset brand when switching types
      brand: newIsCable ? cableStandard : "",
    }));
  };

  const handleCableStandardChange = (value: string) => {
    setCableStandard(value as CableStandard);
    setMaterial(prev => ({
      ...prev,
      brand: value === "Other" ? "" : value,
    }));
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaterial(prev => ({
      ...prev,
      brand: e.target.value,
    }));
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!material.name.trim()) {
      toast({
        title: "Error",
        description: "Material name is required",
        variant: "destructive",
      });
      return;
    }

    if (material.quantity <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (material.price < 0) {
      toast({
        title: "Error",
        description: "Price cannot be negative",
        variant: "destructive",
      });
      return;
    }

    if (isCable && (!material.brand || material.brand.trim() === "")) {
      toast({
        title: "Error",
        description: "Cable brand/standard is required",
        variant: "destructive",
      });
      return;
    }

    const newMaterial = {
      ...material,
      id: nanoid(),
    };

    onAddMaterial(newMaterial);
    
    // Reset form
    setMaterial({
      name: "",
      quantity: 1,
      unit: "pcs",
      price: 0,
      isCable: false,
      brand: "",
    });
    setIsCable(false);

    toast({
      title: "Success",
      description: "Material added successfully",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleAddMaterial} className="space-y-4 p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-electric-700">Add Material</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Material Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., 14/2 Romex Wire"
              value={material.name}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="materialType">Material Type</Label>
            <Select onValueChange={handleMaterialTypeChange} defaultValue="other">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select material type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cable">Cable</SelectItem>
                <SelectItem value="other">Other Material</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isCable && (
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Label htmlFor="cableStandard">Cable Standard</Label>
            <Select onValueChange={handleCableStandardChange} defaultValue="Nexans">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select cable standard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nexans">Nexans</SelectItem>
                <SelectItem value="RR">RR</SelectItem>
                <SelectItem value="Reroy">Reroy</SelectItem>
                <SelectItem value="CABSTAR">CABSTAR</SelectItem>
                <SelectItem value="TROPICAL CABLES">TROPICAL CABLES</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            {cableStandard === "Other" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Label htmlFor="brand">Brand Name</Label>
                <Input
                  id="brand"
                  name="brand"
                  placeholder="Enter cable brand"
                  value={material.brand}
                  onChange={handleBrandChange}
                  className="w-full mt-2"
                />
              </motion.div>
            )}
          </motion.div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              value={material.quantity}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <select
              id="unit"
              name="unit"
              value={material.unit}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="pcs">pcs</option>
              <option value="ft">ft</option>
              <option value="m">m</option>
              <option value="box">box</option>
              <option value="roll">roll</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Unit Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            value={material.price}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button type="submit" className="w-full bg-electric-600 hover:bg-electric-700 transition-colors duration-300">
            <Plus className="mr-2 h-4 w-4" /> Add Material
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default MaterialForm;
