import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { TaskStatus } from 'src/task-status.enum';

export class FilterTaskDto {
    @IsOptional()
    @IsIn([
        TaskStatus.OPEN, 
        TaskStatus.IN_PROGRESS, 
        TaskStatus.DONE])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}