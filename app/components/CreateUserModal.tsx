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
import { createUser, ApiError } from "../lib/userService";
import { UserRole } from "../types/user";

type Props = {
  open: boolean;
  onClose: () => void;
  onUserCreated: () => void;
};

const roles: UserRole[] = [
  "intern",
  "developer",
  "it_system_admin",
];

export default function CreateUserModal({
  open,
  onClose,
  onUserCreated,
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

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("intern");
    setIsActive(true);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!open) return null;

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

      await createUser({
        name: trimmedName,
        email: trimmedEmail,
        role,
        is_active: isActive,
      });

      toast.success("User created successfully");
      onUserCreated();
      handleClose();
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to create user");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
<Dialog 
      className="modal-enter"
      open={open}
      onClose={handleClose}
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
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1e293b" }}>
              Create User
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add a new user to the system
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: "#64748b" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 3 }}>
          <TextField
            label="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name"
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4f46e5",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4f46e5",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#4f46e5",
              },
            }}
          />
          <TextField
            label="Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4f46e5",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4f46e5",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#4f46e5",
              },
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value as UserRole)}
              sx={{
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4f46e5",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4f46e5",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#4f46e5",
                },
              }}
            >
              {roles.map((r) => (
                <MenuItem key={r} value={r}>
                  {r.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                sx={{
                  color: "#4f46e5",
                  "&.Mui-checked": {
                    color: "#4f46e5",
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: "#1e293b", fontWeight: 500 }}>
                Active User
              </Typography>
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>
          <Button 
            onClick={handleClose} 
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
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{
              backgroundColor: "#4f46e5",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": {
                backgroundColor: "#4338ca",
              },
              "&:disabled": {
                backgroundColor: "#cbd5e1",
              },
            }}
          >
            {loading ? "Creating..." : "Create User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
