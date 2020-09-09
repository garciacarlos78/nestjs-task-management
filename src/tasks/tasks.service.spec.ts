import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';

const mockUser = { username: 'Test username', id: 1 };
const mockTask = { title: 'Task title', description: 'Task description'};
const mockCreateTaskDto = { title: 'Task title', description: 'Task description'};

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(), 
    delete: jest.fn()
});

describe('TasksService tests', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository }
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    })

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            // mock repository response
            const mockResponse = 'my mocked response';
            taskRepository.getTasks.mockResolvedValue(mockResponse);

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            // call service
            const filters: FilterTaskDto = {
                status: TaskStatus.IN_PROGRESS,
                search: 'my search'
            };
            const result = await tasksService.getTasks(mockUser, filters);

            // expect repository has been called
            expect(taskRepository.getTasks).toHaveBeenCalledWith(mockUser, filters);
            // expect service response be the same as repository response
            expect(result).toEqual(mockResponse);
        });
    });

    describe('getTaskById', () => {
        // task id used for every test
        const id = 5;

        it('gets a task with a given id succesfully', async () =>{
            // mock repository response
            taskRepository.findOne.mockResolvedValue(mockTask);

            // ensure repository has not been called before calling service
            expect(taskRepository.findOne).not.toHaveBeenCalled();
            // call service
            const result = await tasksService.getTaskById(mockUser, id);
            // expect repository has been called with expected params
            expect(taskRepository.findOne).toHaveBeenCalledWith({ 
                where: { id, userId: mockUser.id } });
            // expect service returns repository's response
            expect(result).toEqual(mockTask);
        });

        it('fails retrieving the given task id', () => {
            // mock repository response
            taskRepository.findOne.mockResolvedValue(null);

            // expects service throws exception
            const exception = new NotFoundException(`Task with id ${id} not found.`);
            expect(tasksService.getTaskById(mockUser, id)).rejects.toThrow(exception);            
        });
    });

    describe('createTask', () => {
        it('creates a new task', async () => {
            // mock repository response            
            taskRepository.createTask.mockResolvedValue(mockTask);

            // ensure repository's not been called before service's call
            expect(taskRepository.createTask).not.toBeCalled();
            // call method
            const resultTask = await tasksService.createTask(mockUser, mockCreateTaskDto);
            // ensure repository's method's been called with expected params
            expect(taskRepository.createTask).toBeCalledWith(mockUser, mockCreateTaskDto);
            // ensure service's returned task is the same as repositorie's one
            expect(resultTask).toEqual(mockTask);
        })        
    });

    describe('deleteTask', () => {
        const taskId = 5;

        it('successfully deletes and existing task', async () => {
            // mock success repository result. It returns an object, we don't mind which, that has the property affected with a value different from 0
            taskRepository.delete.mockResolvedValue({ affected: 1});

            // make sure repository's not been called before service's been
            expect(taskRepository.delete).not.toBeCalled();
            // call the service
            await tasksService.deleteTaskById(mockUser.id, taskId);
            // make sure the repository is called with the expected params
            expect(taskRepository.delete).toBeCalledWith({id: taskId, userId: mockUser.id});
        });

        it('tries to delete a non-existing task', () => {
            // mock repository result to 0 affected rows
            taskRepository.delete.mockResolvedValue({affected: 0});

            // define expected exception thrown when repository returns 0 affecte
            const exception = new NotFoundException(`Task with id ${taskId} not found.`);
            // call service
            expect(tasksService.deleteTaskById(mockUser.id, taskId)).rejects.toThrow(exception);
        });
    });

    describe('update task status', () => {
        it('successfully updates task status', async () => {
            const save = jest.fn().mockResolvedValue(true);

            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            });

            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();
            const newStatus = TaskStatus.DONE;
            const taskId = 1;
            const result = await tasksService.updateTaskStatus(mockUser, taskId, newStatus);
            expect(tasksService.getTaskById).toHaveBeenCalledWith(mockUser, taskId);
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(newStatus);
        })
    });
});









































// trick