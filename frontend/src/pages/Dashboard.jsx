import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { activateUser, deactivateUser, getUsers } from '../api/admin.api';
import AdminRoute from '../routes/AdminRoute';
import UserTable from '../components/UserTable';
import ConfirmModal from '../components/ConfirmModal';

const PAGE_LIMIT = 10;

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'ADMIN';
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalUsers: 0, limit: PAGE_LIMIT });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionUser, setActionUser] = useState(null);
  const [actionUserId, setActionUserId] = useState(null);

  const isAdminRoute = useMemo(() => location.pathname.startsWith('/admin'), [location.pathname]);

  const loadUsers = useCallback(
    async (requestedPage = 1) => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getUsers({ page: requestedPage, limit: PAGE_LIMIT });
        const { users: fetchedUsers, pagination: meta } = response?.data?.data || {};

        const nextUsers = Array.isArray(fetchedUsers) ? fetchedUsers : [];
        const currentPage = meta?.page ?? requestedPage;
        const totalPages = meta?.totalPages ?? 1;
        const totalUsers = meta?.totalUsers ?? nextUsers.length;
        const limit = meta?.limit ?? PAGE_LIMIT;

        setUsers(nextUsers);
        setPage(currentPage);
        setPagination({
          totalPages: Math.max(totalPages, 1),
          totalUsers,
          limit,
        });
      } catch (requestError) {
        const status = requestError?.response?.status;
        const responseMessage = requestError?.response?.data?.message;
        if (status === 403) {
          setError(responseMessage || 'Unauthorized');
          setUsers([]);
          setPagination({ totalPages: 1, totalUsers: 0, limit: PAGE_LIMIT });
        } else {
          setError(responseMessage || 'Unable to load users.');
        }
      } finally {
        setIsLoading(false);
        setActionUserId(null);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isAdmin || !isAdminRoute) {
      return;
    }
    loadUsers(page);
  }, [isAdmin, isAdminRoute, loadUsers, page]);

  useEffect(() => {
    if (!isAdminRoute) {
      return;
    }
    setPage(1);
  }, [isAdminRoute]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage === page || nextPage > pagination.totalPages) {
      return;
    }
    setPage(nextPage);
  };

  const handleToggleStatus = (targetUser) => {
    if (!targetUser || targetUser.id === user?.id || targetUser.role === 'ADMIN') {
      return;
    }
    setActionUser(targetUser);
  };

  const handleCloseModal = () => {
    setActionUser(null);
  };

  const handleConfirmStatusChange = async () => {
    if (!actionUser) {
      return;
    }
    setActionUserId(actionUser.id);
    try {
      if (actionUser.id === user?.id || actionUser.role === 'ADMIN') {
        setError('Unauthorized');
        return;
      }
      if (actionUser.status === 'ACTIVE') {
        await deactivateUser(actionUser.id);
      } else {
        await activateUser(actionUser.id);
      }
      await loadUsers(page);
    } catch (requestError) {
      const status = requestError?.response?.status;
      const responseMessage = requestError?.response?.data?.message;
      if (status === 403) {
        setError(responseMessage || 'Unauthorized');
      } else {
        setError(responseMessage || 'Unable to update user status.');
      }
    } finally {
      setActionUser(null);
    }
  };

  return (
    <section className="page">
      <h1 className="page__title">Dashboard</h1>
      {isAdmin ? (
        <AdminRoute>
          <div className="page__section">
            <p className="page__subtitle">
              {pagination.totalUsers} user{pagination.totalUsers === 1 ? '' : 's'} in the system.
            </p>
            {error && <div className="alert alert--error">{error}</div>}
            <UserTable
              users={users}
              page={page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              onToggleStatus={handleToggleStatus}
              isLoading={isLoading}
              actionUserId={actionUserId}
              currentUserId={user?.id}
              currentUserRole={user?.role}
            />
          </div>
          {actionUser && (
            <ConfirmModal
              title={`${actionUser.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} User`}
              message={`Are you sure you want to ${
                actionUser.status === 'ACTIVE' ? 'deactivate' : 'activate'
              } ${actionUser.fullName}?`}
              confirmLabel={actionUser.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              onConfirm={handleConfirmStatusChange}
              onCancel={handleCloseModal}
            />
          )}
        </AdminRoute>
      ) : (
        <div className="card">
          <h2 className="card__title">Welcome back, {user?.fullName}</h2>
          <p className="card__body">
            Review and update your profile from the Profile page. Your current status is {user?.status}.
          </p>
          <dl className="profile-summary">
            <div>
              <dt>Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{user?.role}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{user?.status}</dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
