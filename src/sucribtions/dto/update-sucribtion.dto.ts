import { PartialType } from '@nestjs/swagger';
import { CreateSucribtionDto } from './create-sucribtion.dto';

export class UpdateSucribtionDto extends PartialType(CreateSucribtionDto) {}
