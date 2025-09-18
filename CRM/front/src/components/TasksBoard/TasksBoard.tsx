import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaTimes, FaCheck } from 'react-icons/fa';
import SidebarMenu from '../SidebarMenu/SidebarMenu';
import OrderDetails from '../OrderDetails/OrderDetails';
import './TasksBoard.css';

interface Task {
  id: number;
  title: string;
  price: number;
  status: TaskStatus;
  description: string;
  creationDate: string;
  user: {
    id: number;
    name: string;
    surname: string;
  };
}

enum TaskStatus {
  Incoming = 'Входящие',
  OnApproval = 'На согласовании',
  InProduction = 'В производстве',
  Produced = 'Произведено',
  ToShipment = 'К отгрузке',
  Completed = 'Завершено',
  Cancelled = 'Отменено'
}

type TasksByStatus = {
  [key in TaskStatus]?: Task[];
}

const initialTasks: TasksByStatus = {
  [TaskStatus.Incoming]: [],
  [TaskStatus.OnApproval]: [],
  [TaskStatus.InProduction]: [],
  [TaskStatus.Produced]: [],
  [TaskStatus.ToShipment]: []
};

type UserRole = 'employee' | 'manager' | 'client';

const TasksBoard = () => {
  const [tasks, setTasks] = useState<TasksByStatus>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded: any = jwtDecode(token);
      setRole(decoded.role as UserRole);
      setUserId(decoded.sub);

      const fetchTasks = async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/tasks', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.status === 200) {
            const fetchedTasks: TasksByStatus = response.data.reduce((acc: TasksByStatus, task: Task) => {
              const status: TaskStatus = task.status as TaskStatus;
              if (role !== 'client' || task.user.id === decoded.sub) {
                if (status !== TaskStatus.Completed && status !== TaskStatus.Cancelled) {
                  acc[status] = [...(acc[status] || []), task];
                }
              }
              return acc;
            }, { ...initialTasks });
            setTasks(fetchedTasks);
          }
        } catch (error: any) {
          console.error('Failed to load tasks:', error);
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response body:', error.response.data);
          }
        }
      };

      fetchTasks();
    }
  }, [role]);

  const onDragEnd = async (result: DropResult) => {
    if (role === 'client') return;

    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId !== destination.droppableId || source.index !== destination.index) {
      const sourceColumn = [...(tasks[source.droppableId as TaskStatus] || [])];
      const destColumn = [...(tasks[destination.droppableId as TaskStatus] || [])];

      const [movedTask] = sourceColumn.splice(source.index, 1);

      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.put(`http://localhost:3001/api/tasks/${movedTask.id}`, {
          status: destination.droppableId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          movedTask.status = destination.droppableId as TaskStatus;
          destColumn.splice(destination.index, 0, movedTask);
          setTasks(prev => ({
            ...prev,
            [source.droppableId as TaskStatus]: sourceColumn,
            [destination.droppableId as TaskStatus]: destColumn
          }));
        }
      } catch (error) {
        console.error('Ошибка при обновлении статуса задачи:', error);
        sourceColumn.splice(source.index, 0, movedTask);
        setTasks(prev => ({
          ...prev,
          [source.droppableId as TaskStatus]: sourceColumn
        }));
      }
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    document.body.classList.add('dark-mode');
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
    document.body.classList.remove('dark-mode');
  };

  const updateTaskStatus = async (taskId: number, newStatus: TaskStatus) => {
    if (role !== 'manager') return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://localhost:3001/api/tasks/${taskId}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(prevTasks => {
        const updatedTasks = { ...prevTasks };
        for (const status in updatedTasks) {
          if (updatedTasks[status as TaskStatus]) {
            updatedTasks[status as TaskStatus] = updatedTasks[status as TaskStatus]!.filter(task => task.id !== taskId);
          }
        }
        if (newStatus !== TaskStatus.Completed && newStatus !== TaskStatus.Cancelled) {
          const taskToUpdate = Object.values(prevTasks).flat().find(task => task.id === taskId);
          if (taskToUpdate) {
            updatedTasks[newStatus] = [...(updatedTasks[newStatus] || []), { ...taskToUpdate, status: newStatus }];
          }
        }
        return updatedTasks;
      });
    } catch (error) {
      console.error('Ошибка при обновлении статуса задачи:', error);
    }
  };

  return (
    <div className="tasks-board-container">
      {role && <SidebarMenu role={role} onLogout={handleLogout} />}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <Droppable droppableId={columnId} key={columnId} isDropDisabled={role === 'client'}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="column"
                  style={{ backgroundColor: snapshot.isDraggingOver ? '#2b2b42' : undefined }}
                >
                  <h2>{columnId}</h2>
                  {columnTasks?.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index} isDragDisabled={role === 'client'}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="task"
                          onClick={() => handleTaskClick(task)}
                        >
                          <div className="task-header">
                            {role === 'manager' && task.status === TaskStatus.OnApproval && (
                              <FaTimes className="task-icon" onClick={(e) => {
                                e.stopPropagation();
                                updateTaskStatus(task.id, TaskStatus.Cancelled);
                              }} />
                            )}
                            {role === 'manager' && task.status === TaskStatus.ToShipment && (
                              <FaCheck className="task-icon" onClick={(e) => {
                                e.stopPropagation();
                                updateTaskStatus(task.id, TaskStatus.Completed);
                              }} />
                            )}
                          </div>
                          <h3>{task.title}</h3>
                          <p>{task.price.toLocaleString()} ₽</p>
                          <p>{task.user.name} {task.user.surname}</p>
                          <p>{new Date(task.creationDate).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                          <p>{task.description}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      {selectedTask && (
        <OrderDetails
          orderId={selectedTask.id}
          userRole={role as UserRole}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default TasksBoard;
