// components/Sidebar.tsx
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <List>
      <ListItem component={Link} to="/">
        <ListItemText primary="Inicio" />
      </ListItem>
      <ListItem component={Link} to="/upload">
        <ListItemText primary="Subir archivos" />
      </ListItem>
      <ListItem component={Link} to="/test">
        <ListItemText primary="Testear UF" />
      </ListItem>
    </List>
  );
}
