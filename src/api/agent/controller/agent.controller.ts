import { Body, Controller, Get, Param, Post, Query, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AgentService } from '../service/agent/agent.service';
import { SseMessage } from '../dto/sse.dto';
import { MessageDto, SseMessageDto } from '../dto/message.dto';
import { MessageResponseDto } from '../dto/message.response.dto';

@ApiTags('Agent')
@Controller('agent')
export class AgentController {
  constructor(private agentService: AgentService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with the agent' })
  async chat(@Body() messageDto: MessageDto): Promise<MessageResponseDto> {
    return await this.agentService.chat(messageDto);
  }

  @Sse('stream')
  @ApiOperation({ summary: 'Stream agent responses' })
  @ApiResponse({
    status: 200,
    description: 'Returns a stream of agent responses',
    type: SseMessage,
  })
  async stream(
    @Query() messageDto: SseMessageDto,
  ): Promise<Observable<SseMessage>> {
    return await this.agentService.stream(messageDto);
  }

  @Get('history/:threadId')
  @ApiOperation({ summary: 'Get chat history' })
  @ApiResponse({
    status: 200,
    description: 'Returns the chat history',
    type: [MessageResponseDto], // Adjust this to your actual response type
  })
  async getHistory(
    @Param('threadId') threadId: string,
  ): Promise<MessageResponseDto[]> {
    return await this.agentService.getHistory(threadId);
  }
}
