import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import ChatBox from '../components/ChatBox';
import { toast } from 'react-toastify';

const ResidentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const loadComplaints = async () => {
    try {
      const res = await api.get('/complaint/my');
      setComplaints(res.data);
    } catch (err) {
      toast.error('Error loading complaints');
    }
  };
  // just added
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter logic
  const filteredComplaints = complaints.filter(c => {
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/complaint', { title, category, description });
      toast.success('Complaint submitted successfully!');
      setTitle('');
      setCategory('Plumbing');
      setDescription('');
      loadComplaints();
    } catch (err) {
      toast.error('Error submitting complaint');
    }
    setLoading(false);
  };

  const openChatModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowChat(true);
  };

  const closeChatModal = () => {
    setSelectedComplaint(null);
    setShowChat(false);
  };

  const getStatusBadge = (status) => {
    if (status === 'Resolved') return 'bg-success';
    if (status === 'In Progress') return 'bg-warning text-dark';
    return 'bg-danger';
  };

  return (
    <div className="container-fluid" style={{ height: '100vh', overflow: 'hidden' }}>
      <div className="row h-100">

        {/* filter logic*/}
        <div className="p-3 d-flex gap-2 border-bottom">
          <input
            className="form-control"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select"
            style={{ width: '200px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>


        {/* LEFT SIDE - FORM */}
        <div className="col-lg-5 p-3 bg-light border-end">
          <div className="card shadow h-100">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-1">Welcome, {user?.name}</h4>
              <small>Flat No: {user?.flatNo || 'N/A'}</small>
            </div>

            <div className="card-body">
              <h5 className="mb-3">File a New Complaint</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Water leakage"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Security">Security</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your issue in detail..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - COMPLAINTS TABLE */}
        <div className="col-lg-7 p-3">
          <div className="card shadow h-100">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Complaints</h5>
              <span className="badge bg-light text-dark">{complaints.length} Total</span>
            </div>

            {/* Scroll sirf yaha hoga */}
            <div className="card-body p-0" style={{ overflowY: 'auto', height: 'calc(100vh - 120px)' }}>
              {complaints.length === 0 ? (
                <div className="text-center text-muted p-5">
                  <h6>No complaints yet</h6>
                  <p>File your first complaint from the left panel</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light sticky-top">
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map((c) => (
                        <tr
                          key={c._id}
                          onClick={() => openChatModal(c)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <strong>{c.title}</strong>
                            <br />
                            <small className="text-muted">
                              {c.aiSummary || c.description?.slice(0, 60)}...
                            </small>
                          </td>
                          <td>{c.category}</td>
                          <td>
                            <span className={`badge ${getStatusBadge(c.status)}`}>
                              {c.status}
                            </span>
                          </td>
                          <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Chat Modal */}
      {showChat && selectedComplaint && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050
        }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-primary text-white rounded-top">
              <h5 className="mb-0">Chat: {selectedComplaint.title}</h5>
              <button onClick={closeChatModal} className="btn btn-sm btn-light">
                ✕
              </button>
            </div>
            <div className="p-3" style={{ overflowY: 'auto' }}>
              <ChatBox complaintId={selectedComplaint._id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidentDashboard;