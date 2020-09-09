import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { NotFoundException } from '@nestjs/common';

const mockUser = { username: 'Test username', id: 1 };
const mockTask = { title: 'Task title', description: 'Task description'};

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn()
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
});









































// trick