"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Loader2, Filter, CheckCircle, UserPlus } from "lucide-react";


interface Grievance {
  id: number;
  title: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  department_id?: number;
  region_id?: number;
  region_code?: string;
  assignee_id?: number;
}

interface Officer {
  id: number;
  full_name: string;
  email: string;
  department_id: number;
  region_code: string;
}

export default function AdminGrievances() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  useEffect(() => {
    fetchGrievances();
  }, [filterStatus]);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const url = filterStatus !== "All" ? `/grievance/?status=${filterStatus}` : "/grievance/";
      const response = await api.get(url);
      setGrievances(response.data);
    } catch (error) {
      console.error("Failed to fetch grievances", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "Assigned": return "bg-purple-100 text-purple-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Pending Verification": return "bg-orange-100 text-orange-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
     switch (priority) {
      case "Critical": return "text-red-600 font-bold";
      case "High": return "text-orange-600 font-semibold";
      default: return "text-gray-600";
    }
  };

  const handleVerify = async (id: number) => {
      try {
          await api.patch(`/admin/grievance/${id}/verify`);
          fetchGrievances();
      } catch (error) {
          console.error("Verification failed", error);
          alert("Failed to verify grievance");
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Grievance Management</h1>
            <p className="text-gray-500">Manage and track citizen complaints</p>
          </div>
          <div className="flex gap-4">
             <a href="/admin/dashboard" className="text-sm text-blue-600 hover:underline self-center mr-4">Back to Dashboard</a>
            <Select onValueChange={setFilterStatus} defaultValue="All">
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Assigned">Assigned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            {grievances.length === 0 ? (
              <p className="text-center text-gray-500">No grievances found.</p>
            ) : (
              grievances.map((g) => (
                <Card key={g.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">#{g.id} {g.title}</span>
                        <Badge variant="outline">{g.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        Created on {new Date(g.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className={`text-sm ${getPriorityColor(g.priority)}`}>
                        {g.priority} Priority
                      </div>
                      <Badge className={getStatusColor(g.status)}>{g.status}</Badge>
                      
                      {g.status === "Pending Verification" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleVerify(g.id)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Verify
                          </Button>
                      )}

                      {(g.status === "New" || g.status === "Assigned") && (
                          <AssignDialog grievance={g} onAssign={fetchGrievances} />
                      )}

                      <Button variant="outline" asChild size="sm">
                        <a href={`/grievance/${g.id}`}>View Details</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AssignDialog({ grievance, onAssign }: { grievance: Grievance; onAssign: () => void }) {
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [selectedOfficer, setSelectedOfficer] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchOfficers();
        }
    }, [open]);

    const fetchOfficers = async () => {
        setLoading(true);
        try {
            // Fetch officers matching department and region
            let url = `/admin/officers?`;
            if (grievance.department_id) url += `department_id=${grievance.department_id}&`;
            if (grievance.region_id) url += `region_id=${grievance.region_id}`; // Assuming region_id is available
            
            const response = await api.get(url);
            setOfficers(response.data);
        } catch (error) {
            console.error("Failed to fetch officers", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedOfficer) return;
        try {
            await api.patch(`/admin/grievance/${grievance.id}/assign`, {
                officer_id: parseInt(selectedOfficer)
            });
            setOpen(false);
            onAssign();
        } catch (error) {
            console.error("Assignment failed", error);
            alert("Failed to assign officer. Check if department/region matches.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    {grievance.status === "Assigned" ? "Reassign" : "Assign"}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Field Officer</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Label>Select Officer</Label>
                    <Select onValueChange={setSelectedOfficer}>
                        <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select an officer" />
                        </SelectTrigger>
                        <SelectContent>
                            {loading ? (
                                <div className="p-2 text-center text-sm">Loading...</div>
                            ) : officers.length === 0 ? (
                                <div className="p-2 text-center text-sm">No matching officers found</div>
                            ) : (
                                officers.map((officer) => (
                                    <SelectItem key={officer.id} value={officer.id.toString()}>
                                        {officer.full_name} ({officer.region_code || "No Region"})
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-2">
                        Only officers matching Department and Region are shown.
                    </p>
                </div>
                <DialogFooter>
                    <Button onClick={handleAssign} disabled={!selectedOfficer}>
                        Assign
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
