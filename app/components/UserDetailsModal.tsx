"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { User } from "../types/user";

type Props = {
  open: boolean;
  user: User | null;
  onClose: () => void;
};

export default function UserDetailsModal({ open, user, onClose }: Props) {
  if (!open || !user) return null;

  const formattedDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

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
          <Box>
            <Typography variant="h5" component="div" sx={{ fontWeight: "bold", color: "#1e293b" }}>
              User Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View user information
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 3 }}>
        {/* Avatar */}
        <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#4f46e5",
              fontSize: 40,
            }}
          >
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
        </Box>

        {/* Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
          <PersonIcon sx={{ color: "#64748b" }} />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#1e293b" }}>
              {user.name}
            </Typography>
          </Box>
        </Box>

        {/* Email */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
          <EmailIcon sx={{ color: "#64748b" }} />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#1e293b" }}>
              {user.email}
            </Typography>
          </Box>
        </Box>

        {/* Role */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
          <BadgeIcon sx={{ color: "#64748b" }} />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Role
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#1e293b", textTransform: "capitalize" }}>
              {user.role.replace(/_/g, " ")}
            </Typography>
          </Box>
        </Box>

        {/* Status */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={user.is_active ? "Active" : "Inactive"}
                size="small"
                sx={{
                  backgroundColor: user.is_active ? "#dcfce7" : "#f1f5f9",
                  color: user.is_active ? "#166534" : "#64748b",
                  fontWeight: 600,
                  borderRadius: "16px",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Created At */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
          <CalendarTodayIcon sx={{ color: "#64748b" }} />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#1e293b" }}>
              {formattedDate}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          fullWidth
          sx={{
            backgroundColor: "#4f46e5",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#4338ca" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
