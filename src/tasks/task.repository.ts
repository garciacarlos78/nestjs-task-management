import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilterTaskDto } from './dto/filter-task.dto';
import { User } from '../auth/user.entity';
import { Logger, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    private logger = new Logger('TaskRepository');

    async getTasks(
        user: User,
        filterTaskDto: FilterTaskDto): Promise<Task[]> {
        const { status, search } = filterTaskDto;

        const query = this.createQueryBuilder('task');

        query.andWhere('task.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere(
                '(task.title LIKE :search OR task.description LIKE :search)',
                { search: `%${search}%` });
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch(error) {
            this.logger.error(`User "${user.username} failed to retrieve tasks. Filters: ${JSON.stringify(filterTaskDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createTask(
        user: User,
        createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();

        delete task.user;
        return task;
    }

}