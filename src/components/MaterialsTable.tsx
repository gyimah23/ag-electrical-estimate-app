
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MaterialItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface MaterialsTableProps {
  materials: MaterialItem[];
  onRemoveMaterial: (id: string) => void;
}

const MaterialsTable: React.FC<MaterialsTableProps> = ({ materials, onRemoveMaterial }) => {
  if (materials.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-8 border rounded-lg bg-gray-50"
      >
        <p className="text-gray-500">No materials added yet. Add materials using the form above.</p>
      </motion.div>
    );
  }

  const tableRowVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-md border overflow-hidden shadow-md"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-electric-50">
            <TableHead>Material</TableHead>
            <TableHead>Brand/Standard</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material, index) => {
            const total = material.quantity * material.price;
            
            return (
              <motion.tr
                key={material.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={tableRowVariants}
                className="hover:bg-muted/30 transition-colors"
                whileHover={{ backgroundColor: "rgba(236, 241, 247, 0.5)" }}
              >
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell>{material.brand || "N/A"}</TableCell>
                <TableCell className="text-right">{material.quantity} {material.unit}</TableCell>
                <TableCell className="text-right">${material.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">${total.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveMaterial(material.id)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            );
          })}
          <TableRow className="bg-electric-50 font-semibold">
            <TableCell colSpan={4} className="text-right">
              Total Amount:
            </TableCell>
            <TableCell className="text-right font-bold text-electric-700">
              ${materials.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default MaterialsTable;
