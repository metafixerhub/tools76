import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PatternLock from '../components/PatternLock';

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handlePatternSuccess = async () => {
        setError('');
        setIsLoading(true);

        try {
            // Automatically submit the secure passkey when pattern is correct
            const success = await login('nur1438nur');
            if (success) {
                navigate('/');
            } else {
                setError('Authentication failed');
            }
        } catch (err) {
            setError('Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePatternError = (msg) => {
        setError(msg);
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 700 }}>Admin Login</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Sign in to manage submissions</p>
                </div>
                
                {error && (
                    <div className="error-alert">
                        {error}
                    </div>
                )}
                
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div className="spinner" style={{ margin: '0 auto', borderColor: '#4F46E5', borderTopColor: 'transparent', borderRadius: '50%', width: '40px', height: '40px', borderWidth: '4px', borderStyle: 'solid', animation: 'spin 1s linear infinite' }}></div>
                        <p style={{ marginTop: '1rem', color: '#4F46E5' }}>Unlocking Dashboard...</p>
                    </div>
                ) : (
                    <PatternLock 
                        onSuccess={handlePatternSuccess} 
                        onError={handlePatternError} 
                    />
                )}
            </div>
        </div>
    );
};

export default Login;
