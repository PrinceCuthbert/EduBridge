// ─────────────────────────────────────────────────────────────
//  src/pages/dashboard/VisaSummary.jsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, MapPin, Plus, Eye, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import { useVisaConsultations } from "@/hooks/useVisaConsultations";
import VisaStatusBadge from "@/components/visa/VisaStatusBadge";
import { getCountryFlag } from "@/data/mockVisaData";
import { useAuth } from "@/context/AuthContext";

export default function VisaSummary() {
  const navigate = useNavigate();

  const { user } = useAuth();

  // All data logic is in the hook — this component just destructures.
  const { consultations, loading, error } = useVisaConsultations(user?.id);

  // ── Derived stats (computed from data, not stored in state) ──
  const totalRequests = consultations.length;
  const latestDestination =
    consultations.length > 0 ? consultations[0].destination : "N/A";

  // ── Error state ───────────────────────────────────────────
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-serif text-slate-900 tracking-tight">
          Visa Consultations
        </h1>
        <p className="text-slate-500 text-sm">
          Track your consultation requests, documents, and consultant feedback.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText size={18} />
              </div>
            </div>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              My Requests
            </p>
            <p className="text-2xl font-semibold text-slate-900 mt-0.5">
              {totalRequests}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Total consultation requests created
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <MapPin size={18} />
              </div>
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-600 font-normal text-[10px] px-1.5 py-0 h-5">
                Most Recent
              </Badge>
            </div>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
              Latest Destination
            </p>
            <p className="text-2xl font-semibold text-slate-900 mt-0.5">
              {latestDestination}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Your most recent target country
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Request History table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif text-slate-900">Request History</h3>
          <Button
            onClick={() => navigate("/dashboard/visa-status/request")}
            size="sm"
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium h-9 gap-2">
            <Plus size={14} />
            New Request
          </Button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="py-20 text-center">
            <Clock size={32} className="mx-auto text-slate-300 animate-spin" />
            <p className="text-slate-400 text-sm mt-3">
              Loading your consultations...
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && consultations.length === 0 && (
          <div className="py-16 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white border border-slate-200 mb-3 shadow-sm">
              <FileText size={20} className="text-slate-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">
              No Consultation Requests
            </h3>
            <p className="text-slate-500 text-xs max-w-xs mx-auto mt-1">
              You haven't requested any consultations yet.
            </p>
            <Button
              onClick={() => navigate("/dashboard/visa-status/request")}
              size="sm"
              className="mt-4 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm text-xs h-8">
              <Plus size={14} className="mr-1.5" />
              Start Request
            </Button>
          </div>
        )}

        {/* Table */}
        {!loading && consultations.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Visa Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consultations.map((req) => (
                    <tr
                      key={req.id}
                      onClick={() =>
                        navigate(
                          `/dashboard/visa-status/summary/details/${req.id}`,
                        )
                      }
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                      {/* Destination */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {getCountryFlag(req.countryCode)}
                          </span>
                          <span className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                            {req.destination}
                          </span>
                        </div>
                      </td>

                      {/* Visa type */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {req.visaType}
                        </span>
                      </td>

                      {/* Date submitted + meeting type */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-600">
                            {req.submissionDate}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wide">
                            {req.meetingType}
                          </span>
                        </div>
                      </td>

                      {/* Status — VisaStatusBadge replaces inline getStatusColor() */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <VisaStatusBadge status={req.status} />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/dashboard/visa-status/summary/details/${req.id}`,
                            );
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
