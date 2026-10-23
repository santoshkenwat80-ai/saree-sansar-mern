import { useState, useEffect } from "react";
import { Search, Shield, User as UserIcon, RefreshCw, Calendar } from "lucide-react";
import { adminService } from "../../services/adminService";
import { formatINR, formatDate } from "../../utils/currency";
import { Loader } from "../../components/common/Loader";
export const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadUsers();
  }, []);
  const filtered = users.filter(
    (u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()) || u.phone?.includes(search)
  );
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Patrons &amp; Accounts
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time directory of registered patrons stored in MongoDB Atlas and backend
          </p>
        </div>
        <button
    onClick={loadUsers}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
  >
          <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
          <span>Refresh List</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
    type="text"
    placeholder="Search patron by name, email, or mobile..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#881930]"
  />
        </div>
        <span className="text-xs text-stone-500 font-mono">
          Total Registered Users: <strong>{users.length}</strong>
        </span>
      </div>

      {loading ? <Loader message="Fetching patrons from MongoDB database..." /> : <div className="bg-white rounded-xl border border-stone-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">User Profile</th>
                  <th className="px-5 py-3 font-semibold">Contact Mobile</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Registration Date</th>
                  <th className="px-5 py-3 font-semibold">Orders Placed</th>
                  <th className="px-5 py-3 font-semibold">Total Spend</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((u) => <tr key={u.id || u.email} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#f5eedf] text-[#6b1426] flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900">{u.name}</p>
                        <p className="text-[10px] text-stone-400 font-mono">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-stone-700">{u.phone || "N/A"}</td>
                    <td className="px-5 py-3.5">
                      {u.role === "admin" ? <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#881930] bg-rose-50 px-2 py-0.5 rounded">
                          <Shield className="w-3 h-3" />
                          Admin
                        </span> : <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                          <UserIcon className="w-3 h-3" />
                          Customer
                        </span>}
                    </td>
                    <td className="px-5 py-3.5 text-stone-500 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{u.createdAt ? formatDate(u.createdAt) : "Recent"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-stone-900">
                      {u.ordersCount || 0} orders
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-[#6b1426]">
                      {formatINR(u.totalSpend || 0)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        {u.status || "Active Patron"}
                      </span>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>}
    </div>;
};
export default UsersManagement;
