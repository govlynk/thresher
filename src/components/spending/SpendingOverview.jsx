import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Chip,
  useTheme 
} from '@mui/material';
import { 
  TrendingUp, 
  Building2, 
  Award, 
  DollarSign 
} from 'lucide-react';

export default function SpendingOverview({ data, company }) {
  const theme = useTheme();

  const totalSpending = data?.results?.reduce((sum, award) => sum + (award.Award_Amount || 0), 0) || 0;
  const averageAwardSize = totalSpending / (data?.results?.length || 1);
  const uniqueAgencies = new Set(data?.results?.map(award => award.Awarding_Agency)).size || 0;

  const metrics = [
    {
      title: 'Total Contract Value',
      value: new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(totalSpending),
      icon: DollarSign,
      color: theme.palette.success.main
    },
    {
      title: 'Average Award Size',
      value: new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(averageAwardSize),
      icon: TrendingUp,
      color: theme.palette.primary.main
    },
    {
      title: 'Total Awards',
      value: data?.results?.length || 0,
      icon: Award,
      color: theme.palette.warning.main
    },
    {
      title: 'Unique Agencies',
      value: uniqueAgencies,
      icon: Building2,
      color: theme.palette.info.main
    }
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Spending Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analysis based on {company.naicsCode?.length || 0} NAICS codes
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {company.naicsCode?.map(code => (
              <Chip 
                key={code} 
                label={code}
                size="small"
                variant="outlined"
                color={code === company.primaryNaics ? "primary" : "default"}
              />
            ))}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {metrics.map((metric) => (
            <Grid item xs={12} sm={6} md={3} key={metric.title}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: `${metric.color}15`,
                    color: metric.color,
                  }}
                >
                  <metric.icon size={20} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}