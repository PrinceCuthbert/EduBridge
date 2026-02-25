import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import PaymentSummaryCard from "@/components/payment/PaymentSummaryCard";
import CardPaymentForm from "@/components/payment/CardPaymentForm";
import MobileMoneyForm from "@/components/payment/MobileMoneyForm";

export default function VisaPaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('card');
  const requestData = location.state;

  useEffect(() => {
    // Redirect back if no state is found (happens on refresh or direct navigation)
    if (!requestData) {
      toast.error("No request data found. Please start over.");
      navigate(-1);
    }
  }, [requestData, navigate]);

  if (!requestData) return null;

  const serviceFee = 10;
  const totalAmount = (requestData.fee || 0) + serviceFee;

  const handlePayment = () => {
    // Mock payment success
    toast.success("Payment successful! Your request has been sent.");
    // Navigate back to the visa status dashboard or summary
    navigate("/student-dashboard/visa-case"); 
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-serif text-slate-900 tracking-tight">
            Visa Consultation Payment
          </h1>
          <p className="text-sm text-slate-500">
            Review your request and complete payment securely.
          </p>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* LEFT — SUMMARY */}
        <div className="lg:col-span-3">
          <PaymentSummaryCard requestData={requestData} />
        </div>

        {/* RIGHT — PAYMENT AREA */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-serif text-slate-900 mb-5">
              Payment Method
            </h2>

            {/* Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setActiveTab('card')}
                className={`border rounded-lg py-2 text-sm font-medium transition-colors ${
                  activeTab === 'card' 
                  ? 'border-slate-900 bg-slate-900 text-white' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Card
              </button>
              <button 
                onClick={() => setActiveTab('momo')}
                className={`border rounded-lg py-2 text-sm font-medium transition-colors ${
                  activeTab === 'momo' 
                  ? 'border-slate-900 bg-slate-900 text-white' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Mobile Money
              </button>
            </div>

            {/* Form */}
            {activeTab === 'card' ? (
              <CardPaymentForm amount={totalAmount} onSubmit={handlePayment} />
            ) : (
              <MobileMoneyForm amount={totalAmount} onSubmit={handlePayment} />
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}