import React, { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { User } from '../../types/User';
import { Todo } from '../../types/Todo';
import { getUser } from '../../api';

type Props = {
  setSelectedTask: (taskId: number | null) => void;
  todo: Todo | undefined;
};

export const TodoModal: React.FC<Props> = ({ setSelectedTask, todo }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoaded, setUserLoaded] = useState<boolean>(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setUserLoaded(false);
    const loadData = () => {
      getUser(todo?.userId)
        .then(data => {
          setUser(data);
          setUserLoaded(true);
        })
        .catch(() => {
          setError('User cant be found. Please try again later');
        });
    };

    loadData();
  }, [todo]);

  return (
    <>
      <div className="modal is-active" data-cy="modal">
        <div className="modal-background" />

        <div className="modal-card">
          <header className="modal-card-head">
            <div
              className="modal-card-title has-text-weight-medium"
              data-cy="modal-header"
            >
              Todo #{todo?.id}
            </div>

            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              type="button"
              className="delete"
              data-cy="modal-close"
              onClick={() => setSelectedTask(null)}
            />
          </header>

          <div className="modal-card-body">
            <p className="block" data-cy="modal-title">
              {todo?.title}
            </p>
            {!userLoaded && <Loader />}
            <p className="block" data-cy="modal-user">
              {/* <strong className="has-text-success">Done</strong> */}
              <strong
                className={
                  todo?.completed ? 'has-text-success' : 'has-text-danger'
                }
              >
                {todo?.completed ? 'Done' : 'Planned'}
              </strong>

              {' by '}

              {error === '' ? (
                <a href="mailto:Sincere@april.biz">{user?.name}</a>
              ) : (
                <p>{error}</p>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
