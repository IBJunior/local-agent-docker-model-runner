import { Observable } from 'rxjs';

export interface IMessagingService {
  publish(channel: string, message: any): Promise<void>;
  subscribe(channel: string, message: any): Observable<string>;
}
