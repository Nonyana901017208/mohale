import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [editUsername, setEditUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fetch users from the backend
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/users', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
            setError('');
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Error fetching users');
        }
        setLoading(false);
    };

    const findUser = (username) => users.find(user => user.username === username);

    const handleAddUser = async () => {
        if (!username || !password) {
            alert('All fields are required.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message && errorData.message.includes('Username already exists')) {
                    alert('Username already exists.');
                } else {
                    throw new Error('Failed to add user');
                }
            } else {
                const newUser = await response.json(); // Assume the API returns the newly created user
                setUsers((prevUsers) => [...prevUsers, newUser]); // Add new user to the state
                alert('User added successfully.');
                resetAddFields();
            }
        } catch (error) {
            console.error('Error adding user:', error);
            setError('Error adding user');
        }
        setLoading(false);
    };

    const handleEditUser = (username) => {
        const user = findUser(username);
        if (user) {
            setEditUsername(user.username);
            setNewPassword('');
        }
    };

    const handleSaveEditUser = async () => {
        const user = findUser(editUsername);
        if (!user) {
            alert('User not found.');
            return;
        }

        const updatedUser = {
            ...user,
            password: newPassword || user.password
        };

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/users/${editUsername}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            });
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message && errorData.message.includes('User not found')) {
                    alert('User not found.');
                } else {
                    throw new Error('Failed to update user');
                }
            } else {
                alert('User updated successfully.');
                resetEditFields();
                fetchUsers();
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Error updating user');
        }
        setLoading(false);
    };

    const handleDeleteUser = async (usernameToDelete) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5001/api/users/${usernameToDelete}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!response.ok) {
                    throw new Error('Failed to delete user');
                }
                alert('User deleted successfully.');
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                setError('Error deleting user');
            }
            setLoading(false);
        }
    };

    const resetAddFields = () => {
        setUsername('');
        setPassword('');
    };

    const resetEditFields = () => {
        setEditUsername('');
        setNewPassword('');
    };

    return (
        <div className="user-management-container">
            <h1>User Management</h1>
            <h3>Manage Users</h3>

            {/* Add User */}
            <div className="form-container">
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button onClick={handleAddUser} disabled={loading}>
                    {loading ? 'Adding User...' : 'Add User'}
                </button>
            </div>

            {/* Display Registered Users in a Table */}
            <div className="user-list">
                <h2>Registered Users</h2>
                {error && <p className="error-message">{error}</p>}
                {loading && <p>Loading...</p>}
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Edit / Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.username}>
                                <td>{user.username}</td>
                                <td>
                                    <button onClick={() => handleEditUser(user.username)}>Edit</button>
                                    <button onClick={() => handleDeleteUser(user.username)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Conditionally show the editing form when a user is being edited */}
            {editUsername && (
                <div className="edit-form-container">
                    <h3>Edit User: {editUsername}</h3>
                    <input 
                        type="password" 
                        placeholder="New Password (leave empty to keep current)" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                    />
                    <button onClick={handleSaveEditUser} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={resetEditFields}>Cancel</button>
                </div>
            )}

            <p>
                Already Registered? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default UserManagement;
