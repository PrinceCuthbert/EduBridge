// src/hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as userService from "../services/userService";

export function useUsers() {
  const queryClient = useQueryClient();

  // ── Fetch all users ────────────────────────────────────────────────────────
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers,
  });

  // ── Create or Update ───────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: ({ id, formData }) =>
      id ? userService.updateUser(id, formData) : userService.createUser(formData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(id ? "User updated successfully" : "User created successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save user");
    },
  });

  const saveUser = (id, formData) =>
    saveMutation.mutateAsync({ id, formData });

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const deleteUser = (user) => {
    toast(`Delete ${user.identity.firstName}?`, {
      description: "This will permanently remove the user.",
      action: {
        label: "Confirm Delete",
        onClick: () => deleteMutation.mutate(user.id),
      },
    });
  };

  return {
    users,
    isLoading,
    isError,
    submitting: saveMutation.isPending,
    saveUser,
    deleteUser,
  };
}
