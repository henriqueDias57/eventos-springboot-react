import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
      {icon || <InboxIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />}
      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
        {title || 'Nenhum registro encontrado'}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.disabled', mb: 3, maxWidth: 360, mx: 'auto' }}>
        {description || 'Comece adicionando o primeiro registro clicando no botão abaixo.'}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>{actionLabel}</Button>
      )}
    </Box>
  );
}
