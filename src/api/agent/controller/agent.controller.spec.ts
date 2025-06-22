import { Test, TestingModule } from '@nestjs/testing';
import { AgentController } from './agent.controller';
import { AgentService } from '../service/agent/agent.service';

describe('AgentController', () => {
  let controller: AgentController;
  let agentService: AgentService;

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
      ],
    }).compile();

    controller = module.get<AgentController>(AgentController);
    agentService = module.get<AgentService>(AgentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
