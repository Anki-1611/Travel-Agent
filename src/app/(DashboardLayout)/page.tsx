'use client';

import { Grid, Box, Button, Link as MuiLink } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebase';
import ListofTrips from './components/dashboard/ListofTrips';

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // -------------------------
  // Check authentication
  // -------------------------
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/authentication/login'); // redirect if not signed in
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return null; // or a loader spinner

  return (
    <PageContainer title="Dashboard" description="This is Dashboard">
      <Box>
        {/* Trips List */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ListofTrips />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
