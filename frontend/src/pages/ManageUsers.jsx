import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import Swal from 'sweetalert2';
import { UserX, UserCheck, Trash2, Search } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await adminService.getUsers();
            setUsers(res.data);
        } catch (err) {
            Swal.fire('Error', 'Failed to fetch users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = async (user) => {
        const action = user.enabled ? 'block' : 'unblock';
        const result = await Swal.fire({
            title: `Are you sure?`,
            text: `You are about to ${action} ${user.fullname}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: user.enabled ? '#d33' : '#3085d6',
            confirmButtonText: `Yes, ${action}!`
        });

        if (result.isConfirmed) {
            try {
                await adminService.toggleUserBlock(user.id);
                Swal.fire('Updated!', `User has been ${action}ed.`, 'success');
                fetchUsers();
            } catch (err) {
                Swal.fire('Error', 'Action failed', 'error');
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete User?',
            text: "This action cannot be undone!",
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await adminService.deleteUser(id);
                Swal.fire('Deleted!', 'User has been removed.', 'success');
                fetchUsers();
            } catch (err) {
                Swal.fire('Error', 'Deletion failed', 'error');
            }
        }
    };

    const filteredUsers = users.filter(user => 
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center items-center h-full text-2xl font-bold">Loading User Directory...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">User Management</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search passengers..." 
                        className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-railway-blue outline-none w-64 md:w-80 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Full Name</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Email Address</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Access Role</th>
                            <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-bold text-gray-900">{user.fullname}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-600">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${user.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {user.role.replace('ROLE_', '')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`flex items-center space-x-1.5 font-bold ${user.enabled ? 'text-green-600' : 'text-red-500'}`}>
                                        <div className={`w-2 h-2 rounded-full ${user.enabled ? 'bg-green-600' : 'bg-red-500'}`} />
                                        <span className="text-xs uppercase tracking-tight">{user.enabled ? 'Active' : 'Blocked'}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                                    <button 
                                        onClick={() => handleToggleBlock(user)}
                                        className={`inline-flex items-center p-2 rounded-lg transition-all ${user.enabled ? 'text-orange-500 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                                        title={user.enabled ? 'Block User' : 'Unblock User'}
                                    >
                                        {user.enabled ? <UserX size={18} /> : <UserCheck size={18} />}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="inline-flex items-center p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        title="Delete User"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center text-gray-500 font-bold italic bg-gray-50/30">
                        No passengers found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
