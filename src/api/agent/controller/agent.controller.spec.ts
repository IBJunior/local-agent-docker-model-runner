import { Test, TestingModule } from '@nestjs/testing';
import { AgentController } from './agent.controller';
import { AgentService } from '../service/agent/agent.service';
import { ThreadService } from 'src/agent/thread/thread.service';

describe('AgentController', () => {
  let controller: AgentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentController],
      providers: [
        {
          provide: AgentService,
          useValue: {
            chat: jest.fn(),
            stream: jest.fn(),
          },
        },
        {
          provide: ThreadService,
          useValue: {
            getThreads: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AgentController>(AgentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
