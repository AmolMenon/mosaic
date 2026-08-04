export interface DeadLetterQueueConfig {
  maxRetries: number;
  initialBackoffMs: number;
  maxBackoffMs: number;
  jitter: boolean;
}

export interface RetryPolicy {
  attempt: number;
  nextRetryAt?: Date;
  isExhausted: boolean;
}

export interface QueueMessage {
  id: string;
  payload: any;
  retryCount: number;
  lastError?: string;
}

export interface DeadLetterQueueProvider {
  enqueue(queueName: string, message: QueueMessage): Promise<void>;
  dequeue(queueName: string): Promise<QueueMessage | null>;
  moveToDlq(originalQueue: string, message: QueueMessage, reason: string): Promise<void>;
  calculateNextRetry(currentAttempt: number, config: DeadLetterQueueConfig): RetryPolicy;
}
