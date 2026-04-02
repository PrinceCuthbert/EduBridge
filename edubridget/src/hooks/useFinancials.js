import { useQuery } from "@tanstack/react-query";
import {
  getFinancialStats,
  getRevenueByMonth,
  getApplicationsByMonth,
  getVisitorsByMonth,
} from "../services/financialService";

export const useFinancialStats = () => {
  return useQuery({
    queryKey: ["financialStats"],
    queryFn: getFinancialStats,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRevenueByMonth = () => {
  return useQuery({
    queryKey: ["revenueByMonth"],
    queryFn: getRevenueByMonth,
    staleTime: 5 * 60 * 1000,
  });
};

export const useApplicationsByMonth = () => {
  return useQuery({
    queryKey: ["applicationsByMonth"],
    queryFn: getApplicationsByMonth,
    staleTime: 5 * 60 * 1000,
  });
};

export const useVisitorsByMonth = () => {
  return useQuery({
    queryKey: ["visitorsByMonth"],
    queryFn: getVisitorsByMonth,
    staleTime: 5 * 60 * 1000,
  });
};
