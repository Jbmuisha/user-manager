"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";
import { updateUser, ApiError } from "../lib/userService";
import { User, UserRole } from "../types/user";

type Props = {
  open: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  user: User | null;
};

const roles: UserRole[] = [
  "intern",
  "developer",
  "it_system_admin",
];

export default function EditUserModal({
  open,
  onClose,
  onUserUpdated,
  user,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("intern");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setRole("intern");
      setIsActive(true);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");

      const safeRole = roles.includes(user.role as UserRole)
        ? (user.role as UserRole)
        : "intern";

      setRole(safeRole);
      setIsActive(user.is_active ?? true);
    }
  }, [open, user]);

  if (!open || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      toast.error("Name and Email are required");
      return;
    }

    try {
      setLoading(true);

      await updateUser(user.id, {
        name: trimmedName,
        email: trimmedEmail,
        role,
        is_active: isActive,
      });

      toast.success("User updated successfully");
      onUserUpdated();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to update user");
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
        "& .MuiPaper-root": {
          borderRadius: 3,
          padding: 1,
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Edit User
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update user information
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
          {/* Name */}
          <TextField
            label="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            fullWidth
            required
          />

          {/* Email */}
          <TextField
            label="Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            fullWidth
            required
          />

          {/* Role */}
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              {roles.map((r) => (
                <MenuItem key={r} value={r}>
                  {r.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Active Status */}
          <FormControlLabel
            control={
              <Checkbox
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                color="primary"
              />
            }
            label="Active User"
          />
        </DialogContent>

        <DialogActions sx={{ padding: 2, pt: 0 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
