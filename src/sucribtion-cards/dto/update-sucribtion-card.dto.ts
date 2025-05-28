import { PartialType } from '@nestjs/swagger';
import { CreateSucribtionCardDto } from './create-sucribtion-card.dto';

export class UpdateSucribtionCardDto extends PartialType(CreateSucribtionCardDto) {}
