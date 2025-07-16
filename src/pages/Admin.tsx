import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { Button } from "@/components/ui/button";
import { mockData } from "@/utilts/mockData";

export interface Employee {
  id: string;
  walletAddress: string;
  amount: number;
}

interface EmployeeForm {
  walletAddress: string;
  amount: string;
}

export default function Admin() {
  const { isConnected, formatAddress } = useWallet();
  const [employees, setEmployees] = useState<Employee[]>(mockData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newEmployee, setNewEmployee] = useState<EmployeeForm>({
    walletAddress: "",
    amount: "",
  });
  const [editData, setEditData] = useState<EmployeeForm>({
    walletAddress: "",
    amount: "",
  });

  const handleAddEmployee = () => {
    const amount = parseFloat(newEmployee.amount);
    if (
      !newEmployee.walletAddress.trim() ||
      !newEmployee.amount ||
      amount <= 0 ||
      isNaN(amount)
    ) {
      alert("Please enter a valid wallet address and amount");
      return;
    }

    const employee: Employee = {
      id: Date.now().toString(),
      walletAddress: newEmployee.walletAddress.trim(),
      amount: amount,
    };

    setEmployees([employee, ...employees]);
    setNewEmployee({ walletAddress: "", amount: "" });
    setIsAdding(false);
  };

  const handleEditEmployee = (id: string) => {
    const employee = employees.find((emp) => emp.id === id);
    if (employee) {
      setEditData({
        walletAddress: employee.walletAddress,
        amount: employee.amount.toString(),
      });
      setEditingId(id);
    }
  };

  const handleSaveEdit = () => {
    const amount = parseFloat(editData.amount);
    if (
      !editData.walletAddress.trim() ||
      !editData.amount ||
      amount <= 0 ||
      isNaN(amount)
    ) {
      alert("Please enter a valid wallet address and amount");
      return;
    }

    setEmployees(
      employees.map((emp) =>
        emp.id === editingId
          ? {
              ...emp,
              walletAddress: editData.walletAddress.trim(),
              amount: amount,
            }
          : emp
      )
    );
    setEditingId(null);
    setEditData({ walletAddress: "", amount: "" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ walletAddress: "", amount: "" });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewEmployee({ walletAddress: "", amount: "" });
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm("Are you sure you want to remove this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  if (!isConnected) {
    return (
      <div className="py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            Please connect your wallet to access the admin dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-lg text-muted-foreground">
            Manage employee wallets and USDC salary allocations
          </p>
          <Button
            onClick={() => {
              const transactionData = employees.map((emp) => ({
                address: emp.walletAddress,
                amount: emp.amount,
              }));
              console.log(JSON.stringify(transactionData, null, 2));
            }}
            className="cursor-pointer bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            PUBLISH MERKLE TREE
          </Button>
        </div>

        {/* Summary Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-primary mb-4">
            📊 Dashboard Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">Total Employees</h4>
              <p className="text-2xl font-bold">{employees.length}</p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">
                Total Allocation
              </h4>
              <p className="text-2xl font-bold">
                $
                {employees.reduce((sum, emp) => sum + emp.amount, 0).toFixed(2)}{" "}
                USDC
              </p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">Average Salary</h4>
              <p className="text-2xl font-bold">
                $
                {employees.length > 0
                  ? (
                      employees.reduce((sum, emp) => sum + emp.amount, 0) /
                      employees.length
                    ).toFixed(2)
                  : "0.00"}{" "}
                USDC
              </p>
            </div>
          </div>
        </div>

        {/* Add New Employee Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary">
              Employee Management
            </h2>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add New Employee
              </button>
            )}
          </div>

          {isAdding && (
            <div className="bg-muted/50 border border-border rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-3">Add New Employee</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={newEmployee.walletAddress}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        walletAddress: e.target.value,
                      })
                    }
                    placeholder="Enter Polkadot wallet address"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    USDC Amount
                  </label>
                  <input
                    type="number"
                    value={newEmployee.amount}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        amount: e.target.value,
                      })
                    }
                    placeholder="Enter USDC amount"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAddEmployee}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Employee Table */}
          {employees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-primary">
                      Wallet Address
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">
                      USDC Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">
                        {editingId === employee.id ? (
                          <input
                            type="text"
                            value={editData.walletAddress}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                walletAddress: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border border-border rounded bg-background text-foreground"
                          />
                        ) : (
                          <code className="bg-secondary px-2 py-1 rounded text-sm">
                            {formatAddress(employee.walletAddress)}
                          </code>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingId === employee.id ? (
                          <input
                            type="number"
                            value={editData.amount}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                amount: e.target.value,
                              })
                            }
                            min="0"
                            step="0.01"
                            className="w-full px-2 py-1 border border-border rounded bg-background text-foreground"
                          />
                        ) : (
                          <span className="font-medium">
                            ${employee.amount.toFixed(2)} USDC
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingId === employee.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditEmployee(employee.id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No employees added yet.</p>
              <p className="text-sm">
                Click "Add New Employee" to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
