
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { MaterialItem } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { nanoid } from "nanoid";

interface MaterialFormProps {
  onAddMaterial: (material: MaterialItem) => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ onAddMaterial }) => {
  const [material, setMaterial] = useState<Omit<MaterialItem, "id">>({
    name: "",
    quantity: 1,
    unit: "pcs",
    price: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMaterial((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? parseFloat(value) || 0 : value,
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
    });

    toast({
      title: "Success",
      description: "Material added successfully",
    });
  };

  return (
    <form onSubmit={handleAddMaterial} className="space-y-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Add Material</h3>
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
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Unit Price ($)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={material.price}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      
      <Button type="submit" className="w-full bg-electric-600 hover:bg-electric-700">
        <Plus className="mr-2 h-4 w-4" /> Add Material
      </Button>
    </form>
  );
};

export default MaterialForm;
