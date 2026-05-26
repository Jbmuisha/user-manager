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
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
        >
          Create User
        </Button>
      </Box>

    
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
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
            sx={{ flex: 1 }}
            size="small"
          />
          
       
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              label="Role"
              onChange={(e) => setRoleFilter(e.target.value)}
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
        <TableContainer component={Paper}>
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
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell sx={{ fontWeight: "bold" }}>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role.replace(/_/g, " ")}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.is_active ? "Active" : "Inactive"}
                        size="small"
                        color={user.is_active ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => setViewUser(user)}
                        color="default"
                        title="View Details"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => setEditUser(user)}
                        color="primary"
                        title="Edit User"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(user)}
                        color="error"
                        title="Delete User"
                        size="small"
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
