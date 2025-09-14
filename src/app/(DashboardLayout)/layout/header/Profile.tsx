"use client";

import React, { useEffect, useState } from "react";
import { Box, Menu, Button, MenuItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { logoutUser } from "@/app/services/authService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { IconListCheck, IconMail, IconUser } from "@tabler/icons-react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserName(user.displayName || user.email || "User");
      else router.push("/authentication/login");
    });
    return () => unsubscribe();
  }, [router]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/authentication/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Box>
      <Button
        color="inherit"
        onClick={handleClick}
        sx={{ textTransform: "none", fontWeight: 500 }}
        endIcon={<ArrowDropDownIcon />}
      >
        {userName}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{ "& .MuiMenu-paper": { width: 220 } }}
      >
        <MenuItem>
          <ListItemIcon><IconUser width={20} /></ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        <MenuItem>
          <ListItemIcon><IconMail width={20} /></ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>

        <MenuItem>
          <ListItemIcon><IconListCheck width={20} /></ListItemIcon>
          <ListItemText>My Tasks</ListItemText>
        </MenuItem>

        <Box mt={1} px={2}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
