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
            confirmButtonColor: user.enabled ? '#d33' : '#059669',
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

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-3 border-railway-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-base font-black text-railway-dark tracking-tight uppercase">User Management</h1>
                    <p className="text-railway-silver text-xs font-medium">{users.length} registered users</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-railway-primary outline-none w-48 md:w-64 text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Role</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold text-railway-silver uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-right text-[10px] font-bold text-railway-silver uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-7 h-7 rounded-full bg-railway-primary/10 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-railway-primary">{user.fullname.charAt(0)}</span>
                                        </div>
                                        <span className="font-semibold text-railway-dark text-sm">{user.fullname}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-500">{user.email}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.role === 'ROLE_ADMIN' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-railway-primary/10 text-railway-primary border border-railway-primary/10'}`}>
                                        {user.role.replace('ROLE_', '')}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`flex items-center space-x-1 font-semibold text-xs ${user.enabled ? 'text-green-600' : 'text-red-500'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span>{user.enabled ? 'Active' : 'Blocked'}</span>
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right space-x-1">
                                    <button 
                                        onClick={() => handleToggleBlock(user)}
                                        className={`inline-flex items-center p-1.5 rounded-lg transition-all ${user.enabled ? 'text-amber-500 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                                        title={user.enabled ? 'Block' : 'Unblock'}
                                    >
                                        {user.enabled ? <UserX size={14} /> : <UserCheck size={14} />}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        className="inline-flex items-center p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-railway-silver text-sm font-medium">No users found.</div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
