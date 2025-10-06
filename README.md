# FlowGen — Visual Workflow Automation

**FlowGen** is a visual workflow automation platform that lets you design, execute, and monitor automations using a drag-and-drop interface.  
It bridges triggers, actions, and data flow between services — turning complex backend automation into a visual experience.

---

## Features

- **Visual Workflow Builder** — Create automations by connecting triggers and actions in a React Flow-powered canvas.  
- **Dynamic Execution Engine** — Stepwise execution with real-time logging and error handling.  
- **Event-Driven Logic** — Automatically link outputs of one node to inputs of another.  
- **GraphQL API** — Unified data layer for workflows, triggers, and executions.  
- **Clerk Auth Integration** — Secure authentication and session management.  
- **Extensible Architecture** — Easily add new triggers or actions without changing the core engine.  

---

## Tech Stack

| Layer | Technologies |
|--------|---------------|
| **Frontend** | Next.js, React Flow, TailwindCSS, Shadcn/UI |
| **Backend** | Node.js, GraphQL (Apollo Server) |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | Clerk |
| **Realtime** | GraphQL Subscriptions |
| **Automation Engine** | Node.js executors (with Puppeteer support) |

---

## Core Concepts

### Triggers
Define when a workflow starts — Scheduled task.

### Actions
Tasks that execute after a trigger fires — send an email, call an API, update a database, or automate browser actions.

### Workflows
A chain of triggers and actions connected visually to represent logic flow and data movement.

--- 

## Roadmap

- [ ] Workflow templates & marketplace  
- [ ] Multi-user collaboration  
- [ ] Real-time execution analytics  
- [ ] Webhook triggers & SDK integrations  
- [ ] Advanced execution monitoring  

---

