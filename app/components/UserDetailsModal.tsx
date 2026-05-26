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
        "& .MuiPaper-root": {
          borderRadius: 3,
          padding: 1,
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
            User Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View user information
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        {/* Avatar */}
        <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "primary.main",
              fontSize: 40,
            }}
          >
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
        </Box>

        {/* Name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
          <PersonIcon color="action" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {user.name}
            </Typography>
          </Box>
        </Box>

        {/* Email */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
          <EmailIcon color="action" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {user.email}
            </Typography>
          </Box>
        </Box>

        {/* Role */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
          <BadgeIcon color="action" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Role
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {user.role.replace(/_/g, " ")}
            </Typography>
          </Box>
        </Box>

        {/* Status */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Box>
              <Chip
                label={user.is_active ? "Active" : "Inactive"}
                color={user.is_active ? "success" : "default"}
                size="small"
              />
            </Box>
          </Box>
        </Box>

        {/* Created At */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
          <CalendarTodayIcon color="action" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {formattedDate}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: 2, pt: 0 }}>
        <Button onClick={onClose} variant="contained" fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
