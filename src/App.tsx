/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos } from './api';

export type FilterByCompletion = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null | undefined>(null);
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [completeStatus, setCompleteStatus] = useState<string>('all');
  const [searchInput, setSearchInput] = useState<string>('');
  const [error, setError] = useState('');

  const todo = todos?.find(t => t.id === selectedTask);
  let filteredTodos = todos;

  switch (completeStatus) {
    case 'active':
      filteredTodos = todos?.filter(task => task.completed === false);
      break;
    case 'completed':
      filteredTodos = todos?.filter(task => task.completed === true);
      break;
    case 'all':
      filteredTodos = todos;
      break;
    default:
      break;
  }

  filteredTodos = filteredTodos?.filter(searchedTodo => {
    return searchedTodo.title
      .toLowerCase()
      .trim()
      .includes(searchInput.toLowerCase().trim())
      ? searchedTodo
      : null;
  });

  useEffect(() => {
    setIsLoaded(false);
    const loadData = () => {
      getTodos()
        .then(data => {
          setTodos(data);
          setIsLoaded(true);
        })
        .catch(() => {
          setError('Todos cant be loaded. Try again later');
        });
    };

    loadData();
  }, []);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>
            {error !== '' && <p>{error}</p>}
            <div className="block">
              <TodoFilter
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                setCompleteStatus={setCompleteStatus}
              />
            </div>

            <div className="block">
              {!isLoaded && <Loader />}
              <TodoList
                selectedTask={selectedTask}
                filteredTodos={filteredTodos}
                setSelectedTask={setSelectedTask}
              />
            </div>
          </div>
        </div>
      </div>

      {selectedTask !== null && (
        <TodoModal setSelectedTask={setSelectedTask} todo={todo} />
      )}
    </>
  );
};
