import React, { useEffect, useState } from 'react';
import styles from '@/styles/PetInfoComponent.module.css';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Router from 'next/router';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import { Menu, MenuItem, Snackbar, Alert } from '@mui/material';
import PetInfoSkeleton from "@/components/loading/PetInfoSkeleton";

export default function PetInfoComponent({ petUUID }) {
    const [pet, setPet] = useState(null);
    const [likedUsers, setLikedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [menuUserId, setMenuUserId] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const decodedPetId = petUUID ? atob(petUUID) : null;

    useEffect(() => {
        const fetchUserSession = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/session`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 401) {
                    Router.push('/login');
                    console.warn('No active session.');
                    return;
                }

                const data = await response.json();
                console.log('✅ Session found:', data);

                if (data.user.role == 'ADOPTER') {
                    Router.push('/profile');
                }
            } catch (error) {
                console.error('Error fetching session:', error);
            }
        };
        fetchUserSession();
    }, []);

    useEffect(() => {
        if (!decodedPetId) return;

        const fetchData = async () => {
            try {
                const petRes = await fetch(
                    `${API_URL}/api/pet/get-pet-detail/${decodedPetId}`,
                    { credentials: 'include' },
                );
                const petData = await petRes.json();
                if (!petRes.ok) throw new Error(petData);
                setPet(petData);

                const userRes = await fetch(
                    `${API_URL}/api/adoption-center/users-who-liked/${decodedPetId}`,
                    { credentials: 'include' },
                );
                const userData = await userRes.json();
                if (!userRes.ok) throw new Error(userData);
                setLikedUsers(userData);
            } catch (err) {
                setError(err.message || 'Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [decodedPetId]);

    const generateGradient = (name) => {
        if (!name) return '#f50057';

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const color1 = `hsl(${hash % 360}, 70%, 50%)`;
        const color2 = `hsl(${(hash * 3) % 360}, 70%, 60%)`;

        return `linear-gradient(135deg, ${color1}, ${color2})`;
    };

    const calculateAge = (birthdateStr) => {
        if (!birthdateStr) return 'Unknown';
        const birthdate = new Date(birthdateStr);
        const today = new Date();

        let age = today.getFullYear() - birthdate.getFullYear();
        const m = today.getMonth() - birthdate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }

        return age;
    };

    if (loading) return PetInfoSkeleton;
    if (error) return <p>Error: {error}</p>;

    const handleAdoptPet = async (userId) => {
        handleMenuClose();

        try {
            const response = await fetch(
                `${API_URL}/api/adoption-center/adopt-pet/${pet.id}/by/${userId}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                },
            );

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText);
            }

            setSnackbarMessage('Pet successfully adopted!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleMenuOpen = (event, userId) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuUserId(userId);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        setMenuUserId(null);
    };

    return decodedPetId ? (
        <div className={styles.dashboardWrapper}>
            <h2 className={styles.eventTitle}>🐾 Pet Detail 🐾</h2>

            <div className={styles.petInfoContainer}>
                <img
                    src={pet.image?.[0] || '/images/no_image_available.png'}
                    alt={pet.name}
                    className={styles.petInfoImage}
                />

                <div className={styles.petDetailsContent}>
                    <p>
                        <strong>✨Name:</strong> {pet.name}
                    </p>
                    <p>
                        <strong>🐶Breed:</strong> {pet.breed}
                    </p>
                    <p>
                        <strong>❔Status:</strong> {pet.availabilityStatus}
                    </p>
                    <p>
                        <strong>📅Birthdate:</strong>{' '}
                        {pet.birthdate
                            ? new Date(pet.birthdate).toLocaleDateString(
                                  'en-US',
                                  {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                  },
                              )
                            : 'Unknown'}
                    </p>

                    <p>
                        <strong>📝About:</strong> {pet.aboutMe}
                    </p>
                    <p>
                        <strong>🏠Availability:</strong> {pet.availabilityStatus}
                    </p>
                </div>
            </div>

            <h3 className={styles.eventTitle}>Liked by Users</h3>
            {likedUsers.length === 0 ? (
                <p className={styles.noLikesMessage}>
                    <p>No users have liked this pet yet. 💔</p>
                </p>
            ) : (
                <div className={styles.eventsGrid}>
                    <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem
                            onClick={() => {
                                handleAdoptPet(menuUserId);
                                handleMenuClose();
                            }}
                        >
                            Adopt for this user
                        </MenuItem>
                    </Menu>

                    {likedUsers.map((user) => (
                        <div
                            key={user.id}
                            className={styles.eventCard}
                            onClick={() => {
                                if (!pet || !user) return;

                                const petContext = {
                                    petId: pet.id,
                                    name: pet.name,
                                    image:
                                        pet.image?.[0] ||
                                        '/images/no_image_available.png',
                                    breed: pet.breed,
                                    age: calculateAge(pet.birthdate), // optionally format/calculate age
                                    gender: pet.spayedStatus || 'Unknown', // adjust if you have gender separate
                                };

                                sessionStorage.setItem(
                                    'petContext',
                                    JSON.stringify(petContext),
                                );
                                Router.push(`/chat/${user.id}`);
                            }}
                        >
                            <div className={styles.eventDetails}>
                                <div className={styles.petNameRow}>
                                    <div>
                                        <p className={styles.eventTitle}>
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className={styles.eventDescription}>
                                            {user.email}
                                        </p>
                                    </div>

                                    <div>
                                        <Avatar
                                            sx={{
                                                background: user.profilePhoto
                                                    ? 'transparent'
                                                    : generateGradient(user.firstName + (user.lastName || ''),),
                                                cursor: 'pointer',
                                                color: '#fff',
                                                zIndex: 100000,
                                                marginRight: '8px',
                                            }}
                                            src={user.profilePhoto || undefined}
                                        >
                                            {!user.profilePhoto && (
                                                <>
                                                    {user.firstName.charAt(0)}
                                                    {user.lastName
                                                        ? user.lastName.charAt(
                                                              0,
                                                          )
                                                        : ''}
                                                </>
                                            )}
                                        </Avatar>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation(); // prevent parent onClick
                                                handleMenuOpen(e, user.id);
                                            }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    ) : (
        <div className={styles.noConversationSelected}>
            <p>No Pet selected</p>
        </div>
    );
}

PetInfoComponent.propTypes = {
    petUUID: PropTypes.string,
};
