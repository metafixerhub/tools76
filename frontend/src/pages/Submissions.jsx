import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Filter, Eye, Trash2 } from 'lucide-react';

const Submissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/submissions');
            setSubmissions(res.data.data);
        } catch (error) {
            console.error("Error fetching submissions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this submission?")) {
            try {
                await api.delete(`/submissions/${id}`);
                fetchSubmissions();
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Failed to delete submission.");
            }
        }
    };

    const filteredData = submissions.filter(sub => 
        sub.fullName.toLowerCase().includes(search.toLowerCase()) || 
        sub.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex items-center justify-between" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Submissions</h1>
                
                <div className="flex gap-4">
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            type="text" 
                            placeholder="Search names or emails..." 
                            className="input-field" 
                            style={{ paddingLeft: '2.5rem', width: '250px' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="btn-primary flex items-center gap-2" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email & Phone</th>
                                    <th>Location</th>
                                    <th>Interests</th>
                                    <th>Submitted</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No submissions found.</td>
                                    </tr>
                                ) : (
                                    filteredData.map(sub => (
                                        <tr key={sub._id}>
                                            <td style={{ fontWeight: 500 }}>{sub.fullName}</td>
                                            <td>
                                                <div>{sub.email}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sub.phone}</div>
                                            </td>
                                            <td>{sub.city}, {sub.state}</td>
                                            <td>
                                                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                                    {sub.interests.map(i => (
                                                        <span key={i} style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-color)', borderRadius: '4px', fontSize: '0.75rem' }}>{i}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={{ color: 'var(--text-secondary)' }}>
                                                {new Date(sub.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <button style={{ color: 'var(--primary)' }} title="View Details"><Eye size={18} /></button>
                                                    <button onClick={() => handleDelete(sub._id)} style={{ color: 'var(--danger)' }} title="Delete"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Submissions;
