import { Stack, Typography } from '@mui/material'

export default function PageHeader({ title, actions }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
      <Typography variant="h5">{title}</Typography>
      <Stack direction="row" spacing={1}>{actions}</Stack>
    </Stack>
  )
}


