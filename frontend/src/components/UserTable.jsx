const UserTable = ({
  users,
  page,
  totalPages,
  onPageChange,
  onToggleStatus,
  isLoading,
  actionUserId,
}) => {
  return (
    <div className="card">
      <div className="card__header">
        <h2 className="card__title">Users</h2>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="data-table__empty">
                  {isLoading ? 'Loading users…' : 'No users found.'}
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isProcessing = actionUserId === user.id;
                const isActive = user.status === 'ACTIVE';
                return (
                  <tr key={user.id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className={isActive ? 'status status--active' : 'status status--inactive'}>
                      {user.status}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="button button--link"
                        onClick={() => onToggleStatus(user)}
                        disabled={isProcessing || isLoading}
                      >
                        {isProcessing
                          ? 'Processing…'
                          : isActive
                          ? 'Deactivate'
                          : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="table-pagination">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isLoading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserTable;
