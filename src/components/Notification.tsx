import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Box,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface Notification {
  id: string;
  message: string;
  read: boolean;
  timestamp: any;
}

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const q = query(collection(db, "notifications"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const notificationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Notification, 'id'>,
      }));
      setNotifications(notificationsData);
    };
    fetchNotifications();
  }, []);


  const addNotification = async (message: string) => {
    await addDoc(collection(db, "notifications"), { message, read: false, timestamp: serverTimestamp() });
    const q = query(collection(db, "notifications"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const notificationsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Notification, 'id'>,
    }));
    setNotifications(notificationsData);
  };


  const markAsRead = async (id: string) => {
    const notificationRef = doc(db, "notifications", id);
    await updateDoc(notificationRef, { read: true });
    const q = query(collection(db, "notifications"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const notificationsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Notification, 'id'>,
    }));
    setNotifications(notificationsData);
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Notifications
        </Typography>
        <Box mb={2}>
          <Button variant="contained" color="primary" onClick={() => addNotification('Button 1 clicked')} sx={{ mr: 1 }}>
            Button 1
          </Button>
          <Button variant="contained" color="primary" onClick={() => addNotification('Button 2 clicked')} sx={{ mr: 1 }}>
            Button 2
          </Button>
          <Button variant="contained" color="primary" onClick={() => addNotification('Button 3 clicked')}>
            Button 3
          </Button>
        </Box>
        <Paper elevation={3}>
          <List>
            {notifications.map(notification => (
              <ListItem key={notification.id} divider>
                <ListItemText primary={notification.message} />
                <ListItemSecondaryAction>
                  {notification.read ? (
                    <Typography variant="body2" color="textSecondary">
                      Read
                    </Typography>
                  ) : (
                    <IconButton edge="end" color="primary" onClick={() => markAsRead(notification.id)}>
                      <CheckIcon />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default Notification;
