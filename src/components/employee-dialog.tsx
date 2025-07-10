"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Employee } from "@/lib/data"

interface EmployeeDialogProps {
  children: ReactNode;
  employee?: Employee;
}

export function EmployeeDialog({ children, employee }: EmployeeDialogProps) {
  const isEditMode = !!employee;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details of the employee." : "Enter the details for the new employee."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue={employee?.name} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employeeId" className="text-right">
              Employee ID
            </Label>
            <Input id="employeeId" defaultValue={employee?.id} className="col-span-3" disabled={isEditMode} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Select defaultValue={employee?.department}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fingerprint" className="text-right">
              Fingerprint
            </Label>
            <Button variant="outline" className="col-span-3">
              {isEditMode ? "Re-scan Fingerprint" : "Scan Fingerprint"}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
