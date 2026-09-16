import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const [passkey, setPasskey] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(passkey);
            if (success) {
                navigate('/');
            } else {
                setError('Invalid passkey');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 700 }}>Admin Login</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Sign in to manage submissions</p>
                </div>
                
                {error && (
                    <div style={{ background: '#fef2f2', color: 'var(--danger)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex-col gap-4">
                    <div className="form-group">
                    <label htmlFor="passkey">Dashboard Passkey</label>
                    <div className="input-with-icon">
                        <Lock size={18} className="input-icon" />
                        <input
                            type="password"
                            id="passkey"
                            value={passkey}
                            onChange={(e) => setPasskey(e.target.value)}
                            placeholder="Enter unlock key"
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="login-btn"
                    disabled={isLoading}
                >
                    {isLoading ? 'Unlocking...' : 'Unlock Dashboard'}
                </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
