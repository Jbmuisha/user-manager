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
<Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12)",
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, borderBottom: "1px solid #e2e8f0" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ bgcolor: "#fef3c7", borderRadius: 2, p: 1, display: "flex" }}>
              <WarningAmberIcon sx={{ color: "#d97706" }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1e293b" }}>
                Delete User
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This action cannot be undone
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body1" sx={{ color: "#475569" }}>
          Are you sure you want to delete{" "}
          <Typography component="span" sx={{ fontWeight: "bold", color: "#1e293b" }}>
            {user.name}
          </Typography>
          ? This will permanently remove the user and all associated data.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            borderRadius: 2,
            borderColor: "#e2e8f0",
            color: "#64748b",
            textTransform: "none",
            "&:hover": {
              borderColor: "#cbd5e1",
              backgroundColor: "#f8fafc",
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          variant="contained" 
          color="error" 
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": {
              backgroundColor: "#dc2626",
            },
          }}
        >
          {loading ? "Deleting..." : "Delete User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
