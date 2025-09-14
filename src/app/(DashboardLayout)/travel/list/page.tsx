'use client'
import { Grid, Box, Button, Link } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { useEffect } from 'react';
import { app, analytics } from "@/firebase/firebase";
import ListofTrips from '../../components/dashboard/ListofTrips';


const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      
        {/* Trips List */}
        <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ListofTrips />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>

  );
}

export default Dashboard;
