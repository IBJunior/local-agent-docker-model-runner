import { Test, TestingModule } from '@nestjs/testing';
import { ThreadService } from './thread.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ThreadEntity } from '../entities/thread.entity';

const mockThreadRepository = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

describe('ThreadService', () => {
  let service: ThreadService;
  let threadRepository: ReturnType<typeof mockThreadRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThreadService,
        {
          provide: getRepositoryToken(ThreadEntity),
          useFactory: mockThreadRepository,
        },
      ],
    }).compile();

    service = module.get<ThreadService>(ThreadService);
    threadRepository = module.get(getRepositoryToken(ThreadEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
