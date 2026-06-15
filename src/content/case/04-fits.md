---
id: "fits"
order: 4
num: "04"
label: "Where Amber fits"
screenLabel: "Where Amber fits"
title: "Where Amber fits"
---
Amber fills the gap that the existing tools leave open. For developers who want self-hosted durable execution without adding bulky infrastructure, Amber builds on DBOS. DBOS is a durable execution engine that runs embedded in the developer's application, and relies on Postgres alone for persistence and recovery. Nothing else has to be deployed or run alongside the application.

Amber also closes the observability split introduced earlier. It keeps workflow recovery state and agent-level tracing together, so developers can see both whether a workflow recovered and what the agent did inside that recovered run.

<img src="img/amber-capability-table.svg" alt="Only Amber covers agent-aware tracing, workflow-state visibility, token cost, and durable execution." style="display:block;width:100%;height:auto;margin:1.5rem auto;">
