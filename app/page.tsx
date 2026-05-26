"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Container,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import toast from "react-hot-toast";
import { getUsers, deleteUser, ApiError } from "@/lib/userService";
import { User } from "./types/user";
import CreateUserModal from "@/components/CreateUserModal";
import EditUserModal from "@/components/EditUserModal";
import UserDetailsModal from "@/components/UserDetailsModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

export default function Home() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [deleteUserData, setDeleteUserData] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: () => getUsers(),
    retry: 1,
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    const matchesStatus = statusFilter === "" || 
      (statusFilter === "active" && user.is_active) || 
      (statusFilter === "inactive" && !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = (user: User) => {
    setDeleteUserData(user);
  };

  const getErrorMessage = () => {
    if (error instanceof ApiError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "Failed to load users";
  };

  const isConnectionError = error instanceof ApiError && error.status === 0;

  const uniqueRoles = [...new Set(users.map(u => u.role))];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
     
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }} className="animated-title">
          Users Management 
        </Typography>
<Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          className="btn-hover-effect"
          sx={{
            backgroundColor: "#4f46e5",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            "&:hover": {
              backgroundColor: "#4338ca",
            },
          }}
        >
          Create User
      </Button>
      </Box>    
   <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 3,
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: "center" }}>
          {/* Search */}
          <TextField
            placeholder="Search by name, email or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }
            }}
            sx={{ flex: 1, 
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4f46e5",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4f46e5",
                },
              }
            }}
            size="small"
          />
          
       
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              label="Role"
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4f46e5",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4f46e5",
                },
              }}
            >
              <MenuItem value="">All Roles</MenuItem>
              {uniqueRoles.map(role => (
                <MenuItem key={role} value={role}>
                  {role.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

         
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4f46e5",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#4f46e5",
                },
              }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

     
      {error && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          {isConnectionError ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <WifiOffIcon sx={{ fontSize: 48, color: "error.main" }} />
              <Typography variant="h6" color="error">
                Cannot connect to server
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Backend is not running at http://35.178.111.40:8000
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Please start the backend server and refresh
              </Typography>
            </Box>
          ) : (
            <Typography color="error">{getErrorMessage()}</Typography>
          )}
        </Box>
)}

      {!isLoading && !error && (
<TableContainer
          component={Paper}
          className="card-hover-lift"
          sx={{ 
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            overflow: "hidden",
          }}
        >
          {filteredUsers.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography color="text.secondary">
                {searchQuery || roleFilter || statusFilter 
                  ? "No users found matching your filters." 
                  : "No users yet. Click 'Create User' to add one."}
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#4f46e5" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "white", py: 2 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white", py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white", py: 2 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white", py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white", py: 2 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow 
                    key={user.id} 
                    hover
                    sx={{ 
                      backgroundColor: index % 2 === 0 ? "#f8fafc" : "white",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#eef2ff",
                      },
                      "&:last-child td": { borderBottom: 0 }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, py: 2, color: "#1e293b" }}>{user.name}</TableCell>
                    <TableCell sx={{ py: 2, color: "#64748b" }}>{user.email}</TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={user.role.replace(/_/g, " ")}
                        size="small"
                        sx={{
                          backgroundColor: "#e0e7ff",
                          color: "#4338ca",
                          fontWeight: 600,
                          borderRadius: "16px",
                          fontSize: "0.75rem",
                          height: 26,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
<Chip
                        label={user.is_active ? "Active" : "Inactive"}
                        size="small"
                        className={user.is_active ? "status-pulse" : ""}
                        sx={{
                          backgroundColor: user.is_active ? "#dcfce7" : "#f1f5f9",
                          color: user.is_active ? "#166534" : "#64748b",
                          fontWeight: 600,
                          borderRadius: "16px",
                          fontSize: "0.75rem",
                          height: 26,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ py: 2 }}>
<IconButton
                        onClick={() => setViewUser(user)}
                        color="default"
                        title="View Details"
                        size="small"
                        className="icon-bounce"
                        sx={{ 
                          color: "#64748b",
                          "&:hover": { backgroundColor: "#f1f5f9", color: "#4f46e5" }
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setEditUser(user)}
                        color="primary"
                        title="Edit User"
                        size="small"
                        className="icon-bounce"
                        sx={{ 
                          color: "#4f46e5",
                          "&:hover": { backgroundColor: "#e0e7ff" }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(user)}
                        color="error"
                        title="Delete User"
                        size="small"
                        className="icon-bounce"
                        sx={{ 
                          "&:hover": { backgroundColor: "#fee2e2" }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      )}

      
      {!isLoading && !error && filteredUsers.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Showing {filteredUsers.length} of {users.length} users
        </Typography>
      )}

      
      {createOpen && (
        <CreateUserModal
          open={true}
          onClose={() => setCreateOpen(false)}
          onUserCreated={() => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User created successfully");
          }}
        />
      )}

      {editUser && (
        <EditUserModal
          open={true}
          user={editUser}
          onClose={() => setEditUser(null)}
          onUserUpdated={() => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User updated successfully");
          }}
        />
      )}

      {viewUser && (
        <UserDetailsModal
          open={true}
          user={viewUser}
          onClose={() => setViewUser(null)}
        />
      )}

      {deleteUserData && (
        <DeleteConfirmModal
          open={true}
          user={deleteUserData}
          onClose={() => setDeleteUserData(null)}
          onUserDeleted={() => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User deleted successfully");
          }}
        />
      )}
    </Container>
  );
}
