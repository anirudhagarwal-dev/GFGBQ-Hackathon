"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import { Loader2, Filter } from "lucide-react";

interface Grievance {
  id: number;
  title: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
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
      case "Open": return "bg-blue-100 text-blue-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Critical": return "bg-red-100 text-red-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
     switch (priority) {
      case "Critical": return "text-red-600 font-bold";
      case "High": return "text-orange-600 font-semibold";
      default: return "text-gray-600";
    }
  }

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
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Escalated">Escalated</SelectItem>
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
                    
                    <div className="flex items-center gap-6">
                      <div className={`text-sm ${getPriorityColor(g.priority)}`}>
                        {g.priority} Priority
                      </div>
                      <Badge className={getStatusColor(g.status)}>{g.status}</Badge>
                      <Button variant="outline" asChild>
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
