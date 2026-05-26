"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import toast from "react-hot-toast";
import { deleteUser, ApiError } from "../lib/userService";
import { User } from "../types/user";

type Props = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onUserDeleted: () => void;
};

export default function DeleteConfirmModal({
  open,
  user,
  onClose,
  onUserDeleted,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!open || !user) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteUser(user.id);
      toast.success("User deleted successfully");
      onUserDeleted();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to delete user");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ bgcolor: "error.light", borderRadius: 2, p: 1, display: "flex" }}>
              <WarningAmberIcon sx={{ color: "error.main" }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Delete User
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This action cannot be undone
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body1">
          Are you sure you want to delete{" "}
          <Typography component="span" sx={{ fontWeight: "bold" }}>
            {user.name}
          </Typography>
          ? This will permanently remove the user and all associated data.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>
          {loading ? "Deleting..." : "Delete User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
