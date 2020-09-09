import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';

const mockUser = { username: 'Test username' }

const mockTaskRepository = () => ({
    getTasks: jest.fn()
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

            // expect repository have been called
            expect(taskRepository.getTasks).toHaveBeenCalledWith(mockUser, filters);
            // expect service response be the same as repository response
            expect(result).toEqual(mockResponse);
        });
    });
});









































// trick