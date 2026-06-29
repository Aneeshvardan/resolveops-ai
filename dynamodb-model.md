# ResolveOps AI - Amazon DynamoDB Event Model

ResolveOps AI uses Amazon DynamoDB as the AWS database for incident signal intake and operational workflow events.

Table name: resolveops-ai-events

Partition key: incidentId string  
Sort key: eventTimestamp string  
Capacity mode: On-demand

Example item:

incidentId: INC-4821  
eventTimestamp: 2026-06-26T13:42:11Z  
source: PagerDuty  
eventType: alert_triggered  
service: payments-api  
severity: SEV1  
summary: Payment error rate exceeded 25 percent after schema migration

DynamoDB is used because incident signals arrive as high-volume, time-ordered events from PagerDuty, Slack, Jira, CloudWatch, Datadog, and Zendesk.