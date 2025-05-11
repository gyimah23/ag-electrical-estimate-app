
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MaterialItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface MaterialsTableProps {
  materials: MaterialItem[];
  onRemoveMaterial: (id: string) => void;
}

const MaterialsTable: React.FC<MaterialsTableProps> = ({ materials, onRemoveMaterial }) => {
  if (materials.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No materials added yet. Add materials using the form above.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Material</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => {
            const total = material.quantity * material.price;
            
            return (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell className="text-right">{material.quantity} {material.unit}</TableCell>
                <TableCell className="text-right">${material.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">${total.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveMaterial(material.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow className="bg-muted/50">
            <TableCell colSpan={3} className="text-right font-medium">
              Total Amount:
            </TableCell>
            <TableCell className="text-right font-bold">
              ${materials.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default MaterialsTable;
