# Tweeter — Scalable Social Media Platform

Tweeter is a Twitter-like social media application designed to explore **scalable backend architecture**, **cloud-native services**, and **performance-oriented data modeling**. The project emphasizes distributed systems concepts such as asynchronous processing, feed fan-out, and capacity planning.

---

## Features

- User authentication and session management
- Follow / unfollow functionality
- Posting statuses (stories)
- Feed generation with optimized read performance
- Support for users with **high follower counts (10K+)**
- Serverless backend architecture

---

## Architecture Overview

Tweeter follows a **layered architecture** to enforce separation of concerns:

Client (MVP)
└── Presenter
└── Service
└── DAO
└── AWS Infrastructure


### Key Design Decisions

- **Serverless Backend**  
  All backend endpoints are implemented as AWS Lambda functions behind API Gateway, enabling horizontal scalability without server management.

- **Asynchronous Feed Fan-Out**  
  Instead of generating feeds on read, Tweeter pre-computes feeds at write time using **Amazon SQS**. This dramatically reduces read latency for users with large follow lists.

- **Optimized DynamoDB Access Patterns**  
  Data is modeled to minimize queries and leverage partition/sort keys for efficient access to:
  - User stories
  - User feeds
  - Follower and followee relationships
  - Authentication tokens

---

## AWS Services Used

- **AWS Lambda** — Stateless backend compute
- **Amazon API Gateway** — REST API endpoints
- **Amazon DynamoDB** — NoSQL data storage
- **Amazon SQS** — Asynchronous message queue for feed fan-out

---

## Testing

- Automated **integration tests** written with **Jest**
- Mocking and verification using **ts-mockito**
- Tests validate:
  - Status posting
  - Feed correctness
  - End-to-end request flows

---

## Performance & Scalability

- Designed to handle users with **10,000+ followers**
- Uses **batched writes (up to 25 items)** to maximize DynamoDB throughput
- Avoids expensive read-time joins by shifting work to asynchronous write paths
- Capacity planning informed by expected write/read workloads

---

## Tech Stack

- **TypeScript**
- **Node.js**
- **AWS Lambda**
- **DynamoDB**
- **SQS**
- **Jest / ts-mockito**

---

## Learning Outcomes

This project provided hands-on experience with:

- Designing scalable cloud architectures
- Modeling data for NoSQL databases
- Handling high fan-out workloads efficiently
- Writing testable, layered backend systems
- Reasoning about performance tradeoffs in distributed systems

---

## Notes

This project was built as a full-stack, production-style system with an emphasis on **backend scalability, correctness, and performance**, rather than UI polish.
